# Contact delivery activation

The public site defaults to a one-click email link. The direct-send form is revealed only when GET /api/contact confirms readiness. No API key is embedded in the client. Failure never reports success and retains the visitor's entries.

To enable direct delivery in the existing Vercel project:
1. Configure RESEND_API_KEY and CONTACT_FROM_EMAIL using a sender authorized by your Resend account. Enter credentials in Vercel settings, never in source or chat.
2. Complete the public legal notice and update the privacy notice to cover the selected email provider and processing. The existing legal drafts still require the owner's public address and applicable business details.
3. Configure an appropriate rate limit for /api/contact in Vercel Firewall before opening the endpoint to public submissions.
4. Set CONTACT_DELIVERY_ENABLED=true and redeploy. Verify delivery with a message you explicitly authorize sending. Tests in this repository mock the provider and send no messages.

The endpoint accepts same-origin JSON only, validates input size and fields, includes a honeypot, uses a fixed recipient and server-side sender, and supplies an idempotency key to avoid duplicate sends on retries. A timeout or provider failure leaves the message unconfirmed.

Reference: https://resend.com/docs/api-reference/emails/send-email
