# `/claude/family` — technical blueprint to evolve mock into production

This document explains how the Family & Dependants screen should move from static preview to a real flow for **parent/relative-managed dependant accounts** in Plasmmer Accounts.

## 1) Product objective

Enable a parent/relative (already authenticated with Plasmmer/WaaP) to:

1. Add a dependant account.
2. Configure age-appropriate safeguards.
3. Link or create a wallet identity for the dependant.
4. Keep an auditable (but privacy-minimized) governance trail.
5. Upgrade the dependant to independent control later (age/maturity/legal milestones).

## 2) End-to-end flow (WaaP-aligned)

### 2.1 Parent/relative bootstrap (existing flow)

- Parent signs in with current Plasmmer Account flow (`initWaaP`, Bluesky social login).
- Parent wallet session and `accountId` are established via existing bootstrap mechanism (`local` or API).

### 2.2 Dependants flow entry

- Parent opens `/claude/family` (future production endpoint, not just preview).
- Parent starts `Create dependant` and submits:
  - relationship claim,
  - jurisdiction (at least country, preferably legal region/profile),
  - age-band attestation,
  - explicit guardian responsibility acceptance.

### 2.3 Dependants identity model options

#### Option A — existing dependant wallet is linked

Use when dependant already has a wallet or WaaP identity.

- Parent submits dependant identifier (DID/address/login proof).
- Backend verifies linkage consent flow and legal eligibility for custody mode.
- System attaches policy bundle to dependant account (limits, moderation, spend controls, messaging controls).

#### Option B — derive/create dependant wallet under supervised custody

Use when dependant does not yet have an identity.

- Parent initiates wallet creation through WaaP derivation process with custody flags.
- Backend tags account as `managed_dependant` with required safeguards.
- Account is not equivalent to unrestricted adult profile.

## 3) Architecture sketch

## 3.1 Core entities

- `guardian_account`: existing Plasmmer account (WaaP-authenticated).
- `dependant_account`: child/teen profile with policy envelope.
- `guardianship_link`: relation between guardian and dependant with metadata:
  - relation type,
  - legal basis,
  - jurisdiction,
  - createdAt / reviewedAt / expiresAt,
  - emergency escalation contacts.
- `safeguard_policy`: configurable controls (chat, marketplace, spending, discovery).

### 3.2 Storage boundaries

- Onchain: only non-PII pointers/attestations (hash, issuer ID, expiry, revocation pointer).
- Offchain: legal/PII-sensitive records (consent docs, proof artifacts, moderation evidence with strict retention).
- Never place raw minor PII onchain.

## 4) Gnosis Safe design for dependant custody

## 4.1 Why Safe pattern fits

A Safe-style smart account allows progressive control transitions without changing UX drastically:

- guardians can be required co-signers initially,
- policy modules can restrict operations,
- ownership threshold can be changed when dependant is eligible for independence.

### 4.2 Suggested owner/threshold progression

#### Stage 0 — fully guardian-controlled bootstrap

- Owners: guardian key(s), optional recovery guardian DAO key.
- Threshold: 1-of-N or 2-of-N based on risk.
- Dependant key may be absent or observer-only.

#### Stage 1 — shared control adolescence mode

- Owners: guardian key + dependant key.
- Threshold: 2-of-2 for sensitive ops; policy module may allow low-risk actions with weaker threshold.

#### Stage 2 — independent adult mode

- Owners: dependant key primary; guardian removed or demoted to recovery role.
- Threshold adjusted to dependant autonomy and recovery strategy.

### 4.3 Policy modules (transaction guardrails)

Implement Safe-compatible guards/modules to enforce:

- spending caps by period,
- blocklist/allowlist by destination/protocol,
- cooldown for high-risk transfers,
- anti-scam friction (second confirmation, delay windows),
- restrictions for newly-created counterparties.

### 4.4 Address continuity vs signer upgrades

A key design goal is keeping the **same Safe account address** while changing owners/threshold over time.

- This is feasible with Safe owner management transactions.
- It preserves app/account continuity and historical references.

Important correction regarding quantum-resistance claims:

- A classic EVM address is **not automatically quantum-resistant**.
- Security depends on signature scheme and transaction exposure patterns.
- Upgrading signers to post-quantum-capable systems requires chain/ecosystem support, wallet infra support, and likely new validation contracts/abstractions.
- Treat post-quantum migration as a roadmap initiative, not a present guarantee.

## 5) Key derivation warning (critical)

The idea of deriving child keys directly from a parent's Ethereum signature “as seed” is risky by default.

Risks:

- replay/nonce ambiguity if derivation domain is weak,
- catastrophic coupling if parent key is compromised,
- legal/accountability blur between guardian actions and dependant autonomy,
- hard-to-audit determinism mistakes.

Safer pattern:

- use established KDF/HD derivation standards with explicit domain separation,
- include dependant-specific salt/context and server-side policy checks,
- enforce independent key material introduction as soon as feasible,
- log derivation metadata for audit (without storing secrets).

## 6) Bluesky account creation for minors — legal and social risk map

### 6.1 Legal/compliance risks

- COPPA (US) and ECA/LGPD context (BR) can trigger parental consent, data minimization, and strict handling requirements.
- Guardian-created social identities for minors can become unlawful if platform ToS or local law conditions are not met.
- Liability can shift to operator if safeguards are symbolic instead of enforceable.

### 6.2 Social harm risks

- coercive identity control by abusive guardians,
- unwanted surveillance of minor communications,
- grooming/scam attack surface in social graph and marketplaces,
- lock-in where child cannot later reclaim identity autonomy.

### 6.3 Mitigation alternatives

- delayed social handle issuance (wallet/account first, social later),
- pseudonymous teen mode with strict interaction constraints,
- third-party age/consent attestation provider with revocation flows,
- mandatory transition path to independent control at legal maturity.

## 7) Safeguards that should be enforceable (not just UI text)

- messaging restrictions by trust tier/age band,
- transaction limits by age + account reputation,
- anti-rug marketplace controls (listing maturity/cooldown),
- mandatory moderation escalation for grooming/scam indicators,
- tamper-evident event logs with role-based access and oversight.

## 8) Implementation checklist for this screen

1. Add backend API for guardianship links and policy creation.
2. Integrate WaaP session for authenticated guardian action signing.
3. Add policy engine (server + onchain guard compatibility).
4. Add Safe deployment/owner-management orchestration service.
5. Add compliance service hooks (attestation, consent proofs, revocation).
6. Add audit stream + incident response dashboard.
7. Add migration workflow: dependant-to-independent transition.

## 9) Non-negotiables

- No raw minor PII onchain.
- No “teen-safe” as cosmetic toggle only.
- No irreversible lock controlled only by guardian.
- No quantum-security marketing promises before technical reality.
