# CarbonX: Remove Prize Pool From Landing Hero (Runbook)

This note is a repeatable checklist for removing the **Prize Pool number + caption** from the CarbonX landing hero.

## Where it lives

- Page file: `src/pages/CarbonX.tsx`
- The hero section is under the comment `/* Hero */`.
- The prize UI is a `<div className="landing-prize">…</div>` block placed **between**:
  - the `<h1 className="landing-title">…</h1>` (CARBONX 2026 heading), and
  - the `<p className="landing-subtitle">…</p>` (one-line description)

## How to remove it (exact steps)

1. Open `src/pages/CarbonX.tsx`.
2. Search for `landing-prize` (or `prizeAmount` / `prizeCaption`).
3. Delete the entire block:
   - `<div className="landing-prize">`
   - the nested `DecryptedText` that renders `carbonX.prizeAmount`
   - the caption that renders `carbonX.prizeCaption`
   - and the closing `</div>`
4. Save the file.

## Optional follow-ups (only if needed)

### If you also want to remove the data source

The hero currently reads the prize info from the `carbonX` constant at the top of `src/pages/CarbonX.tsx`.

- Remove these keys if they’re no longer used anywhere else:
  - `prizeAmount`
  - `prizeCaption`

Do this only after confirming there are no other references (use ripgrep).

### If spacing looks “too tight” or “too loose”

The prize block contributed vertical rhythm. If the hero feels off after removal:

- Check `.landing-title` and `.landing-subtitle` spacing in `src/index.css`.
- Common tweaks:
  - increase/decrease `.landing-subtitle { margin-top: ... }`
  - add a small `mt-*` utility to the subtitle paragraph in `CarbonX.tsx`

Keep changes minimal to match the existing theme.

## Verify

Run a production build (fastest confidence check):

```bash
bun run build
```

Then sanity-check the hero:

- CARBONX title + year renders
- subtitle renders right under the title (no prize pool number/caption)
- the “2 TRACKS” teaser still fits nicely above the CTA row

## Quick grep commands

```bash
rg -n "landing-prize|prizeAmount|prizeCaption" src/pages/CarbonX.tsx
rg -n "landing-prize" src/index.css
```

