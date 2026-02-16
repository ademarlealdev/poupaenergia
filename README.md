<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YarliyKuZ6xrdt5Tb5LcOH9RYG-zi9Hd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Data Updates

Currently, the tariff data in the database is **manually updated**. There is no automated background process scraping the provider websites.
However, the application always fetches the **latest data available in the database** at the moment of analysis.

To update prices, an administrator must run SQL updates on the database.
