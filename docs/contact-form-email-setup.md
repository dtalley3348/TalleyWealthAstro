# Contact Form Email Setup

The website contact form posts to `/api/talley/contact`.

In local development, if no email service is configured, the endpoint returns a safe local success response so pages can be tested without sending real email.

For the live website, configure these environment variables wherever the site is deployed:

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@talleywealth.com
CONTACT_FROM_EMAIL="Talley Wealth Website <website@talleywealth.com>"
CONTACT_BCC_EMAIL=
```

## Recommended Setup

1. Create or use a Resend account.
2. Verify the sending domain `talleywealth.com` in Resend.
3. Create an API key in Resend.
4. Add the environment variables above to the live website host.
5. Deploy the GitHub repo.
6. Test the contact form with a real submission.

`CONTACT_TO_EMAIL` is where the message notification goes.

`CONTACT_FROM_EMAIL` must use a sender/domain that Resend has verified.

`CONTACT_BCC_EMAIL` is optional. It can be used for an archive, CRM, or compliance mailbox.

Do not commit `RESEND_API_KEY` into GitHub. Store it only as a secret/environment variable in the deployment system.

## Important

GitHub stores the website code. It usually does not run the live server by itself unless the repo has GitHub Actions or another deployment setup.

This Astro site uses server output and API routes, so the live host needs to support a Node/server runtime. A static-only GitHub Pages deployment will not run `/api/talley/contact`.
