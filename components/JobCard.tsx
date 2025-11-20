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
      await fetch('/api/log-apply', {
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
      }).catch(() => {
        // Silently fail - don't block navigation
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
    <article className="bg-white dark:bg-surface-dark-alt rounded-lg shadow-sm border border-gray-200 dark:border-border-dark p-3 sm:p-4 md:p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.logo ? (
            <img
              src={job.logo}
              alt={`${job.company} logo`}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-100 dark:border-border-dark transition-colors duration-200"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-gray-100 dark:border-border-dark flex items-center justify-center transition-colors duration-200">
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-200">
                {getCompanyInitial()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Job Title and Company */}
          <div className="mb-1.5 sm:mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-ink-dark mb-0.5 sm:mb-1 transition-colors duration-200">{job.title}</h3>
            <p className="text-gray-700 dark:text-ink-dark-soft font-medium text-sm sm:text-base transition-colors duration-200">{job.company}</p>
            <p className="text-gray-600 dark:text-ink-dark-muted text-xs sm:text-sm transition-colors duration-200">
              {job.location || 'Location not specified'}
              {job.isRemote && ' • Remote'}
            </p>
          </div>

          {/* Salary */}
          <div className="mb-2 sm:mb-3">
            <span className="text-green-600 dark:text-green-400 font-semibold text-base sm:text-lg transition-colors duration-200">
              {formatSalary()}
            </span>
          </div>

          {/* Description - hidden on very small screens, show on sm+ */}
          <div className="mb-2 sm:mb-4 hidden sm:block">
            <p className="text-gray-700 dark:text-ink-dark-soft text-sm leading-relaxed transition-colors duration-200">
              {isExpanded ? (job.description || '') : shortDescription}
            </p>
            {isDescriptionLong && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary dark:text-primary-dark-mode text-sm font-medium mt-1 hover:text-primary-hover dark:hover:text-primary-dark-hover transition-colors duration-200"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Tags - hidden on very small screens */}
          {job.tags && job.tags.length > 0 && (
            <div className="mb-2 sm:mb-4 flex flex-wrap gap-2 hidden sm:flex">
              {job.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions and Meta */}
          <div className="flex flex-col gap-2 sm:gap-4 w-full">
            {/* Apply Now button - more prominent on mobile */}
            <div className="flex items-center justify-center sm:justify-start">
              <a
                href={job.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="!text-white w-full sm:w-auto px-6 py-3 sm:py-3.5 sm:px-4 sm:py-2 sm:px-6 rounded-lg font-semibold sm:font-medium text-base sm:text-sm transition-all duration-200 whitespace-nowrap bg-primary dark:bg-primary-dark-mode hover:bg-primary-hover dark:hover:bg-primary-dark-hover shadow-md hover:shadow-lg active:scale-95 text-center"
                onClick={handleApplyClick}
              >
                Apply Now
              </a>
            </div>

            {/* Meta info - below button on mobile, hidden on very small screens */}
            <div className="text-center sm:text-left sm:text-right text-xs text-gray-500 dark:text-ink-dark-muted transition-colors duration-200 hidden sm:block">
              <div className="flex items-center justify-center sm:justify-end gap-1 mb-1">
                <span className="text-orange-500 dark:text-orange-400">🔥</span>
                <span className="break-words">{applicationCount ? `${applicationCount} nurses applied this week` : 'Loading...'}</span>
              </div>
              <div>Posted {formatPostedDate()}</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
