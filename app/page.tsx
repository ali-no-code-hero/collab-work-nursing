'use client';

import { useState, useEffect } from 'react';
import JobCard, { type Job } from "../components/JobCard";

const MORE_JOBS_URL: string =
  process.env.MORE_JOBS_URL || "#";

// Helper function for fallback demo data
const getFallbackJobs = (): Job[] => [
  {
    id: 1,
    title: "Registered Nurse (RN) – Med/Surg",
    company: "CareFirst Health",
    location: "Houston, TX",
    type: "Full-time",
    tags: ["RN", "Med/Surg", "Acute Care"],
    url: "#",
    postedAt: new Date().toISOString(),
    description: "Provide bedside care on a 32-bed unit. Collaborate with interdisciplinary teams. 3x12 schedule with weekend rotation. Strong mentorship program for new nurses.",
    salaryMin: 72000,
    salaryMax: 92000,
    isRemote: false,
    industry: "Health Care Providers & Services",
    logo: undefined
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
    description: "Manage high-acuity patients, ventilators, drips. Night differential available. Strong mentorship program for new ICU nurses.",
    salaryMin: 78000,
    salaryMax: 98000,
    isRemote: false,
    industry: "Health Care Providers & Services",
    logo: undefined
  },
  {
    id: 3,
    title: "Home Health RN Case Manager",
    company: "Community Nurses of Texas",
    location: "Remote/Field (Houston area)",
    type: "Contract",
    tags: ["Home Health", "Case Mgmt", "RN"],
    url: "#",
    postedAt: new Date().toISOString(),
    description: "Coordinate patient care plans, conduct in-home visits, document in EMR. Flexible scheduling with autonomy and work-life balance.",
    salaryMin: 68000,
    salaryMax: 85000,
    isRemote: true,
    industry: "Health Care Providers & Services",
    logo: undefined
  },
];

async function fetchJobs(): Promise<Job[]> {
  try {
    // Skip API call during build time to avoid static generation errors
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
      return [];
    }
    
    // Use our internal API route instead of calling CollabWORK directly
    // For server-side rendering, we need to construct the full URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '');
    const apiUrl = `${baseUrl}/api/jobs`;
      
    const res = await fetch(apiUrl, { 
      next: { revalidate: 60 } 
    });
    
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      // Fallback demo (nursing flavor) if API fails
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
          description: "Provide bedside care on a 32-bed unit. Collaborate with interdisciplinary teams. 3x12 schedule with weekend rotation. Strong mentorship program for new nurses.",
          salaryMin: 72000,
          salaryMax: 92000,
          isRemote: false,
          industry: "Health Care Providers & Services",
          logo: undefined
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
          description: "Manage high-acuity patients, ventilators, drips. Night differential available. Strong mentorship program for new ICU nurses.",
          salaryMin: 78000,
          salaryMax: 98000,
          isRemote: false,
          industry: "Health Care Providers & Services",
          logo: undefined
        },
        {
          id: 3,
          title: "Home Health RN Case Manager",
          company: "Community Nurses of Texas",
          location: "Remote/Field (Houston area)",
          type: "Contract",
          tags: ["Home Health", "Case Mgmt", "RN"],
          url: "#",
          postedAt: new Date().toISOString(),
          description: "Coordinate patient care plans, conduct in-home visits, document in EMR. Flexible scheduling with autonomy and work-life balance.",
          salaryMin: 68000,
          salaryMax: 85000,
          isRemote: true,
          industry: "Health Care Providers & Services",
          logo: undefined
        },
      ];
    }
    
    const data = await res.json();
    const jobs: any[] = Array.isArray(data) ? data : (data.jobs ?? []);
    return jobs.slice(0, 5).map((j, idx) => ({
      id: j.job_eid ?? j.id ?? idx,
      title: j.title ?? j.job_title ?? "Untitled role",
      company: j.company ?? j.company_name ?? "Company",
      location: j.location ?? j.city_state ?? "",
      postedAt: j.date_posted ? new Date(j.date_posted).toISOString() : (j.posted_at ?? j.created_at ?? undefined),
      tags: j.tags ?? j.skills ?? [],
      url: j.url ?? j.apply_url ?? j.link ?? "#",
      salary: j.salary_min && j.salary_max ? `$${j.salary_min.toLocaleString()}-$${j.salary_max.toLocaleString()}` : (j.salary ?? j.compensation ?? undefined),
      salaryMin: j.salary_min,
      salaryMax: j.salary_max,
      type: j.is_remote ? "Remote" : (j.type ?? j.employment_type ?? undefined),
      isRemote: j.is_remote ?? false,
      industry: j.industry,
      // NEW: map logo / description from common field names
      logo: j.logo ?? j.company_logo ?? j.logo_url ?? j.employer_logo ?? undefined,
      description: j.description ?? j.job_description ?? j.summary ?? j.desc ?? undefined,
    }));
  } catch (e) {
    console.error('Error fetching jobs:', e);
    return [];
  }
}

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/jobs`);
        if (response.ok) {
          const data = await response.json();
          // Check if the API returned an error (like expired token)
          if (data.code && data.code.includes('ERROR')) {
            console.warn('API Error:', data.message);
            // Use fallback data
            setJobs(getFallbackJobs());
          } else {
            const jobList = Array.isArray(data) ? data : (data.jobs ?? []);
            setJobs(jobList.slice(0, 5));
          }
        } else {
          // Fallback demo data
          setJobs(getFallbackJobs());
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadJobs();
  }, []);
  
  const jobCount = Math.min(jobs.length, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          {/* Subscription Status */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-blue-600 font-medium text-sm">✓ YOU'RE SUBSCRIBED!</p>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thanks! Here are {jobCount} jobs you can apply to right now
          </h1>

          {/* Matching Criteria */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>From our network, matched to your</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium flex items-center gap-1">
                📍 Houston location
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                🩺 ICU experience
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                ✓ openness to new roles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-6">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading jobs...</h3>
              <p className="text-gray-600">Please wait while we fetch the latest nursing opportunities.</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">We couldn't find any matching jobs at the moment. Please try again later.</p>
            </div>
          ) : (
            <div className="space-y-6">
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
