# Lifecycle Contract — Storage Layout & Migration Notes

The lifecycle contract uses two Soroban storage spaces, keyed by the `DataKey`
enum defined in `src/lib.rs`.

| Variant                | Storage space | Written by          | Read by                        |
|------------------------|---------------|---------------------|--------------------------------|
| `DataKey::Config`      | Instance      | `initialize`        | `config`, `bind`, `verify_*`   |
| `DataKey::Record(id)`  | Persistent    | `bind`              | `verify_*`, `get`              |

`Config` is a single, contract-wide configuration value set once. `Record(id)`
is keyed by the 32-byte message id and holds the full `LifecycleRecord`; every
subsequent transition updates it in place.

## How `DataKey` is encoded

Soroban's `#[contracttype]` derive encodes each enum variant as a host vector
whose first element is a `Symbol` built from the variant's Rust *name*
(`"Config"`, `"Record"`), followed by any tuple fields. Decoding looks up a
previously-written key by that name among the enum's current variants.

- **Renaming or removing a variant that has ever written storage is unsafe.**
- **Changing a variant's tuple field types is unsafe.**
- Reordering variants is safe, but new variants should still be appended at the
  end.

## Migrating a key's structure

If a key's structure ever needs to change:

1. Leave the existing variant in place so already-written entries stay readable.
2. Add a new variant for the new shape.
3. Give read paths an explicit fallback: try the new key, and if absent, fall
   back to the old key.

No such migration is in progress today.
