import JobCard, { type Job } from "@/components/JobCard";

async function fetchJobs(): Promise<Job[]> {
  const endpoint = process.env.JOBS_API_URL || "";
  try {
    if (!endpoint) {
      // Fallback demo data (3–5 jobs) if no API configured
      return [
        { id: 1, title: "Senior Product Manager", company: "Acme Corp", location: "Remote (US)", type: "Full-time", tags: ["Product", "Strategy", "SaaS"], url: "#", postedAt: new Date().toISOString() },
        { id: 2, title: "Frontend Engineer (React/Next.js)", company: "Bright Labs", location: "Austin, TX", type: "Full-time", tags: ["React", "Next.js", "Tailwind"], url: "#", postedAt: new Date().toISOString() },
        { id: 3, title: "Data Analyst", company: "FinEdge", location: "NYC (Hybrid)", type: "Contract", tags: ["SQL", "BigQuery", "Looker"], url: "#", postedAt: new Date().toISOString() },
      ];
    }
    const res = await fetch(`${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Normalize: accept either {jobs: [...]} or an array
    const jobs: any[] = Array.isArray(data) ? data : (data.jobs ?? []);
    return jobs.slice(0, 5).map((j, idx) => ({
      id: j.id ?? idx,
      title: j.title ?? j.job_title ?? "Untitled role",
      company: j.company ?? j.company_name ?? "Company",
      location: j.location ?? j.city_state ?? "",
      postedAt: j.posted_at ?? j.created_at ?? null,
      tags: j.tags ?? j.skills ?? [],
      url: j.url ?? j.apply_url ?? j.link ?? "#",
      salary: j.salary ?? j.compensation ?? undefined,
      type: j.type ?? j.employment_type ?? undefined,
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Page() {
  const jobs = await fetchJobs();

  return (
    <div>
      <section className="bg-primary-light border-b border-black/5">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="uppercase tracking-widest text-xs text-primary font-semibold">Jobs</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold text-ink">
            Unlock the hidden job market
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-ink-soft">
            A minimal, CollabWORK‑inspired list of curated roles. Drop in your API and deploy to Vercel.
          </p>
          <div className="mt-8 flex gap-3">
            <a className="btn" href="https://vercel.com/new" target="_blank">Deploy to Vercel</a>
            <a className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-black/10 text-ink hover:bg-surface-alt" href="https://www.collabwork.com/" target="_blank" rel="noreferrer">Learn about CollabWORK</a>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {jobs.length === 0 ? (
            <div className="card p-6 text-center">
              <h3>No jobs found</h3>
              <p className="mt-2 text-sm">Provide an API endpoint via <code>JOBS_API_URL</code> to load jobs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.slice(0, 5).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
