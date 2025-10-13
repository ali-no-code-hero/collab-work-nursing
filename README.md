Here’s a clean rewrite of your README that **keeps your original instructions intact** and simply adds a new section at the bottom for the Youform webhook integration.

---

# CollabWORK-style Jobs (Next.js)

A tiny Next.js app styled with a CollabWORK-inspired look that lists 3–5 jobs from your API.

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

* `primary.DEFAULT` – CTA blue
* `primary.dark` – hover blue
* `primary.light` – soft hero background
* `ink.*` – typography
* `surface.*` – backgrounds / cards

Update these to exactly match your brand, if desired.

---

## Webhook Integration (Youform → CollabWORK Jobs)

This repo also supports receiving webhooks from **Youform** and using them to query the CollabWORK jobs API.

### Setup

1. **Create an API route**
   Add the file:

   ```
   /api/youform.js
   ```

   This file acts as a serverless function on Vercel and will handle incoming POST requests from Youform.

2. **Add Vercel config**
   At the root of your repo, add:

   ```
   /vercel.json
   ```

   This ensures Vercel routes `/api/youform` to the serverless function.

3. **Set environment variables in Vercel**

   * `COLLABWORK_API_KEY` – your key for accessing the CollabWORK Partner API
   * `COLLABWORK_ENDPOINT` (optional) – defaults to `https://api.collabwork.com/api:partners/JobSearchKW`

4. **Deploy to Vercel**
   Once committed and pushed, Vercel redeploys automatically.

5. **Connect Youform**

   * In Youform, go to your form → **Integrate → Webhook → Connect**
   * Enter your deployed URL:

     ```
     https://<your-vercel-domain>/api/youform
     ```

### How it works

* Youform sends form submissions as JSON via POST.
* The handler builds a plain-text search query (e.g., `"Nursing Houston TX Full-time"`) from the submission.
* The function forwards the query to the CollabWORK Jobs API.
* The API response can then be logged, processed, or displayed in your app.

---

Would you like me to also give you the **ready-to-paste `youform.js` code** inline here (final version with CollabWORK integration), so you don’t need to dig back through earlier steps?
