# Email Draft To Joe

Subject: Contact form email setup for Talley Wealth site

Hi Joe,

I have the updated Talley Wealth site ready in GitHub.

The main thing I need your help confirming is the contact form email setup.

The contact form is set up so submissions can be emailed to:

`hello@talleywealth.com`

The site expects an email delivery service such as Resend. The live deployment environment needs these settings:

```text
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@talleywealth.com
CONTACT_FROM_EMAIL="Talley Wealth Website <website@talleywealth.com>"
CONTACT_BCC_EMAIL=
```

`RESEND_API_KEY` should be stored as a secret/environment variable, not committed to GitHub.

If the `talleywealth.com` sending domain is not already verified in Resend, Resend will provide DNS records that need to be added wherever our DNS is managed.

Can you confirm where these should be added for the live deployment and whether you want to use Resend for this?

Thanks,
David
