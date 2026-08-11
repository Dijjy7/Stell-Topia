# Soroban Contracts

This workspace contains the on-chain Soroban smart contracts that implement the
Stell-Topia protocol. Each contract has a single responsibility and communicates
with its siblings through Soroban's contract-to-contract calls.

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    stell-topia-contracts                     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  policies   │◄───│  lifecycle  │◄───│  receipts   │     │
│  │             │    │             │    │             │     │
│  │ • can_mail  │    │ • bind      │    │ • delivered │     │
│  │ • evaluate  │    │ • verify_*  │    │ • read      │     │
│  │ • set_policy│    │ • get       │    │ • get       │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         ▲                   ▲                   ▲           │
│         │                   │                   │           │
│  ┌─────────────┐    ┌─────────────┐                         │
│  │  postage    │◄───│  backend /  │                         │
│  │             │    │  API relay  │                         │
│  │ • submit    │    │             │                         │
│  │ • settle    │    └─────────────┘                         │
│  │ • refund    │                                            │
│  │ • expire    │                                            │
│  │ • dispute   │                                            │
│  │ • reclaim   │                                            │
│  └─────────────┘                                            │
│                                                             │
│  Cross-cutting concerns:                                    │
│  • Policies → evaluates sender eligibility                 │
│  • Lifecycle → tracks message terminal state               │
│  • Postage → escrows and releases tokens                   │
│  • Receipts → records delivery and read receipts           │
└─────────────────────────────────────────────────────────────┘
```

## Contracts

### policies

Manages per-mailbox access control policies. Evaluates whether a sender is
allowed to submit postage based on explicit allow/block rules, verification
status, receipt requirements, and per-sender tiers.

Key types: `MailboxPolicy`, `SenderRule`, `PolicyReason`, `PolicyDecision`

### lifecycle

Tracks the cross-contract lifecycle of a message. Binds sender, recipient,
amount, and policy context at submission time, then verifies postage state
transitions and delivery receipts.

Key types: `LifecycleRecord`, `LifecycleTerminal`, `LifecycleConfig`

### postage

Manages sender-authorized token escrow for protocol messages. Each message has
a single `Postage` record whose status progresses through a well-defined
lifecycle. Every state transition emits a `PostageEvent`.

Key types: `Postage`, `EscrowConfig`, `PostageStatus`

### receipts

Records delivery and read receipts for messages. The sender authorizes
`delivered`; the recipient authorizes `read`. Each operation is guarded by the
lifecycle contract to ensure consistency with the message's terminal state.

Key types: `Receipt`, `ReceiptState`

## Spec-driven TypeScript bindings

Each contract ships a `spec.json` that describes its on-chain interface. The
`scripts/generate-contract-bindings.mjs` script reads these files and emits
typed TypeScript clients to `src/services/stellar/contracts/`.

After any contract interface change:

```sh
cd contracts/soroban
UPDATE_SPEC=1 cargo test -p stealth-{name} spec_json
cargo test -p stealth-{name}
node ../../scripts/generate-contract-bindings.mjs
```

## Testing

Each contract has inline `#[cfg(test)]` modules covering:

- Unit tests for core state transitions
- Event schema pinning (topic layout and data payload)
- Storage key discriminant pinning
- Property-based tests via `proptest`
- Cross-contract interoperability vectors from `protocol/vectors/vectors.json`

Run all contract tests:

```sh
cd contracts/soroban
cargo test
```
