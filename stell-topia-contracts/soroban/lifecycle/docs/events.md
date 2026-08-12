# Lifecycle Contract — Event Schema

The lifecycle contract emits events on every terminal transition. Off-chain
consumers (relays, indexers, clients) filter and decode them straight from the
ledger.

Both events are defined with `#[contractevent(topics = ["lifecycle"])]` in
`src/lib.rs`.

## `bind`

Emitted exactly once per message, when `bind(...)` creates the initial
lifecycle record.

| Part  | Position | Type            | Value                                                           |
|-------|----------|-----------------|-----------------------------------------------------------------|
| Topic | 0        | `ScVal::Symbol` | `"lifecycle"` (fixed prefix)                                    |
| Topic | 1        | `ScVal::Symbol` | `"bind"`                                                        |
| Topic | 2        | `ScVal::Bytes`  | `message_id` (32 bytes)                                         |
| Data  | —        | `ScVal::Map`    | The `LifecycleRecord` struct as a bare value                    |

## `delivered`

Emitted exactly once per message, when `verify_delivered(...)` transitions the
record to `Delivered`.

| Part  | Position | Type            | Value                                                           |
|-------|----------|-----------------|-----------------------------------------------------------------|
| Topic | 0        | `ScVal::Symbol` | `"lifecycle"`                                                   |
| Topic | 1        | `ScVal::Symbol` | `"delivered"`                                                   |
| Topic | 2        | `ScVal::Bytes`  | `message_id` (32 bytes)                                         |
| Data  | —        | `ScVal::Map`    | The `LifecycleRecord` struct, with `terminal = Delivered`       |

## `read`

Emitted at most once per message, when `verify_read(...)` transitions the
record to `Read`.

| Part  | Position | Type            | Value                                                           |
|-------|----------|-----------------|-----------------------------------------------------------------|
| Topic | 0        | `ScVal::Symbol` | `"lifecycle"`                                                   |
| Topic | 1        | `ScVal::Symbol` | `"read"`                                                        |
| Topic | 2        | `ScVal::Bytes`  | `message_id` (32 bytes)                                         |
| Data  | —        | `ScVal::Map`    | The `LifecycleRecord` struct, with `terminal = Read`            |

## Terminal events

The remaining transitions (`settle`, `refund`, `dispute`, `expire`, `reclaim`)
follow the same topic layout, with action symbols `"settle"`, `"refund"`,
`"dispute"`, `"expire"`, and `"reclaim"` respectively. The embedded record's
`terminal` field always matches the action.

## Consumer guarantees

- **Filtering**: subscribe by contract address plus topic 1 (the action
  symbol), and narrow to a single message with topic 2.
- **Ordering**: for any `message_id`, transitions follow the state machine
  order; each terminal event is emitted at most once.
- **Failure paths emit nothing**: rejected calls publish no events and write no
  state. An observed event always corresponds to persisted state.
- **Stability**: field additions, topic reordering, renames, or a data-format
  change are schema breaks. The event schema tests in `src/lib.rs` pin the
  current layout.
