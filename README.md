# Ashesi Business Directory

A web application to showcase student businesses at Ashesi University.

## Features

- Browse student businesses by year and category
- View detailed business information
- Gallery of business photos
- Committee members showcase
- Admin panel for managing content

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase (Backend & Database)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ashesi-business.git
   cd ashesi-business
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up Supabase:
   - Create a new project at [Supabase](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your Supabase credentials

4. Run the database migrations:
   - Go to your Supabase project's SQL editor
   - Copy and paste the SQL commands from `backend.md`
   - Execute the commands to create the necessary tables and policies

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js app directory
│   ├── admin/           # Admin panel pages
│   ├── business/        # Business listing pages
│   ├── committee/       # Committee members page
│   ├── gallery/         # Gallery page
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                 # Utility functions and types
├── public/             # Static assets
└── styles/             # Global styles
```

## Environment Variables

Create a `.env` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

See `backend.md` for the complete database schema and setup instructions.

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT License 