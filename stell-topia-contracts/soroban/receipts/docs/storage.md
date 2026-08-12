# Receipts Contract — Storage Layout & Migration Notes

The receipts contract uses two Soroban storage spaces, keyed by the `DataKey` enum
defined in `src/lib.rs`.

| Variant                | Storage space | Written by                     | Read by                      |
| ---------------------- | ------------- | ------------------------------ | ---------------------------- |
| `DataKey::Guard`       | Instance      | `configure_guard` (once)       | `guard`, `delivered`, `read` |
| `DataKey::Receipt(id)` | Persistent    | `delivered` (first write only) | `delivered`, `read`, `get`   |

`Guard` is a single, contract-wide configuration value set at most once
(`GuardAlreadyConfigured` on a second call). `Receipt(id)` is keyed by the 32-byte
message id and holds the full `Receipt` record; `delivered` creates it and `read`
updates its `read_at` field in place — the key itself never changes shape or moves
storage space.

## Storage lifetime (TTL) & archival

Soroban assigns every storage entry a TTL and **archives** it once the TTL lapses;
an archived entry reads back as absent. For this contract that is a *security*
property, not just a liveness one. `delivered` enforces commitment immutability by
reading the existing persistent `Receipt` and rejecting a re-commit with a different
payload (`CommitmentMismatch`) or any overwrite (`DuplicateReceipt`). If the
`Receipt` entry were archived, that lookup would see "absent", so a caller holding
the sender's authorization could record a *different* commitment under the same
`message_id` — silently defeating the guarantee that
`duplicate_id_with_different_payload_fails` and the
`property_delivery_immutability_invariants` proptest exist to protect. Archival would
likewise break `read`/`get` and any off-chain consumer relying on the receipt.

To resist archival, every **write path** extends the TTL of the entries it touches,
using constants defined in `src/lib.rs` (`LEDGERS_PER_DAY = 17_280`, ~5s ledger close):

| Entry              | Storage    | Extend when TTL below | Extend up to        | Extended by                     |
| ------------------ | ---------- | --------------------- | ------------------- | ------------------------------- |
| `Receipt(id)`      | Persistent | `RECEIPT_TTL_THRESHOLD` (~30d) | `RECEIPT_TTL_EXTEND_TO` (~90d) | `delivered`, `read`     |
| `Guard`            | Instance   | `INSTANCE_TTL_THRESHOLD` (~7d) | `INSTANCE_TTL_EXTEND_TO` (~30d) | `configure_guard`, `delivered`, `read` |

Both extend-to targets stay well under any network's `max_entry_ttl`, so `extend_ttl`
never traps. The getters `get` and `guard` are deliberately left as **pure reads**:
they do not extend TTL, so read-only simulation by indexers keeps a read-only
footprint and predictable fees.

**Residual limit.** A receipt that is delivered and then never read (or otherwise
re-touched) still archives after its ~90-day window elapses, because nothing bumps it
in the interim. Callers that require an unconditionally permanent record should either
touch such receipts periodically from an off-chain keeper or add a read-path TTL
extension; the contract's best-effort policy is to extend on every write. The TTL
extension is covered by `configure_guard_extends_instance_ttl`,
`delivered_extends_receipt_and_instance_ttl`, and `read_re_extends_receipt_ttl` in the
`test` module.

## How `DataKey` is encoded

Soroban's `#[contracttype]` derive encodes each enum variant as a host vector whose
first element is a `Symbol` built from the variant's Rust _name_ (`"Guard"`,
`"Receipt"`), followed by any tuple fields. Decoding looks up a previously-written
key by that name among the enum's _current_ variants — the numeric declaration
order plays no part in the encoding. Concretely, this means:

- **Renaming or removing a variant that has ever written storage is unsafe.** The
  encoded `Symbol` changes (or disappears), so any key written under the old name
  becomes permanently undecodable and its ledger entry is orphaned.
- **Changing a variant's tuple field types is unsafe** for the same reason: the
  encoded shape no longer matches what was previously persisted.
- **Reordering variants is safe** on its own, since decoding is name-based, not
  positional. New variants should still be appended at the end, both to keep
  declaration order matching historical introduction order, and to stay consistent
  with the convention used by the other Soroban contracts in this workspace (see
  `contracts/soroban/policies/src/lib.rs`).

## Migrating a key's structure

If a key's structure ever needs to change (e.g. a new `Receipt` field that must be
part of the key rather than the stored record, or splitting `Receipt` into a
tiered key), do not repurpose the existing variant. Instead:

1. Leave the existing variant (`Receipt(BytesN<32>)`) in place so already-written
   entries stay readable under it.
2. Add a new variant (e.g. `ReceiptV2(BytesN<32>, u32)`) for the new shape.
3. Give read paths an explicit fallback: try the new key, and if absent, fall back
   to the old key (and optionally backfill the new key on read or via a dedicated
   migration entry point).
4. Document the coexistence period and removal plan for the old variant here.

No such migration is in progress today; this document exists so the first one
starts from an explicit, reviewed plan rather than an ad hoc rename.

## Test coverage

The `storage_keys` test module in `src/lib.rs` pins the encoded discriminant name
for each `DataKey` variant (`guard_key_discriminant_is_pinned`,
`receipt_key_discriminant_is_pinned`) so an accidental rename fails CI before it
can reach production, and verifies that distinct message ids never collide in
persistent storage (`distinct_message_ids_produce_distinct_receipt_keys`).
