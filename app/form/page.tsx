'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  city: string;
  state: string;
  email: string;
  licenses: string[];
  specialties: string[];
  jobTypes: string[];
  currentWorkplace: string;
  openToOpportunities: string; // "Yes" or "No"
  processingId?: string; // ID from first webhook
}

const LICENSE_OPTIONS = [
  'Registered Nurse (RN)',
  'Licensed Practical Nurse / Licensed Vocational Nurse (LPN/LVN)',
  'Nurse Practitioner (NP/FNP)',
  'Certified Registered Nurse Anesthetist (CRNA)',
  'Critical Care Registered Nurse (CCRN)',
  'Basic Life Support (BLS)',
  'Advanced Cardiovascular Life Support (ACLS)'
];

const SPECIALTY_OPTIONS = [
  'Critical Care / ICU',
  'Emergency Department',
  'Pediatrics',
  'Oncology',
  'Med-Surg',
  'Psychiatric/Mental Health'
];

const JOB_TYPE_OPTIONS = [
  'Full-time (Staff Nurse)',
  'Part-time / Per Diem',
  'Travel Nursing',
  'Remote / Telehealth',
  'Open to Anything'
];

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
];

export default function FormPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    city: '',
    state: '',
    email: '',
    licenses: [],
    specialties: [],
    jobTypes: [],
    currentWorkplace: '',
    openToOpportunities: '',
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const processingIdRef = useRef<string | undefined>(undefined);

  // Helper function to convert state name to abbreviation
  const getStateCode = (stateName: string): string => {
    if (!stateName) return '';
    const upperState = stateName.toUpperCase();
    // Check if it's already an abbreviation (2 letters)
    if (upperState.length === 2 && US_STATES.some(s => s.code === upperState)) {
      return upperState;
    }
    // Try to find by name
    const state = US_STATES.find(s => s.name.toUpperCase() === upperState);
    return state ? state.code : upperState.substring(0, 2); // Fallback to first 2 letters
  };

  // Initialize processing ID from sessionStorage if available
  useEffect(() => {
    const storedId = sessionStorage.getItem('processingId');
    if (storedId && !formData.processingId) {
      processingIdRef.current = storedId;
      setFormData(prev => ({
        ...prev,
        processingId: storedId,
      }));
    }
  }, []);

  // Try to get location from geolocation API
  useEffect(() => {
    if (currentStep === 2 && !formData.city && !formData.state) {
      getLocationFromBrowser();
    }
  }, [currentStep]);

  const getLocationFromBrowser = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        });
      });

      // Reverse geocode to get city and state
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      );

      if (response.ok) {
        const data = await response.json();
        const stateName = data.principalSubdivision || data.region || '';
        const stateCode = getStateCode(stateName);
        setFormData(prev => ({
          ...prev,
          city: data.city || data.locality || '',
          state: stateCode,
        }));
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // Only show error if user hasn't manually entered location yet
      if (!formData.city && !formData.state) {
        setLocationError('Could not automatically detect your location. Please enter it manually.');
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSubmit = () => {
    if (!formData.city.trim() || !formData.state.trim()) {
      setErrors({ location: 'Please enter both city and state' });
      return;
    }

    setErrors({});
    
    // Proceed to next step immediately - don't wait for API response
    setCurrentStep(3);
    
    // Send location to first webhook in the background
    fetch('https://api.collabwork.com/api:partners/webhook_just_state_nurse_ascent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: formData.city,
        state: formData.state,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          let responseText = '';
          try {
            // Response is an array with a JSON string inside: ["{   \"status\": \"success\",   \"message\": \"Webhook received\", \"id\": \"1165\" }"]
            // Read as text first, then parse
            responseText = await response.text();
            console.log('Location webhook raw response text:', responseText);
            
            let processingId = null;
            
            try {
              const responseArray = JSON.parse(responseText);
              console.log('Location webhook parsed response:', responseArray);
              
              if (Array.isArray(responseArray) && responseArray.length > 0) {
                // Parse the JSON string from the array
                const jsonString = responseArray[0];
                console.log('Extracting JSON string from array:', jsonString);
                
                // Handle both string and already-parsed object
                let data;
                if (typeof jsonString === 'string') {
                  // Remove any extra whitespace and parse
                  const cleaned = jsonString.trim();
                  data = JSON.parse(cleaned);
                } else {
                  data = jsonString;
                }
                
                processingId = data.id || data.processing_id || data.processingId;
                console.log('Extracted processing ID from parsed data:', processingId);
              } else if (typeof responseArray === 'object' && responseArray !== null && !Array.isArray(responseArray)) {
                // Fallback: try parsing as direct JSON object
                processingId = responseArray.id || responseArray.processing_id || responseArray.processingId;
                console.log('Extracted processing ID from object:', processingId);
              }
            } catch (parseError) {
              console.error('Error parsing location webhook response:', parseError);
              // Try to extract ID directly from text using regex as last resort
              const idMatch = responseText.match(/"id"\s*:\s*"(\d+)"/i) || responseText.match(/id["\s:=]+(\d+)/i);
              if (idMatch) {
                processingId = idMatch[1];
                console.log('Extracted processing ID using regex fallback:', processingId);
              }
            }
            
            if (processingId) {
              const idString = String(processingId);
              console.log('✅ Successfully received processing ID:', idString);
              processingIdRef.current = idString;
              // Store in sessionStorage for reliability
              sessionStorage.setItem('processingId', idString);
              setFormData(prev => ({
                ...prev,
                processingId: idString,
              }));
            } else {
              console.error('❌ No processing ID found in location webhook response. Full response:', responseText);
            }
          } catch (e) {
            console.error('Error parsing location webhook response:', e, responseText || 'No response text available');
          }
        } else {
          const errorText = await response.text().catch(() => '');
          console.error('Location webhook error:', response.status, errorText);
        }
      })
      .catch((error) => {
        console.error('Error sending location:', error);
        // Don't show error to user since they've already moved on
      });
  };

  const handleMultiSelect = (field: 'licenses' | 'specialties' | 'jobTypes', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleNext = () => {
    setErrors({});
    
    if (currentStep === 1) {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrors({ email: 'Please enter a valid email address' });
        return;
      }
    } else if (currentStep === 3) {
      if (formData.licenses.length === 0) {
        setErrors({ licenses: 'Please select at least one license or certification' });
        return;
      }
    } else if (currentStep === 4) {
      if (formData.specialties.length === 0) {
        setErrors({ specialties: 'Please select at least one specialty' });
        return;
      }
    } else if (currentStep === 5) {
      if (formData.jobTypes.length === 0) {
        setErrors({ jobTypes: 'Please select at least one job type' });
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setErrors({});
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    // Validate open to opportunities
    if (!formData.openToOpportunities) {
      setErrors({ openToOpportunities: 'Please select an option' });
      setIsSubmitting(false);
      return;
    }

    try {
      // Wait for processing ID if not available yet (max 5 seconds)
      // The ID is fetched in background after location step, so it might not be ready yet
      // Check multiple sources: state, ref, and sessionStorage
      let processingId: string | null = formData.processingId || processingIdRef.current || sessionStorage.getItem('processingId') || null;
      
      console.log('Initial processingId check:', { 
        fromState: formData.processingId, 
        fromRef: processingIdRef.current, 
        fromStorage: sessionStorage.getItem('processingId'),
        final: processingId 
      });
      
      if (!processingId) {
        // Wait up to 5 seconds for the ID to arrive from background fetch
        console.log('Waiting for processing ID...');
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
          // Check all sources again - convert undefined to null
          const fromRef = processingIdRef.current || null;
          const fromStorage = sessionStorage.getItem('processingId');
          const fromState = formData.processingId || null;
          processingId = fromRef || fromStorage || fromState;
          if (processingId) {
            console.log('Processing ID found after wait:', processingId);
            break;
          }
        }
      }

      // Format data for webhook - ALWAYS include id field
      const payload: Record<string, any> = {
        city: formData.city,
        state: formData.state,
        email: formData.email,
        licenses: formData.licenses,
        specialties: formData.specialties,
        job_types: formData.jobTypes,
        current_workplace: formData.currentWorkplace,
        open_to_opportunities: formData.openToOpportunities,
      };
      
      // Always include id field - use the processing ID if available
      if (processingId) {
        payload.id = String(processingId);
      } else {
        // Still include the field even if null/undefined to ensure it's sent
        payload.id = null;
        console.warn('No processing ID available when submitting form - sending id as null');
      }
      
      console.log('Submitting payload to curated jobs webhook:', JSON.stringify(payload, null, 2));

      const response = await fetch('https://api.collabwork.com/api:partners/webhook_curated_jobs_nurse_ascent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store form data and curated jobs in sessionStorage for jobs page
        sessionStorage.setItem('formData', JSON.stringify(formData));
        if (data.curated_jobs) {
          sessionStorage.setItem('curatedJobs', JSON.stringify(data.curated_jobs));
        }
        if (data.subscriber_city && data.subscriber_state) {
          sessionStorage.setItem('subscriberLocation', JSON.stringify({
            city: data.subscriber_city,
            state: data.subscriber_state,
          }));
        }
        if (data.job_passion) {
          sessionStorage.setItem('jobPassion', data.job_passion);
        }
        if (data.job_interest) {
          sessionStorage.setItem('jobInterest', data.job_interest);
        }

        // Redirect to jobs page
        router.push('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrors({ submit: errorData.message || 'Failed to submit form. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Subscribe to Nurse Ascent *
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Complete this form to get the 5-minute newsletter nurses trust to grow their careers 🎁 + enter our monthly raffle for a $200 Amazon gift card.
          </p>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(currentStep / 7) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Step {currentStep} of 7
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-6 sm:py-8 lg:py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
            {/* Step 1: Email */}
            {currentStep === 1 && (
              <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">What's your email address?</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Your email allows us to send you personalized job recommendations, career tips, and exclusive opportunities. We'll also use it to notify you if you win our monthly $200 Amazon gift card raffle!
              </p>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: '#6c6cbe' }}
                >
                  Continue
                </button>
              </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Where are you located?</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                We use your location to match you with nursing opportunities in your area. This helps us show you relevant jobs that are actually accessible to you, saving you time and ensuring you see positions you can realistically pursue.
              </p>

              {isLoadingLocation && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700">Detecting your location...</p>
                </div>
              )}

              {locationError && (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-700 text-sm">{locationError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, city: e.target.value }));
                      if (e.target.value && formData.state) {
                        setLocationError(null);
                      }
                    }}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, state: e.target.value }));
                      if (formData.city && e.target.value) {
                        setLocationError(null);
                      }
                    }}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select your state</option>
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.code} - {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.location && (
                  <p className="text-red-600 text-sm">{errors.location}</p>
                )}

                <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <button
                    onClick={handleBack}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleLocationSubmit}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
              </div>
            )}

            {/* Step 3: Licenses */}
            {currentStep === 3 && (
              <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Which of the following nursing licenses or certifications do you currently hold?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Your licenses and certifications help us match you with jobs that align with your qualifications. This ensures you only see opportunities you're actually eligible for, making your job search more efficient and targeted.
              </p>
              <p className="text-sm text-gray-500 mb-6">Select all that apply</p>

              <div className="space-y-2 sm:space-y-3">
                {LICENSE_OPTIONS.map((license) => (
                  <label
                    key={license}
                    className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.licenses.includes(license)}
                      onChange={() => handleMultiSelect('licenses', license)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700">{license}</span>
                  </label>
                ))}
              </div>

              {errors.licenses && (
                <p className="text-red-600 text-sm mt-4">{errors.licenses}</p>
              )}

              <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={handleBack}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: '#6c6cbe' }}
                >
                  Continue
                </button>
              </div>
              </div>
            )}

            {/* Step 4: Specialties */}
            {currentStep === 4 && (
              <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Which nursing specialties are you most passionate about?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Understanding your passion areas helps us prioritize job opportunities that match what you love doing. Whether you're passionate about critical care, pediatrics, or mental health, we'll make sure those opportunities appear first in your recommendations.
              </p>
              <p className="text-sm text-gray-500 mb-6">Select all that apply</p>

              <div className="space-y-2 sm:space-y-3">
                {SPECIALTY_OPTIONS.map((specialty) => (
                  <label
                    key={specialty}
                    className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => handleMultiSelect('specialties', specialty)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>

              {errors.specialties && (
                <p className="text-red-600 text-sm mt-4">{errors.specialties}</p>
              )}

              <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={handleBack}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: '#6c6cbe' }}
                >
                  Continue
                </button>
              </div>
              </div>
            )}

            {/* Step 5: Job Types */}
            {currentStep === 5 && (
              <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                What type of nursing jobs interest you?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Whether you're looking for full-time stability, part-time flexibility, travel opportunities, or remote work, we'll tailor your job matches to your preferred work style. This helps you find opportunities that fit your lifestyle and career goals.
              </p>
              <p className="text-sm text-gray-500 mb-6">Select all that apply</p>

              <div className="space-y-2 sm:space-y-3">
                {JOB_TYPE_OPTIONS.map((jobType) => (
                  <label
                    key={jobType}
                    className="flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.jobTypes.includes(jobType)}
                      onChange={() => handleMultiSelect('jobTypes', jobType)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                    <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700">{jobType}</span>
                  </label>
                ))}
              </div>

              {errors.jobTypes && (
                <p className="text-red-600 text-sm mt-4">{errors.jobTypes}</p>
              )}

              <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={handleBack}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: '#6c6cbe' }}
                >
                  Continue
                </button>
              </div>
            </div>
            )}

            {/* Step 6: Current Workplace */}
            {currentStep === 6 && (
              <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Where do you currently work?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Knowing your current workplace helps us understand your experience level and avoid showing you duplicate opportunities. This information also helps us provide more relevant career insights and job recommendations tailored to your background.
              </p>
              <p className="text-sm text-gray-500 mb-6">Optional - Enter the name of your current hospital or facility</p>

              <div>
                <label htmlFor="workplace" className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital/Facility Name
                </label>
                <input
                  type="text"
                  id="workplace"
                  value={formData.currentWorkplace}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentWorkplace: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter facility name"
                />
                {errors.workplace && (
                  <p className="text-red-600 text-sm mt-2">{errors.workplace}</p>
                )}
              </div>

              <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={handleBack}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ backgroundColor: '#6c6cbe' }}
                >
                  Continue
                </button>
              </div>
              </div>
            )}

            {/* Step 7: Open to Opportunities */}
            {currentStep === 7 && (
              <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Are you currently open to new nursing job opportunities?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                This helps us understand your current job search status so we can tailor our communications and job recommendations accordingly.
              </p>

              <div className="space-y-2 sm:space-y-3">
                <label
                  className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.openToOpportunities === 'Yes'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="openToOpportunities"
                    value="Yes"
                    checked={formData.openToOpportunities === 'Yes'}
                    onChange={(e) => setFormData(prev => ({ ...prev, openToOpportunities: e.target.value }))}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 font-medium">Yes</span>
                </label>

                <label
                  className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.openToOpportunities === 'No'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="openToOpportunities"
                    value="No"
                    checked={formData.openToOpportunities === 'No'}
                    onChange={(e) => setFormData(prev => ({ ...prev, openToOpportunities: e.target.value }))}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 font-medium">No, I'm not looking for work right now</span>
                </label>
              </div>

              {errors.openToOpportunities && (
                <p className="text-red-600 text-sm mt-4">{errors.openToOpportunities}</p>
              )}

              {errors.submit && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={handleBack}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#6c6cbe' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

