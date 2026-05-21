# Talley Wealth Email Marketing Plan

## Current Working Funnel

Audience: Talley Wealth - Marketing

Guide download path:
- Website form submits the contact to Mailchimp.
- The contact profile field `Source` is set to `guide`.
- Mailchimp automation `Guide Source Auto-Tag` adds the tag `Guide - Are You On Track`.
- Mailchimp automation `Are You On Track - Guide Download Drip` sends the guide sequence.

Footer signup path:
- Website footer form submits the contact to Mailchimp.
- The contact profile field `Source` is set to `footer`.
- The contact receives the tag `Footer Signup`.

## Site Integration Requirements

The Astro endpoint `/api/newsletter/subscribe` should preserve:
- `MERGE0`: email address
- `MERGE1`: first name
- `MERGE2`: last name
- `MERGE5`: Source
- Guide tag ID: `9169304`
- Footer Signup tag ID: `9169355`

If `PLATFORM_API_BASE_URL` is set, the site proxies to the existing platform backend.
If not, the endpoint posts directly to Mailchimp's hosted form endpoint.

## Positioning

Footer signup should not feel like a generic newsletter. Use:

Name: Planning Notes

Short description:
Occasional plain-English notes on retirement, tax planning, and decisions worth thinking through before they become urgent.

Primary CTA:
Get Planning Notes

## Guide Drip Revision Direction

Do not make the sequence longer at first. Improve the existing three-email flow.

Principles:
- Sound like David continuing the conversation after someone requested the guide.
- Keep each email focused on one idea.
- Use a soft CTA, not a hard sales pitch.
- Make the Explore Call feel like the natural next step if the guide raises questions.
- Keep compliance review simple by avoiding promissory language, testimonials, or individualized advice.

## Draft Sequence

### Email 1

Subject: Your guide is ready

Purpose:
Deliver the guide and tell the reader what to pay attention to.

Draft:

Hi *|FNAME|*,

Here is the guide you requested:

Are You Actually On Track?

The most useful way to read it is not as a checklist of perfect answers. Read it for the questions that make you pause.

For most people, the retirement number is only the starting point. The deeper question is whether the moving parts around that number actually work together: spending, timing, taxes, investment risk, healthcare, Social Security, and the way life may change over a long retirement.

If one section feels especially relevant, that is probably where the real planning conversation begins.

David Talley, CFP®
Talley Wealth · Johnson City, TN

Compliance note:
Educational content only. Not individualized investment, tax, or legal advice.

### Email 2

Subject: The risk most people do not see in the average return

Purpose:
Explain sequence risk and connect it to the guide/calculator without overwhelming the reader.

Draft:

Hi *|FNAME|*,

One of the most important ideas in the guide is sequence risk.

Two retirees can earn the same average return over time and still have very different outcomes. The difference is not just what the market returns. It is when those returns happen, especially once withdrawals begin.

That is why I do not like treating retirement as a single math problem. A plan has to account for bad timing, inflation, taxes, cash needs, and the tradeoff between avoiding one risk and creating another.

If you have not read that section yet, it is worth a closer look.

David Talley, CFP®
Talley Wealth · Johnson City, TN

Compliance note:
Educational content only. Not individualized investment, tax, or legal advice.

### Email 3

Subject: Two questions worth sitting with

Purpose:
Move from education to a light Explore Call CTA.

Draft:

Hi *|FNAME|*,

After someone reads the guide, there are two questions I would want them to sit with:

1. Do I know what retirement would need to look like for this to feel worthwhile?
2. Do I know whether my plan has been tested across taxes, investments, income, healthcare, and estate decisions together?

If the honest answer is no, that does not mean anything is wrong. It just means the question probably deserves more than a quick calculator result.

That is what the Explore Call is for. It is a short conversation to understand what prompted you to reach out and whether a deeper planning process would make sense.

David Talley, CFP®
Talley Wealth · Johnson City, TN

Compliance note:
Educational content only. Not individualized investment, tax, or legal advice.

## Next Lead Magnet

Build only one next asset after the current funnel is stable.

Recommended next asset:
The Pre-Retirement Tax Checklist

Why:
- Fits the strongest current audience.
- Connects naturally to retirement planning, tax planning, and Keystone.
- Creates a distinct funnel from the broader retirement guide.

Possible positioning:
Before you retire, know which tax decisions become harder to fix later.

