'use client';

import { useState, useEffect } from 'react';
import JobCard, { type Job } from "../components/JobCard";

const MORE_JOBS_URL: string =
  process.env.MORE_JOBS_URL || "#";

// Helper function for fallback demo data
const getFallbackJobs = (location: string = "Houston, TX"): Job[] => [
  {
    id: 1,
    title: "Registered Nurse (RN) – Med/Surg",
    company: "CareFirst Health",
    location: location,
    type: "Full-time",
    tags: ["RN", "Med/Surg", "Acute Care"],
    url: "#",
    postedAt: new Date().toISOString(),
    description: `Provide bedside care on a 32-bed unit in ${location}. Collaborate with interdisciplinary teams. 3x12 schedule with weekend rotation. Strong mentorship program for new nurses.`,
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
    location: location,
    type: "Full-time",
    tags: ["ICU", "Critical Care", "BLS/ACLS"],
    url: "#",
    postedAt: new Date().toISOString(),
    description: `Manage high-acuity patients, ventilators, drips in ${location}. Night differential available. Strong mentorship program for new ICU nurses.`,
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
    location: `Remote/Field (${location} area)`,
    type: "Contract",
    tags: ["Home Health", "Case Mgmt", "RN"],
    url: "#",
    postedAt: new Date().toISOString(),
    description: `Coordinate patient care plans, conduct in-home visits in ${location}, document in EMR. Flexible scheduling with autonomy and work-life balance.`,
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
  const [subscriberLocation, setSubscriberLocation] = useState('Houston, TX');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [matchingCriteria, setMatchingCriteria] = useState({
    experience: 'ICU experience',
    openness: 'openness to new roles'
  });
  
  useEffect(() => {
    const loadJobs = async (isRetry = false) => {
      if (isRetry) {
        console.log(`Retrying API call (attempt ${retryCount + 1})...`);
        setIsRetrying(true);
      } else {
        console.log('Loading personalized jobs...');
      }
      
      try {
        // Get email from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email') || 'chosennurse@hotmail.com';
        
        const response = await fetch(`/api/jobs?email=${encodeURIComponent(email)}`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('API data received:', data);
          
          // Check if the API returned an error
          if (data.code && data.code.includes('ERROR')) {
            console.warn('API Error:', data.message);
            setJobs(getFallbackJobs(subscriberLocation));
            setMatchingCriteria({
              experience: 'Critical Care experience',
              openness: 'openness to new roles'
            });
            setLoading(false);
            setIsRetrying(false);
          } else if (data.response_jobs && Array.isArray(data.response_jobs) && data.response_jobs.length > 0) {
            // Map the personalized jobs response
            const location = `${data.subscriber_city}, ${data.subscriber_state}`;
            setSubscriberLocation(location);
            
            // Extract matching criteria from API response
            const industries = [...new Set(data.response_jobs.map((job: any) => job.industry))];
            const experienceTypes = industries.filter(industry => 
              industry && (
                industry.toLowerCase().includes('critical') ||
                industry.toLowerCase().includes('icu') ||
                industry.toLowerCase().includes('intensive') ||
                industry.toLowerCase().includes('emergency') ||
                industry.toLowerCase().includes('trauma')
              )
            );
            
            // Set dynamic matching criteria
            setMatchingCriteria({
              experience: experienceTypes.length > 0 
                ? `${experienceTypes[0]} experience` 
                : 'Critical Care experience',
              openness: 'openness to new roles'
            });
            
            const mappedJobs = data.response_jobs.slice(0, 5).map((j: any, idx: number) => ({
              id: j.job_eid ?? j.id ?? idx,
              title: j.title ?? "Untitled role",
              company: j.company ?? "Company",
              location: location, // Use subscriber location instead of job location
              postedAt: j.date_posted ? new Date(j.date_posted).toISOString() : undefined,
              tags: [j.industry] ?? [],
              url: j.url ?? "#",
              salary: j.salary_min && j.salary_max ? `$${j.salary_min.toLocaleString()}-$${j.salary_max.toLocaleString()}` : undefined,
              salaryMin: j.salary_min,
              salaryMax: j.salary_max,
              type: j.is_remote ? "Remote" : "Full-time",
              isRemote: j.is_remote ?? false,
              industry: j.industry,
              logo: undefined, // No logo in this API response
              description: `Great opportunity in ${location}. Apply now to join our team!`,
            }));
            setJobs(mappedJobs);
            setLoading(false);
            setIsRetrying(false);
            setRetryCount(0); // Reset retry count on success
          } else if (data.response_jobs && Array.isArray(data.response_jobs) && data.response_jobs.length === 0) {
            // Empty response_jobs array - retry after 5 seconds
            console.log('Empty response_jobs array, retrying in 5 seconds...');
            if (retryCount < 3) { // Max 3 retries
              setRetryCount(prev => prev + 1);
              setTimeout(() => {
                loadJobs(true);
              }, 5000);
            } else {
              console.log('Max retries reached, using fallback data');
              setJobs(getFallbackJobs(subscriberLocation));
              setMatchingCriteria({
                experience: 'Critical Care experience',
                openness: 'openness to new roles'
              });
              setLoading(false);
              setIsRetrying(false);
            }
          } else {
            // Fallback if no response_jobs
            setJobs(getFallbackJobs(subscriberLocation));
            setMatchingCriteria({
              experience: 'Critical Care experience',
              openness: 'openness to new roles'
            });
            setLoading(false);
            setIsRetrying(false);
          }
        } else {
          // Fallback demo data
          setJobs(getFallbackJobs(subscriberLocation));
          setMatchingCriteria({
            experience: 'Critical Care experience',
            openness: 'openness to new roles'
          });
          setLoading(false);
          setIsRetrying(false);
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobs([]);
        setMatchingCriteria({
          experience: 'Critical Care experience',
          openness: 'openness to new roles'
        });
        setLoading(false);
        setIsRetrying(false);
      }
    };
    
    loadJobs();
  }, [retryCount, subscriberLocation]);
  
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
                        📍 {subscriberLocation} location
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                        🩺 {matchingCriteria.experience}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                        ✓ {matchingCriteria.openness}
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {isRetrying ? 'Retrying...' : 'Loading jobs...'}
                      </h3>
                      <p className="text-gray-600">
                        {isRetrying 
                          ? `Attempting to fetch jobs again (${retryCount}/3). Please wait...`
                          : 'Please wait while we fetch the latest nursing opportunities.'
                        }
                      </p>
                      {isRetrying && (
                        <div className="mt-4">
                          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Retrying in 5 seconds...
                          </div>
                        </div>
                      )}
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
