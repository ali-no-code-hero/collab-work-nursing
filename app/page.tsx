'use client';

import { useState, useEffect } from 'react';
import JobCard, { type Job } from "../components/JobCard";

const MORE_JOBS_URL: string =
  process.env.MORE_JOBS_URL || "https://app.collabwork.com/board/5a72371f-659b-4f3b-9aeb-d13bf23f9e87";

// ============================================================================
// EDITABLE TEXT CONTENT - Update these constants to change static text
// Easily customize all user-facing text by modifying the values below
// ============================================================================
const TEXT = {
  subscriptionStatus: "✓ YOU'RE SUBSCRIBED!",
  headingWithJobs: (count: number) => `Thanks! Here are ${count} jobs you can apply to right now`,
  headingNoJobs: "Thanks! We're working on finding jobs for you",
  matchingNetworkText: "From our network, matched to your",
  noJobsTitle: "No jobs available for your specific search at the moment",
  noJobsDescription: "We couldn't find any personalized jobs that match your criteria right now.",
  redirectCountdownPrefix: "Redirecting to more jobs in",
  redirectCountdownSuffix: "seconds...",
  seeMoreJobsButton: "See More Nursing Jobs",
  loadingJobs: "Loading jobs...",
  retryingJobs: "Retrying...",
  retryMessage: (attempt: number, max: number) => `Attempting to fetch jobs again (${attempt}/${max}). Please wait...`,
  loadingMessage: "Please wait while we fetch the latest nursing opportunities.",
  loadingCuratedJobs: "Locating jobs that are the best fit for you based on your signup form...",
  loadingCuratedJobsDetail: "We're prioritizing roles based on your preferences and location.",
  redirectingToMoreJobs: "We were unable to locate jobs within your area based on your preferences. We are redirecting you to more nursing jobs where you can do a detailed search.",
} as const;

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
    salaryPeriod: "YEARLY",
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
    salaryPeriod: "YEARLY",
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
    salaryPeriod: "YEARLY",
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
      salaryPeriod: j.salary_period,
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
  const [noResults, setNoResults] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [viewerEmail, setViewerEmail] = useState<string | null>(null);
  const [waitingForCurated, setWaitingForCurated] = useState(false);
  const [redirectingToMore, setRedirectingToMore] = useState(false);
  const [matchingCriteria, setMatchingCriteria] = useState({
    experience: 'ICU experience',
    openness: 'openness to new roles'
  });
  
  // Log page view when component mounts
  useEffect(() => {
    const logPageView = async () => {
      try {
        // Check for email from form data or URL param
        const formDataStr = sessionStorage.getItem('formData');
        const formData = formDataStr ? JSON.parse(formDataStr) : null;
        const urlParams = new URLSearchParams(window.location.search);
        const email = formData?.email || urlParams.get('email');
        
        if (email) {
          await fetch('https://api.collabwork.com/api:ERDpOWih/log_page_view', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              api_key: process.env.NEXT_PUBLIC_XANO_API_KEY || '',
            }),
          });
        }
      } catch (error) {
        console.error('Failed to log page view:', error);
        // Don't block page load if logging fails
      }
    };
    
    logPageView();
  }, []); // Run once on mount
  
  useEffect(() => {
    const loadJobs = async (isRetry = false) => {
      if (isRetry) {
        console.log(`Retrying API call (attempt ${retryCount + 1})...`);
        setIsRetrying(true);
      } else {
        console.log('Loading personalized jobs...');
      }
      
      try {
        // Check for form data in sessionStorage first, then URL params
        const formDataStr = sessionStorage.getItem('formData');
        const formData = formDataStr ? JSON.parse(formDataStr) : null;
        const urlParams = new URLSearchParams(window.location.search);
        const email = formData?.email || urlParams.get('email');
        setViewerEmail(email); // Store email in state for passing to JobCard
        
        // If no email from form or URL, redirect to form
        if (!email) {
          console.log('No email found, redirecting to form');
          window.location.href = '/form';
          return;
        }

        // Check if we have curated jobs already in sessionStorage
        const curatedJobsStr = sessionStorage.getItem('curatedJobs');
        const storedCuratedJobs = curatedJobsStr ? JSON.parse(curatedJobsStr) : null;
        const subscriberLocationStr = sessionStorage.getItem('subscriberLocation');
        const storedLocation = subscriberLocationStr ? JSON.parse(subscriberLocationStr) : null;
        const storedJobPassion = sessionStorage.getItem('jobPassion');
        const storedJobInterest = sessionStorage.getItem('jobInterest');

        // If we have stored curated jobs, use them immediately
        if (storedCuratedJobs && Array.isArray(storedCuratedJobs) && storedCuratedJobs.length > 0) {
          const location = storedLocation 
            ? `${storedLocation.city}, ${storedLocation.state}`
            : (formData ? `${formData.city}, ${formData.state}` : 'Houston, TX');
          setSubscriberLocation(location);
          
          setMatchingCriteria({
            experience: storedJobPassion || 'Critical Care experience',
            openness: storedJobInterest || 'openness to new roles'
          });
          
          const mappedJobs = storedCuratedJobs.slice(0, 5).map((j: any, idx: number) => ({
            id: j.job_eid ?? j.id ?? idx,
            title: j.title ?? "Untitled role",
            company: j.company ?? "Company",
            location: j.location_string ?? j.location ?? location,
            postedAt: j.date_posted ? new Date(j.date_posted).toISOString() : undefined,
            tags: [j.industry] ?? [],
            url: j.url ?? "#",
            salary: j.salary_min && j.salary_max ? `$${j.salary_min.toLocaleString()}-$${j.salary_max.toLocaleString()}` : undefined,
            salaryMin: j.salary_min,
            salaryMax: j.salary_max,
            salaryPeriod: j.salary_period,
            type: j.is_remote ? "Remote" : "Full-time",
            isRemote: j.is_remote ?? false,
            industry: j.industry,
            logo: undefined,
            description: j.description ?? `Great opportunity in ${j.location_string ?? j.location ?? location}. Apply now to join our team!`,
          }));
          setJobs(mappedJobs);
          setLoading(false);
          setIsRetrying(false);
          setWaitingForCurated(false);
          setRedirectingToMore(false);
          setRetryCount(0);
          return;
        }
        
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
          } else {
            const curated = Array.isArray(data.curated_jobs) ? data.curated_jobs : [];
            const location = `${data.subscriber_city}, ${data.subscriber_state}`;
            setSubscriberLocation(location);
            
            // Check for curated_jobs first
            if (curated.length > 0) {
              // We have curated jobs - display them immediately
              console.log('Curated jobs found, displaying immediately');
              
              // Set matching criteria from API response (prefer API-provided fields)
              setMatchingCriteria({
                experience: (data.job_passion && typeof data.job_passion === 'string' && data.job_passion.trim().length > 0)
                  ? data.job_passion
                  : 'Critical Care experience',
                openness: (data.job_interest && typeof data.job_interest === 'string' && data.job_interest.trim().length > 0)
                  ? data.job_interest
                  : 'openness to new roles'
              });
              
              const mappedJobs = curated.slice(0, 5).map((j: any, idx: number) => ({
                id: j.job_eid ?? j.id ?? idx,
                title: j.title ?? "Untitled role",
                company: j.company ?? "Company",
                location: j.location_string ?? j.location ?? location,
                postedAt: j.date_posted ? new Date(j.date_posted).toISOString() : undefined,
                tags: [j.industry] ?? [],
                url: j.url ?? "#",
                salary: j.salary_min && j.salary_max ? `$${j.salary_min.toLocaleString()}-$${j.salary_max.toLocaleString()}` : undefined,
                salaryMin: j.salary_min,
                salaryMax: j.salary_max,
                salaryPeriod: j.salary_period,
                type: j.is_remote ? "Remote" : "Full-time",
                isRemote: j.is_remote ?? false,
                industry: j.industry,
                logo: undefined,
                description: j.description ?? `Great opportunity in ${j.location_string ?? j.location ?? location}. Apply now to join our team!`,
              }));
              setJobs(mappedJobs);
              setLoading(false);
              setIsRetrying(false);
              setWaitingForCurated(false);
              setRedirectingToMore(false);
              setRetryCount(0);
            } else {
              // No curated_jobs yet - poll 5-7 times within 15 seconds
              console.log('No curated_jobs found, starting polling...');
              setWaitingForCurated(true);
              setLoading(true);
              
              // Set up 15-second timeout for curated jobs
              const timeoutId = setTimeout(() => {
                console.log('15-second timeout reached, redirecting to more jobs');
                setRedirectingToMore(true);
                setWaitingForCurated(false);
                setLoading(true);
              }, 15000);
              
              // Poll for curated jobs 6 times within 15 seconds (every 2.5 seconds)
              let pollCount = 0;
              const maxPolls = 6; // Poll 6 times within 15 seconds
              const pollInterval = 2500; // 2.5 seconds between polls
              
              const pollForCurated = async () => {
                try {
                  pollCount++;
                  console.log(`Polling for curated jobs (attempt ${pollCount}/${maxPolls})...`);
                  const pollResponse = await fetch(`/api/jobs?email=${encodeURIComponent(email)}`);
                  if (pollResponse.ok) {
                    const pollData = await pollResponse.json();
                    const pollCurated = Array.isArray(pollData.curated_jobs) ? pollData.curated_jobs : [];
                    
                    if (pollCurated.length > 0) {
                      clearTimeout(timeoutId);
                      console.log('Curated jobs found, updating display');
                      
                      const pollLocation = `${pollData.subscriber_city}, ${pollData.subscriber_state}`;
                      setSubscriberLocation(pollLocation);
                      
                      // Set matching criteria from API response (prefer API-provided fields)
                      setMatchingCriteria({
                        experience: (pollData.job_passion && typeof pollData.job_passion === 'string' && pollData.job_passion.trim().length > 0)
                          ? pollData.job_passion
                          : 'Critical Care experience',
                        openness: (pollData.job_interest && typeof pollData.job_interest === 'string' && pollData.job_interest.trim().length > 0)
                          ? pollData.job_interest
                          : 'openness to new roles'
                      });
                      
                      const mappedJobs = pollCurated.slice(0, 5).map((j: any, idx: number) => ({
                        id: j.job_eid ?? j.id ?? idx,
                        title: j.title ?? "Untitled role",
                        company: j.company ?? "Company",
                        location: j.location_string ?? j.location ?? pollLocation,
                        postedAt: j.date_posted ? new Date(j.date_posted).toISOString() : undefined,
                        tags: [j.industry] ?? [],
                        url: j.url ?? "#",
                        salary: j.salary_min && j.salary_max ? `$${j.salary_min.toLocaleString()}-$${j.salary_max.toLocaleString()}` : undefined,
                        salaryMin: j.salary_min,
                        salaryMax: j.salary_max,
                        salaryPeriod: j.salary_period,
                        type: j.is_remote ? "Remote" : "Full-time",
                        isRemote: j.is_remote ?? false,
                        industry: j.industry,
                        logo: undefined,
                        description: j.description ?? `Great opportunity in ${j.location_string ?? j.location ?? pollLocation}. Apply now to join our team!`,
                      }));
                      setJobs(mappedJobs);
                      setLoading(false);
                      setIsRetrying(false);
                      setWaitingForCurated(false);
                      setRedirectingToMore(false);
                      setRetryCount(0);
                    } else if (pollCount < maxPolls) {
                      // Still no curated jobs, poll again in 2.5 seconds
                      setTimeout(pollForCurated, pollInterval);
                    } else {
                      // Max polls reached, timeout will handle redirect
                      console.log('Max polls reached, waiting for timeout');
                    }
                  }
                } catch (error) {
                  console.error('Error polling for curated jobs:', error);
                  if (pollCount < maxPolls) {
                    setTimeout(pollForCurated, pollInterval);
                  }
                }
              };
              
              // Start polling after 2.5 seconds
              setTimeout(pollForCurated, pollInterval);
            }
          }
        } else {
          // API error - show no results instead of fallback data
          console.log('API error, showing no results message');
          setJobs([]);
          setNoResults(true);
          setLoading(false);
          setIsRetrying(false);
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobs([]);
        setNoResults(true);
        setLoading(false);
        setIsRetrying(false);
      }
    };
    
    loadJobs();
  }, [retryCount, subscriberLocation]);

  // Show a 5-second countdown before redirect when curated timeout triggers
  useEffect(() => {
    if (redirectingToMore) {
      setRedirectCountdown(5);
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            window.location.href = MORE_JOBS_URL;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [redirectingToMore]);

  // Auto-redirect after 5 seconds when no results
  useEffect(() => {
    if (noResults) {
      setRedirectCountdown(5);
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            window.location.href = MORE_JOBS_URL;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setRedirectCountdown(null);
    }
  }, [noResults]);
  
  const jobCount = noResults ? 0 : Math.min(jobs.length, 5);

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark overflow-x-hidden transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Subscription Status */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-5 h-5 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-200">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-600 dark:text-green-400 font-medium text-sm transition-colors duration-200">{TEXT.subscriptionStatus}</p>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-ink-dark mb-6 leading-tight transition-colors duration-200">
            {noResults ? (
              TEXT.headingNoJobs
            ) : (
              TEXT.headingWithJobs(jobCount)
            )}
          </h1>

          {/* Matching Criteria - only show when there are results */}
          {!noResults && jobs.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 text-base text-gray-600 dark:text-ink-dark-soft transition-colors duration-200">
              <span className="mb-2 sm:mb-0">{TEXT.matchingNetworkText}</span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="px-3 sm:px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 whitespace-nowrap border border-blue-200 dark:border-blue-800 transition-colors duration-200">
                  📍 <span className="truncate max-w-[150px] sm:max-w-none">{subscriberLocation}</span> location
                </span>
                <span className="px-3 sm:px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 border border-purple-200 dark:border-purple-800 transition-colors duration-200">
                  🩺 <span className="truncate max-w-[200px] sm:max-w-none">{matchingCriteria.experience}</span>
                </span>
                <span className="px-3 sm:px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 border border-green-200 dark:border-green-800 transition-colors duration-200">
                  ✓ <span className="truncate max-w-[200px] sm:max-w-none">{matchingCriteria.openness}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Jobs */}
      <section className="py-12 bg-gray-50 dark:bg-surface-dark-alt transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {loading ? (
                    <div className="bg-white dark:bg-surface-dark-alt rounded-lg shadow-sm border border-gray-200 dark:border-border-dark p-8 text-center transition-colors duration-200">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-ink-dark mb-2 transition-colors duration-200">
                        {redirectingToMore
                          ? TEXT.redirectingToMoreJobs
                          : (waitingForCurated ? TEXT.loadingCuratedJobs : (isRetrying ? TEXT.retryingJobs : TEXT.loadingJobs))}
                      </h3>
                      <p className="text-gray-600 dark:text-ink-dark-soft transition-colors duration-200">
                        {redirectingToMore
                          ? TEXT.redirectCountdownPrefix + ' ' + (redirectCountdown ?? 5) + ' ' + TEXT.redirectCountdownSuffix
                          : (waitingForCurated 
                              ? TEXT.loadingCuratedJobsDetail
                              : (isRetrying 
                                ? TEXT.retryMessage(retryCount, 3)
                                : TEXT.loadingMessage
                              )
                            )
                        }
                      </p>
                      {(isRetrying || waitingForCurated || redirectingToMore) && (
                        <div className="mt-4">
                          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-200 dark:border-blue-800 transition-colors duration-200">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {redirectingToMore ? "Taking you to more nursing jobs..."
                              : (waitingForCurated ? "Finding your personalized matches..." : "Retrying in 5 seconds...")}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : noResults || jobs.length === 0 ? (
            <div className="bg-white dark:bg-surface-dark-alt rounded-xl shadow-sm border border-gray-200 dark:border-border-dark p-12 text-center transition-colors duration-200">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-ink-dark mb-4 transition-colors duration-200">{TEXT.noJobsTitle}</h3>
              <p className="text-gray-600 dark:text-ink-dark-soft mb-6 text-lg transition-colors duration-200">
                {TEXT.noJobsDescription}
              </p>
              {redirectCountdown !== null && (
                <div className="inline-flex items-center px-6 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-lg font-medium border border-purple-200 dark:border-purple-800 transition-colors duration-200">
                  <span>{TEXT.redirectCountdownPrefix} {redirectCountdown} {TEXT.redirectCountdownSuffix}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.slice(0, 5).map((job) => (
                <JobCard key={job.id} job={job} email={viewerEmail} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* See More Jobs Button - only show when there are results */}
      {!noResults && jobs.length > 0 && (
        <section className="py-12 bg-white dark:bg-surface-dark transition-colors duration-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <a
                href={MORE_JOBS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-primary dark:bg-primary-dark-mode !text-white font-semibold rounded-lg transition-all duration-200 text-lg shadow-sm hover:shadow-md hover:bg-primary-hover dark:hover:bg-primary-dark-hover"
              >
                {TEXT.seeMoreJobsButton}
                <svg className="ml-3 w-5 h-5 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
