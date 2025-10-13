# CollabWORK Nursing Jobs (Next.js)

A modern Next.js application that displays nursing job listings from the CollabWORK API with a subscription-based landing page design. Features real-time job data, responsive design, and seamless integration with the CollabWORK Partner API.

## ✨ Features

- **Subscription Landing Page**: "You're Subscribed" status with personalized job recommendations
- **Real-time Job Data**: Fetches live nursing jobs from CollabWORK API
- **Modern UI Design**: Clean, professional interface with job cards
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Job Details**: Salary ranges, locations, company info, and application stats
- **Expandable Descriptions**: Long job descriptions with show more/less functionality
- **Random Application Stats**: Dynamic "X nurses applied this week" counts
- **Environment Configuration**: Secure API key management

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
   # Base URL for your job listings API
   JOBS_API_URL=https://api.collabwork.com/api:partners/JobSearchKW

   # Secret API key for the CollabWORK Partner API
   COLLABWORK_API_KEY=your_collabwork_api_key_here

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
| `JOBS_API_URL` | Yes | CollabWORK API endpoint | `https://api.collabwork.com/api:partners/JobSearchKW` |
| `COLLABWORK_API_KEY` | Yes | Your CollabWORK API key | `eyJhbGciOiJBMjU2S1ci...` |
| `COLLABWORK_ENDPOINT` | No | Override API endpoint | `https://api.collabwork.com/api:partners/JobSearchKW` |
| `MORE_JOBS_URL` | No | "See More Jobs" button URL | `https://your-site.com/jobs` |

### API Integration

The application integrates with the CollabWORK Partner API to fetch real-time nursing job listings. The API expects:

**Request Format:**
```
GET https://api.collabwork.com/api:partners/JobSearchKW?query=nursing
Authorization: Bearer YOUR_API_KEY
```

**Response Format:**
```json
[
  {
    "job_eid": "unique-job-id",
    "title": "Registered Nurse (RN) – Med/Surg",
    "company": "CareFirst Health",
    "location": "Houston, TX",
    "is_remote": false,
    "industry": "Health Care Providers & Services",
    "date_posted": 1759881600000,
    "salary_min": 72000,
    "salary_max": 92000,
    "salary_period": "YEARLY",
    "url": "https://api.collabwork.com/api:1SHNakFf/jobs?ref=..."
  }
]
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

## 🐛 Troubleshooting

### Common Issues

1. **"No jobs found" message**
   - Check if `COLLABWORK_API_KEY` is set correctly
   - Verify the API endpoint is accessible
   - Check browser console for errors

2. **Hydration errors**
   - Ensure all client-side code is in components marked with `'use client'`
   - Check for server/client rendering mismatches

3. **API errors**
   - Verify your CollabWORK API key is valid
   - Check the API endpoint URL
   - Ensure the query parameter is properly formatted

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