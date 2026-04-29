# Astra AI Deployment Guide

This guide ensures your application runs smoothly on Netlify and other production environments.

## 1. Firebase Authentication Setup

If you see an **"Unauthorized Domain"** error (especially on Netlify), you must authorize your new domain in Firebase:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project.
3.  Navigate to **Authentication** > **Settings** > **Authorized domains**.
4.  Click **Add domain** and enter `resumelite-ai.netlify.app`.

## 2. Environment Variables

To enable the AI features (Resume Analysis, Cover Letter Generator, Career Coach), you must set your Gemini API key in your deployment platform's environment variables.

### On Netlify:
1.  Go to your Site Settings > **Environment variables**.
2.  Add a new variable:
    -   Key: `VITE_GEMINI_API_KEY`
    -   Value: `[Your Gemini API Key]`
3.  Trigger a new deploy.

## 3. GitHub Integration
To commit these changes to your GitHub repository:
1.  Open the **Settings** menu in the AI Studio sidebar (bottom left).
2.  Select **Export**.
3.  Choose **GitHub** and follow the prompts to sync your code.

## 4. Local Development
If you clone this repository locally:
1.  Run `npm install`.
2.  Create a `.env` file in the root.
3.  Add `VITE_GEMINI_API_KEY=your_key_here`.
4.  Run `npm run dev`.

---
*Built with Astra AI & Google AI Studio*
