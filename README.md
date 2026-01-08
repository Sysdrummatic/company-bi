# Company BI

## Published site

**URL**: [Company BI](https://companybi.lovable.app/)

## About project

The simple one page project of a company browser. Built with Lovable and Supabase.

---

## Project info

**URL**: [Lovable project](https://lovable.dev/projects/6916cf2d-a59a-4fe4-99c9-21093a597173)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6916cf2d-a59a-4fe4-99c9-21093a597173) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the Vite development server with auto-reloading and an instant preview.
npm run dev
```

## Authentication and working with private data

- The main page is publicly available and shows only companies marked as public.
- Registered users can log in, add new companies, and decide if data should be public.
- After logging in, the user panel is available at [`/dashboard`](http://localhost:5173/dashboard).

## Deployment

The application is designed to be deployed via Lovable or any standard static hosting that supports Vite apps (Vercel, Netlify), as long as the Supabase environment variables are configured.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Auth & Database)

