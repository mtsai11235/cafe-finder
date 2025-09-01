# Deploying to Vercel

This document provides step-by-step instructions for deploying the Cafe Finder app to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Git](https://git-scm.com/) installed on your computer
3. Your Google Maps API key

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is in a Git repository:

```bash
# If not already in a Git repository
git init
git add .
git commit -m "Initial commit"
```

### 2. Push to GitHub (Optional but Recommended)

Create a repository on GitHub and push your code:

```bash
git remote add origin https://github.com/yourusername/cafe-finder.git
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using the Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project.

#### Option B: Using the Vercel Web Interface

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "New Project"
3. Import your repository from GitHub (or another Git provider)
4. Configure your project settings

### 4. Set Up Environment Variables

1. In the Vercel dashboard, go to your project
2. Navigate to "Settings" > "Environment Variables"
3. Add the following environment variable:
   - Name: `GOOGLE_MAPS_API_KEY`
   - Value: Your Google Maps API key
4. Click "Save"

### 5. Configure Domain Settings (Optional)

1. In the Vercel dashboard, go to your project
2. Navigate to "Settings" > "Domains"
3. Add your custom domain if you have one

### 6. Redeploy After Changes

After making changes to your code:

```bash
# Commit your changes
git add .
git commit -m "Update app"

# Push to GitHub
git push

# If using Vercel CLI, deploy again
vercel
```

## Troubleshooting

- **API Key Issues**: Make sure your API key is correctly set in the environment variables.
- **Build Errors**: Check the build logs in the Vercel dashboard for any errors.
- **CORS Issues**: Ensure your Google Maps API key has the correct domain restrictions.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
