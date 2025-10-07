# CollabWORK‑style Jobs (Next.js)

A tiny Next.js app styled with a CollabWORK‑inspired look that lists 3–5 jobs from your API.

## Quickstart (Vercel)
1. Fork or upload this repo to GitHub/GitLab/Bitbucket.
2. Import into **Vercel** and set the env var: `JOBS_API_URL` (must return either an array of jobs or `{ jobs: [...] }`).
3. Deploy.

### Expected job fields
The app tries to be flexible and will map common field names:
```json
{
  "id": 123,
  "title": "Frontend Engineer",
  "company": "Acme",
  "location": "Remote",
  "posted_at": "2025-10-07T00:00:00Z",
  "tags": ["React", "Next.js"],
  "url": "https://example.com/apply",
  "salary": "$140k-$165k",
  "type": "Full-time"
}
```
It also accepts alternative keys like `job_title`, `company_name`, `apply_url`, `created_at`, `skills`, `employment_type`, etc.

## Local dev
```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
```

Create a `.env.local` with:
```
JOBS_API_URL=https://your-api.example.com/jobs
```

## Customizing the look
Colors are defined in **tailwind.config.ts** under `extend.colors`:
- `primary.DEFAULT` – CTA blue
- `primary.dark` – hover blue
- `primary.light` – soft hero background
- `ink.*` – typography
- `surface.*` – backgrounds / cards

Update these to exactly match your brand, if desired.
