# CollabWORK Nursing Jobs (Next.js)

A modern Next.js application that displays personalized nursing job listings from the CollabWORK API with a subscription-based landing page design. Features real-time job data, email-based personalization, responsive design, and seamless integration with the CollabWORK Partner API.

## ✨ Features

- **Personalized Job Recommendations**: Email-based job matching with subscriber location
- **Subscription Landing Page**: "You're Subscribed" status with personalized job recommendations
- **Real-time Job Data**: Fetches live nursing jobs from CollabWORK API
- **Email Parameter Support**: URL-based email parameter for personalized job matching
- **Automatic Retry Logic**: 5-second retry with 3 attempts for empty API responses
- **Dynamic Location Display**: Shows subscriber's actual city and state
- **Modern UI Design**: Clean, professional interface with job cards
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Job Details**: Salary ranges, locations, company info, and application stats
- **Expandable Descriptions**: Long job descriptions with show more/less functionality
- **Random Application Stats**: Dynamic "X nurses applied this week" counts
- **Environment Configuration**: Secure API key management
- **Fallback Support**: Graceful fallback to demo data if API fails

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- CollabWORK Partner API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd collab-work-nursing
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your API credentials:
   ```env
   # Secret API key for the CollabWORK Partner API
   COLLABWORK_API_KEY=d1ce2baf922734bbc04390cdf656dd50f86fbc028d6c2e64f4a51f870a4a69e6

   # Optional override for the CollabWORK endpoint
   COLLABWORK_ENDPOINT=

   # URL for "See More Jobs" button
   MORE_JOBS_URL=https://your-site.example.com/more-nursing-jobs
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📧 How It Works

### Email-Based Personalization

The application uses email parameters to provide personalized job recommendations:

**Basic Usage:**
```
http://localhost:3000?email=user@example.com
```

**Default Behavior:**
- If no email is provided, defaults to `chosennurse@hotmail.com`
- API fetches personalized jobs based on subscriber's location
- Displays subscriber's actual city and state in the UI

**Example URLs:**
```
http://localhost:3000?email=nurse@hospital.com
http://localhost:3000?email=john.doe@gmail.com
http://localhost:3000  # Uses default email
```

### API Integration

The application uses the CollabWORK `get_nursing_form_record_jobs` endpoint:

**Request Format:**
```
GET https://api.collabwork.com/api:partners/get_nursing_form_record_jobs?email=user@example.com&api_key=YOUR_API_KEY
```

**Response Structure:**
```json
{
  "id": 13,
  "subscriber_email": "user@example.com",
  "subscriber_city": "Chicago",
  "subscriber_state": "IL",
  "response_jobs": [
    {
      "title": "Healthcare Recruiter",
      "company": "RCM Healthcare Services",
      "job_eid": "4f3a6d4ae98544d79135cb7787b3b8a7",
      "industry": "Business Support Services",
      "location": "Chicago IL US",
      "is_remote": false,
      "salary_max": 60000,
      "salary_min": 55000,
      "date_posted": 1760400000000,
      "salary_period": "YEARLY",
      "url": "https://api.collabwork.com/api:1SHNakFf/jobs?ref=..."
    }
  ]
}
```

### Retry Logic

The application includes intelligent retry logic for better reliability:

- **Empty Response Handling**: If `response_jobs` is empty, automatically retries after 5 seconds
- **Maximum Retries**: Up to 3 retry attempts before falling back to demo data
- **User Feedback**: Shows retry status with progress indicator
- **Graceful Fallback**: Uses personalized demo data if all retries fail

## 🏗️ Project Structure

```
collab-work-nursing/
├── app/
│   ├── api/
│   │   ├── jobs/
│   │   │   └── route.ts          # API route for fetching jobs
│   │   └── youform.js            # Youform webhook handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── components/
│   └── JobCard.tsx               # Job card component
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `COLLABWORK_API_KEY` | Yes | Your CollabWORK API key | `d1ce2baf922734bbc04390cdf656dd50f86fbc028d6c2e64f4a51f870a4a69e6` |
| `COLLABWORK_ENDPOINT` | No | Override API endpoint | `https://api.collabwork.com/api:partners/get_nursing_form_record_jobs` |
| `MORE_JOBS_URL` | No | "See More Jobs" button URL | `https://your-site.com/jobs` |

### API Integration

The application integrates with the CollabWORK Partner API to fetch personalized nursing job listings. The API expects:

**Request Format:**
```
GET https://api.collabwork.com/api:partners/get_nursing_form_record_jobs?email=user@example.com&api_key=YOUR_API_KEY
```

**Response Format:**
```json
{
  "id": 13,
  "subscriber_email": "user@example.com",
  "subscriber_city": "Chicago",
  "subscriber_state": "IL",
  "response_jobs": [
    {
      "job_eid": "4f3a6d4ae98544d79135cb7787b3b8a7",
      "title": "Healthcare Recruiter",
      "company": "RCM Healthcare Services",
      "industry": "Business Support Services",
      "location": "Chicago IL US",
      "is_remote": false,
      "salary_max": 60000,
      "salary_min": 55000,
      "date_posted": 1760400000000,
      "salary_period": "YEARLY",
      "url": "https://api.collabwork.com/api:1SHNakFf/jobs?ref=..."
    }
  ]
}
```

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. Key design elements:

- **Header**: Gradient background with subscription status
- **Job Cards**: Clean white cards with hover effects
- **Colors**: Blue/purple theme with green salary highlights
- **Typography**: Modern, readable fonts

### Job Display

- **Maximum Jobs**: Displays up to 5 jobs per page
- **Job Cards Include**:
  - Company logo (circular with initials)
  - Job title and company name
  - Location and remote status
  - Salary range (formatted)
  - Job description (expandable if long)
  - Up to 3 skill tags
  - Apply Now and View Details buttons
  - Application statistics and posted date

### Query Customization

To change the default job search query, modify the API route in `app/api/jobs/route.ts`:

```typescript
const query = searchParams.get('query') || 'your-custom-query';
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `JOBS_API_URL`
   - `COLLABWORK_API_KEY`
   - `COLLABWORK_ENDPOINT` (optional)
   - `MORE_JOBS_URL` (optional)
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

Make sure to set all required environment variables in your deployment platform.

## 🔌 Webhook Integration (Youform)

The application includes a webhook handler for Youform integration:

### Setup

1. **Environment Variables**: Ensure `COLLABWORK_API_KEY` is set
2. **Deploy**: Deploy your application
3. **Configure Youform**: 
   - Go to your form → Integrate → Webhook
   - Set webhook URL to: `https://your-domain.com/api/youform`
4. **Test**: Submit a test form to verify integration

### How It Works

1. Youform sends form data via POST to `/api/youform`
2. The handler extracts text from the form submission
3. It queries the CollabWORK API with the extracted text
4. The response is logged and can be processed further

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Structure

- **`app/page.tsx`**: Main page with job fetching logic
- **`components/JobCard.tsx`**: Reusable job card component
- **`app/api/jobs/route.ts`**: API route for job data
- **`app/api/youform.js`**: Webhook handler for Youform

### Adding New Features

1. **New Job Fields**: Update the `Job` type in `components/JobCard.tsx`
2. **Styling Changes**: Modify Tailwind classes or `globals.css`
3. **API Changes**: Update the mapping logic in `app/page.tsx`

## 🔄 Retry Logic

The application includes intelligent retry logic for better reliability:

### How It Works

1. **Initial API Call**: Fetches personalized jobs based on email parameter
2. **Empty Response Detection**: If `response_jobs` array is empty, triggers retry
3. **Retry Process**: 
   - Waits 5 seconds before retrying
   - Shows user-friendly retry status with progress indicator
   - Maximum 3 retry attempts
4. **Fallback**: Uses personalized demo data if all retries fail

### User Experience

- **Loading State**: Shows "Loading jobs..." during initial fetch
- **Retry State**: Shows "Retrying..." with attempt counter (1/3, 2/3, 3/3)
- **Progress Indicator**: Animated spinner during retry attempts
- **Graceful Fallback**: Seamless transition to demo data if needed

## 🐛 Troubleshooting

### Common Issues

1. **"No jobs found" message**
   - Check if `COLLABWORK_API_KEY` is set correctly
   - Verify the API endpoint is accessible
   - Check browser console for errors
   - Wait for retry attempts to complete (up to 15 seconds)

2. **Empty response_jobs array**
   - This triggers automatic retry logic
   - Wait for retry attempts to complete
   - Check API logs for any issues
   - Verify email parameter is valid

3. **Hydration errors**
   - Ensure all client-side code is in components marked with `'use client'`
   - Check for server/client rendering mismatches

4. **API errors**
   - Verify your CollabWORK API key is valid
   - Check the API endpoint URL
   - Ensure the email parameter is properly formatted
   - Check if retry logic is working (look for retry messages)

### Debug Mode

Enable debug logging by adding console.log statements in:
- `app/page.tsx` - for job fetching
- `app/api/jobs/route.ts` - for API calls

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the CollabWORK API documentation
3. Open an issue in the repository

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**