export type Job = {
  id: string | number;
  title: string;
  company: string;
  location?: string;
  postedAt?: string; // ISO date string
  tags?: string[];
  url?: string;
  salary?: string;
  type?: string; // e.g., Full-time
  logo?: string;  // employer logo URL
  description?: string; // plain text or markdown-ish
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <article className="card p-5 md:p-6">
      <div className="flex items-start gap-4">
        {/* Employer logo */}
        {job.logo ? (
          <img
            src={job.logo}
            alt={`${job.company} logo`}
            className="h-14 w-14 rounded-xl object-cover border border-black/10"
            loading="lazy"
          />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-primary-light border border-black/10 flex items-center justify-center text-primary text-sm font-semibold">
            {job.company?.[0]?.toUpperCase() ?? "N"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-ink">{job.title}</h3>
          <p className="mt-1 text-sm text-ink-soft truncate">
            {job.company}{job.location ? ` • ${job.location}` : ""}
          </p>

          {/* Description */}
          {job.description && (
            <p className="mt-3 text-sm leading-6 text-ink-soft whitespace-pre-line">
              {job.description}
            </p>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.slice(0, 5).map((t, i) => (
                <span key={i} className="badge">{t}</span>
              ))}
            </div>
          )}

          {/* Actions / meta */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {job.salary && <span className="text-sm font-medium text-ink">{job.salary}</span>}
            {job.url && (
              <a className="btn" href={job.url} target="_blank" rel="noreferrer">
                View & Apply
              </a>
            )}
            {job.postedAt && (
              <span className="ml-auto text-xs text-ink-soft">
                Posted {new Date(job.postedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
