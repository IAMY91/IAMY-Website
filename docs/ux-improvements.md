# Visitor-first UX improvements

The homepage now introduces the audience and concrete benefits before the AIRFLOW framework. Order: hero, compact credibility strip, recognizable situations, three concrete engagements, four perspectives, project evidence, short About introduction, working process and contact. Repeated Future and Insights sections were removed from the homepage; articles remain accessible through navigation. Detailed methods moved to About; design principles are disclosed on request.

Each engagement states the starting situation, activity, takeaway and possible format. The model is introduced in plain language, and a concrete example explains regeneration as protecting saved time for focus, learning and recovery. Existing project claims are retained without invented testimonials or results.

Mobile: headline comes before the photograph, language targets are at least 44px high, and all 18 pages were checked at 340 CSS pixels without horizontal overflow. Language switching retains the current section. Methods remain accessible on About.

Contact: a fixed-recipient Vercel endpoint is implemented and tested with a mocked email provider. It is disabled until configured and explicitly activated. Visitors currently see a direct email link, rather than an unusable send form or a two-stage draft workflow. See contact-setup.md. No real email was sent.

Unresolved: the legal notice and privacy policy remain existing drafts pending the owner's public postal address/business details and actual email-provider setup. Do not describe these as completed.

Checks: bilingual-static.py, JavaScript syntax, contact-api.cjs, whitespace checks and shared-browser layout/navigation review. The standalone Playwright suite was updated for the new UX, but cannot be claimed passing in this environment.
