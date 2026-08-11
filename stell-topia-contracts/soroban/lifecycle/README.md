# Lifecycle Contract

Tracks the cross-contract lifecycle of a Stealth message from initial sender
authorization through delivery, read receipt, and terminal postage resolution.
Each message has a single `LifecycleRecord` whose `terminal` field progresses
through a well-defined state machine. Every terminal transition emits a
`LifecycleEvent` that indexers and wallets can subscribe to.

## Event Schema

All contract events share a fixed topic prefix of `["lifecycle"]` followed by
the action name and the message identifier:

| Topic index | Type          | Description                              |
|-------------|---------------|------------------------------------------|
| 0           | `Symbol`      | Fixed contract prefix: `"lifecycle"`     |
| 1           | `Symbol`      | Action name (see below)                  |
| 2           | `BytesN<32>`  | Unique message identifier                |

The event data is a serialized `LifecycleRecord` snapshotted **after** the
state transition is applied.

### Action Symbols

| `action` value   | Emitted by                         | Resulting `LifecycleTerminal` |
|------------------|------------------------------------|-------------------------------|
| `"bind"`         | `LifecycleContract::bind`          | `Open`                        |
| `"delivered"`    | `LifecycleContract::verify_delivered` | `Delivered`               |
| `"read"`         | `LifecycleContract::verify_read`   | `Read`                        |
| `"settle"`       | `LifecycleContract::verify_settle` | `Settled`                     |
| `"refund"`       | `LifecycleContract::verify_refund` | `Refunded`                    |
| `"dispute"`      | `LifecycleContract::verify_dispute` | `Disputed`                   |
| `"expire"`       | `LifecycleContract::verify_expire` | `Expired`                     |
| `"reclaim"`      | `LifecycleContract::verify_reclaim` | `Reclaimed`                  |

## Lifecycle State Machine

```text
                    bind
  [start] ──────────────────► Open
                              │
                    delivered │
                              ▼
                         Delivered
                              │
                         read   │
                              ▼
                          Read
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
      settle               refund              expire
         │                    │                    │
         ▼                    ▼                    ▼
      Settled             Refunded             Expired
                                                │
                                            dispute │
                                                    ▼
                                                Disputed
                                                    │
                                         refund / reclaim
```

## Cross-Contract Dependencies

The lifecycle contract delegates policy evaluation to the **policies** contract
and postage state verification to the **postage** contract. It also verifies
receipt operations through the **receipts** contract when `verify_delivered` or
`verify_read` is called.

| Dependency   | Purpose                                              |
|--------------|------------------------------------------------------|
| policies     | Evaluates `can_mail` / `evaluate` for sender rules  |
| postage      | Validates postage state before terminal transitions  |
| receipts     | Guards delivery and read receipt operations          |

## Interface

- `initialize(policies, postage, receipts)` binds the three sibling contracts.
- `config()` reads the bound contract addresses.
- `bind(...)` creates the initial lifecycle record for a message.
- `verify_settle / verify_refund / verify_dispute / verify_expire / verify_reclaim`
  validate postage state and transition the terminal.
- `verify_delivered / verify_read` validate receipt state and transition.
- `get(message_id)` reads the current record.

## Storage

| Variant                | Storage space | Written by          | Read by                        |
|------------------------|---------------|---------------------|--------------------------------|
| `DataKey::Config`      | Instance      | `initialize`        | `config`, `bind`, `verify_*`   |
| `DataKey::Record(id)`  | Persistent    | `bind`              | `verify_*`, `get`              |

## Contract Spec Regeneration Check

`spec.json` feeds `scripts/generate-contract-bindings.mjs`, which emits the
typed TypeScript client in `src/services/stellar/contracts/lifecycle.ts`.

After an interface change, regenerate and verify with:

```sh
cd contracts/soroban
UPDATE_SPEC=1 cargo test -p stealth-lifecycle spec_json
cargo test -p stealth-lifecycle
node ../../scripts/generate-contract-bindings.mjs
```
