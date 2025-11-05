# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/30b623e5-dc78-40ee-8a38-703cc90591dd

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/30b623e5-dc78-40ee-8a38-703cc90591dd) and start prompting.

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

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/30b623e5-dc78-40ee-8a38-703cc90591dd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Supabase (local dev)

This project includes a generated Supabase client at `src/integrations/supabase/client.ts`.

Required environment variables (Vite expects vars prefixed with `VITE_`):

- `VITE_SUPABASE_URL` - your Supabase project URL (e.g. `https://xyz.supabase.co`)
- `VITE_SUPABASE_PUBLISHABLE_KEY` - your anon/publishable key

The repo already contains defaults in the generated client for convenience. To use your own project, create or update a `.env` file at the project root with:

```properties
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```

After editing `.env`, restart the dev server.

There is a small hook `src/hooks/useProducts.ts` that demonstrates how to fetch products with React Query and the typed Supabase client. Example usage in a component:

```tsx
import useProducts from '@/hooks/useProducts';

function Example() {
	const { data, isLoading } = useProducts({ limit: 8, featured: true });
	if (isLoading) return <div>Loading...</div>;
	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

