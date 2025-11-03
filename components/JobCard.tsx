'use client';

import { useState, useEffect } from 'react';

export type Job = {
  id: string | number;
  title: string;
  company: string;
  location?: string;
  postedAt?: string; // ISO date string
  tags?: string[];
  url?: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: string; // e.g., YEARLY, HOURLY, NULL
  type?: string; // e.g., Full-time
  logo?: string;  // employer logo URL
  description?: string; // plain text or markdown-ish
  isRemote?: boolean;
  industry?: string;
};

export default function JobCard({ job, email }: { job: Job; email?: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [applicationCount, setApplicationCount] = useState<number | null>(null);
  
  // Generate random application count between 4-20 on client side only
  useEffect(() => {
    setApplicationCount(Math.floor(Math.random() * 17) + 4);
  }, []);

  // Handle apply button click - log to API
  const handleApplyClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!email) {
      console.warn('No email available for logging apply click');
      return; // Still allow navigation, just don't log
    }

    try {
      await fetch('https://api.collabwork.com/api:ERDpOWih/log_apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_title: job.title,
          job_url: job.url || '',
          email: email,
          job_eid: job.id.toString(),
        }),
      });
    } catch (error) {
      console.error('Failed to log apply click:', error);
      // Don't block navigation if logging fails
    }
  };
  
  // Format salary
  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      const period = job.salaryPeriod?.toLowerCase();
      let periodText = '/year';
      
      if (period === 'hourly') {
        periodText = '/hour';
      } else if (period === 'yearly') {
        periodText = '/year';
      } else if (period === 'monthly') {
        periodText = '/month';
      } else if (period === 'weekly') {
        periodText = '/week';
      } else if (period === 'daily') {
        periodText = '/day';
      } else if (period === 'null' || period === null || period === undefined) {
        // For NULL salary periods, don't show any period text
        return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
      }
      
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}${periodText}`;
    }
    return job.salary || 'Salary not specified';
  };

  // Format posted date
  const formatPostedDate = () => {
    if (job.postedAt) {
      return new Date(job.postedAt).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return 'Recently posted';
  };

  // Get company initial for logo
  const getCompanyInitial = () => {
    return job.company?.[0]?.toUpperCase() ?? "N";
  };

  // Check if description is long (more than 100 characters)
  const isDescriptionLong = job.description && job.description.length > 100;
  const shortDescription = isDescriptionLong ? (job.description?.substring(0, 100) + '...') : (job.description || '');

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.logo ? (
            <img
              src={job.logo}
              alt={`${job.company} logo`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-gray-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {getCompanyInitial()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Job Title and Company */}
          <div className="mb-2">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-700 font-medium">{job.company}</p>
            <p className="text-gray-600 text-sm">
              {job.location || 'Location not specified'}
              {job.isRemote && ' • Remote'}
            </p>
          </div>

          {/* Salary */}
          <div className="mb-3">
            <span className="text-green-600 font-semibold text-lg">
              {formatSalary()}
            </span>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {isExpanded ? (job.description || '') : shortDescription}
            </p>
            {isDescriptionLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 text-sm font-medium mt-1 hover:text-blue-800"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {job.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions and Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href={job.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="text-white px-6 py-2 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: '#6c6cbe' }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#b2b2e6'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#6c6cbe'}
                onClick={handleApplyClick}
              >
                Apply Now
              </a>
            </div>

            <div className="text-right text-xs text-gray-500">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-orange-500">🔥</span>
                <span>{applicationCount ? `${applicationCount} nurses applied this week` : 'Loading...'}</span>
              </div>
              <div>Posted {formatPostedDate()}</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
