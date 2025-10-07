import { clsx } from "clsx";

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
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <article className="card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">{job.title}</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {job.company}{job.location ? ` • ${job.location}` : ""}
          </p>
        </div>
        {job.type && <span className="badge">{job.type}</span>}
      </div>
      {job.tags && job.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.slice(0, 5).map((t, i) => (
            <span key={i} className="badge">{t}</span>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center gap-3">
        {job.salary && <span className="text-sm font-medium text-ink">{job.salary}</span>}
        {job.url && (
          <a className="btn" href={job.url} target="_blank" rel="noreferrer">
            View Job
          </a>
        )}
      </div>
      {job.postedAt && (
        <p className="mt-4 text-xs text-ink-soft">
          Posted {new Date(job.postedAt).toLocaleDateString()}
        </p>
      )}
    </article>
  );
}
