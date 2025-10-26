# Environment Variables Setup Guide

## ⚠️ Security Notice
Never commit `.env.local` or `.env` files to version control. They contain sensitive information.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# CollabWork API Configuration
COLLABWORK_API_KEY=your_api_key_here

# CollabWork API Endpoint (optional)
JOBS_API_URL=https://api.collabwork.com/api:partners/get_nursing_form_record_jobs

# More Jobs URL (optional)
MORE_JOBS_URL=https://app.collabwork.com/board/5a72371f-659b-4f3b-9aeb-d13bf23f9e87

# Node Environment
NODE_ENV=development
```

## Setup Steps

1. Copy the template (if available):
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your actual values

3. Restart the development server:
   ```bash
   npm run dev
   ```

## Environment Variables Explained

- **COLLABWORK_API_KEY**: Required. Your CollabWork API key for authentication
- **JOBS_API_URL**: Optional. Defaults to the CollabWork jobs endpoint
- **MORE_JOBS_URL**: Optional. Where to redirect users when no jobs found
- **NODE_ENV**: Optional. Set to 'production' or 'development'

## Security Best Practices

- ✅ Always use `.env.local` for local development
- ✅ Never commit `.env.local` to Git
- ✅ Use different API keys for development and production
- ✅ Rotate API keys regularly
- ✅ Use environment-specific variables in production hosting

