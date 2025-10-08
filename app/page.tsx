import JobCard, { type Job } from "../components/JobCard";

async function fetchJobs(): Promise<Job[]> {
  const endpoint = process.env.JOBS_API_URL || "";
  try {
    if (!endpoint) {
      // Fallback demo (nursing flavor)
      return [
        {
          id: 1,
          title: "Registered Nurse (RN) – Med/Surg",
          company: "CareFirst Health",
          location: "Houston, TX",
          type: "Full-time",
          tags: ["RN", "Med/Surg", "Acute Care"],
          url: "#",
          postedAt: new Date().toISOString(),
          description: "Provide bedside care on a 32-bed unit. Collaborate with interdisciplinary teams. 3x12 schedule.",
          logo: "https://dummyimage.com/112x112/EAF2FF/2E6AFF&text=C"
        },
        {
          id: 2,
          title: "ICU Nurse (Night Shift)",
          company: "Bayou Medical Center",
          location: "Houston, TX",
          type: "Full-time",
          tags: ["ICU", "Critical Care", "BLS/ACLS"],
          url: "#",
          postedAt: new Date().toISOString(),
          description: "Manage high-acuity patients, ventilators, drips. Night differential available.",
          logo: "https://dummyimage.com/112x112/EAF2FF/2E6AFF&text=B"
        },
        {
          id: 3,
          title: "Home Health RN Case Manager",
          company: "Community Nurses of Texas",
          location: "Remote/Field (Houston)",
          type: "Contract",
          tags: ["Home Health", "Case Mgmt", "RN"],
          url: "#",
          postedAt: new Date().toISOString(),
          description: "Coordinate patient care plans, conduct in-home visits, document in EMR.",
          logo: "https://dummyimage.com/112x112/EAF2FF/2E6AFF&text=H"
        },
      ];
    }
    const res = await fetch(`${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const jobs: any[] = Array.isArray(data) ? data : (data.jobs ?? []);
    return jobs.slice(0, 5).map((j, idx) => ({
      id: j.id ?? idx,
      title: j.title ?? j.job_title ?? "Untitled role",
      company: j.company ?? j.company_name ?? "Company",
      location: j.location ?? j.city_state ?? "",
      postedAt: j.posted_at ?? j.created_at ?? undefined,
      tags: j.tags ?? j.skills ?? [],
      url: j.url ?? j.apply_url ?? j.link ?? "#",
      salary: j.salary ?? j.compensation ?? undefined,
      type: j.type ?? j.employment_type ?? undefined,
      // NEW: map logo / description from common field names
      logo: j.logo ?? j.company_logo ?? j.logo_url ?? j.employer_logo ?? undefined,
      description: j.description ?? j.job_description ?? j.summary ?? j.desc ?? undefined,
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
      {/* Hero */}
      <section className="bg-primary-light border-b border-black/5">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="uppercase tracking-widest text-xs text-primary font-semibold">Nursing Jobs</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold text-ink">
            Find your next nursing role
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-ink-soft">
            Curated RN, ICU, and Home Health roles based on your search.
          </p>
        </div>
      </section>

      {/* Jobs */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {jobs.length === 0 ? (
            <div className="card p-6 text-center">
              <h3>No jobs found</h3>
              <p className="mt-2 text-sm">Provide an API endpoint via <code>JOBS_API_URL</code> to load jobs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {jobs.slice(0, 5).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* See more CTA */}
        <section>
          <div className="mx-auto max-w-6xl px-6 pb-16">
            <div className="card p-6 flex items-center justify-center">
              <a
                className="btn"
                href={MORE_JOBS_URL}
                target="_blank"
                rel="noreferrer"
              >
                See More Nursing Jobs
              </a>
            </div>
          </div>
        </section>
    </div>
  );
}
