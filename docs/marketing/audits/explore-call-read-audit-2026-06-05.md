# Explore Call Read Audit

Date: 2026-06-05

Asset:

- Live: `https://talleywealth.com/brands/talley-wealth/A_Short_Read_Before_We_Talk.pdf`
- Local: `public/brands/talley-wealth/A_Short_Read_Before_We_Talk.pdf`
- Source added: `tools/explore-call-read/A_Short_Read_Before_We_Talk.source.html`

## Intent

This PDF is a send-ahead orientation piece for prospects before a Talley Wealth Explore Call. It should make the first call warmer, clarify that the call is a fit check, and help the right prospect bring the real decision or concern that prompted them to schedule.

It is not a general lead magnet, an investment brochure, or a full Keystone sales deck.

## Source-Of-Truth Checks

- The Explore Call confirmation page tells prospects there is nothing formal to prepare and links to this PDF as a short note before the call.
- The relationship-system docs treat an Explore Call booking as real prospect intent, with qualification still reserved for David's judgment after the conversation.
- The two current market-facing lanes are:
  - tax-smart retirement in Northeast Tennessee
  - business owner tax strategy and personal wealth
- The broader service-model categories remain:
  - retirees and retirement-transition households
  - business owners
  - high earners and accumulators
- The brand system supports the existing visual feel: deep navy, warm gold, editorial restraint, real clarity, and no-pressure Explore Call language.

## What Is Great

- The cover is visually strong: navy field, gold detail, restrained logo use, generous whitespace, and calm editorial hierarchy.
- The phrase "send-ahead, not a pitch" is exactly right for the moment.
- The personal-note posture fits David's voice better than a generic prospect brochure.
- The six-page length is appropriate: substantial enough to orient a prospect, short enough not to feel like homework.
- The visual system already feels premium, calm, and aligned with the Talley Wealth site.

## Where The Old Asset Was Off

Because the checked-in asset was only a binary PDF, the audit focuses on the visible cover, delivery context, and current positioning drift rather than a text diff from a source document.

| Page | Current message / role | Intended prospect reaction | Target-market alignment | Design-system fit | Keep / change / remove | Rewrite direction |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Establish a warm pre-call note. | "This feels personal, calm, and not salesy." | Market-neutral, which is acceptable for the cover. | Strong. Preserve. | Keep. | Preserve cover structure and wording with only light polish. |
| 2 | Orient the prospect to the Explore Call. | "I know why I received this and what the call is for." | Needed stronger connection to retirement and owner complexity. | Strong editorial feel. | Change. | Clarify no prep, fit check, bring the question that prompted the call. |
| 3 | Help prospects self-recognize. | "This sounds like the kind of situation I am in." | Needed clearer two-lane emphasis. | Preserve premium card/band rhythm. | Change. | Lead with retirement-transition and business-owner situations; keep secondary audiences as supporting examples only. |
| 4 | Preview David's thinking. | "He understands how these decisions connect." | Should translate coordination into lived decisions. | Strong fit if kept restrained. | Change. | Use plain-English diagnostic questions rather than advisor-side language. |
| 5 | Explain what happens after the call. | "There is a sensible next step, but no pressure." | Needed to avoid over-selling Keystone before fit is established. | Strong fit. | Change. | Explain Keystone as the deeper process only after fit is clear. |
| 6 | Close with simple preparation guidance. | "I know what to bring and I am not expected to perform." | Should name the two primary lanes without excluding legitimate broader complexity. | Strong fit. | Change. | Bring the unresolved retirement, business/tax, or connected-planning question. |

## Update Decisions

The first replacement pass overcorrected. It turned the PDF into too much of a positioning recap when the old piece mostly worked as an elegant pre-call orientation packet.

Final update direction:

- Restore the original six-section architecture:
  - cover
  - the path ahead
  - who this is actually for
  - what to expect on the Explore Call
  - the people you'll work with
  - why I do this work
- Preserve the original visual language: spacious, editorial, restrained, calm, understated.
- Make Section 02 the main visible content change.
- Shift Section 02 away from "families and professionals approaching financial independence" and toward people facing connected retirement, tax, business-owner, investment, estate, or family-wealth decisions.
- Replace the heavy equity-compensation emphasis with business-owner coordination and investments serving the plan.
- Keep the right-column "questions that tend to sound like yours" format, but include a business-owner/tax-complexity example.
- Lightly broaden the closing note so it is not retirement-only, while preserving David's voice and the emotional clarity of the original.
- Leave the path-ahead, Explore Call logistics, team page, and overall cover concept substantially intact.

## Verification Checklist

- PDF remains six pages.
- Cover remains visually close to the existing asset.
- Page text fits within print-safe page boundaries.
- `explore-call-read-cover.jpg` is regenerated from the revised PDF cover.
- The linked public asset path remains unchanged.
- Content matches:
  - `docs/brand-system-refined.md`
  - `docs/marketing/two-lane-marketing-system.md`
  - `tools/keystone-client-experience/planning-meeting-service-model.md`
  - `src/pages/explore-call-confirmed.astro`
  - `docs/marketing/reconciliation/talley-wealth-relationship-system-one-pager.md`
