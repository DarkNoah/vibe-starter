# Vibe Starter - Next.js AI SaaS Starter Kit

A modern, production-ready starter for building AI-first SaaS products with Next.js 15, Auth.js (NextAuth), Stripe billing, and a multi-provider AI layer. Designed for fast iteration with a clean UI, protected routes, and a flexible agent stack.

## Features

- 🚀 **Next.js 15 with App Router** - React 19, server components, streaming
- ⚡️ **Turbopack** - Fast local dev with hot module replacement
- 🎨 **TailwindCSS v4** - Utility-first styling with a modern design system
- 🔐 **Auth.js (NextAuth)** - GitHub OAuth and protected routes
- 💳 **Stripe Billing** - Checkout, webhooks, and subscription gating
- 🧱 **Drizzle ORM** - Type-safe DB layer (SQLite locally, Postgres in prod)
- 🤖 **Mastra Agents** - Threads, tools, and workflows for AI features
- 🧠 **AI SDK Providers** - OpenAI, Anthropic, Google, DeepSeek, xAI, Replicate
- 🌍 **i18n Ready** - `next-i18next` and language detection
- ✨ **Animated UI** - Framer Motion, React Bits, shadcn/ui + Radix UI
- 📊 **Dashboard UI** - Charts, tables, and a composable layout
- 🚢 **Vercel Ready** - Optimized for Next.js deployments

## Tech Stack

### Frontend

- **Next.js 15** - App Router + React 19
- **TailwindCSS v4** - Utility-first CSS
- **shadcn/ui + Radix UI** - Accessible component primitives
- **Framer Motion + Motion** - Animations and transitions
- **Recharts** - Data visualization

### Backend & Services

- **Auth.js (NextAuth)** - Authentication and session management
- **Stripe** - Subscriptions, checkout, and webhooks
- **Drizzle ORM** - Type-safe DB access
- **Mastra** - Agents, tools, memory, and storage adapters
- **Vercel AI SDK** - Multi-provider model layer

### Dev & Deployment

- **TypeScript** - Full type safety
- **Vercel** - Hosting and edge-ready deployments
- **Turbopack** - Fast dev server

## Getting Started

### Prerequisites

- Node.js 18+
- GitHub OAuth App (for Auth.js)
- Stripe account (for billing)

### Installation

1. Install dependencies:

```bash
npm install # or pnpm / yarn / bun
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local`:

```bash
# Auth.js (NextAuth)
AUTH_SECRET=replace_with_long_random_string
AUTH_URL=http://localhost:3000

# OAuth provider (GitHub)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Database (Drizzle)
DATABASE_DIALECT=sqlite
DATABASE_URL=file:./.data/auth.db

# Mastra storage
MASTRA_STORAGE=libsql
MASTRA_STORAGE_DATABASE_URL=file:./.data/storage.db

# Stripe
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

4. Run the dev server:

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`.

## Stripe Setup

- Configure the webhook endpoint at `/api/stripe/webhook`.
- Listen for `checkout.session.completed`, `customer.subscription.created`,
  `customer.subscription.updated`, `customer.subscription.deleted`.

## Architecture

### Key Routes

- `/` - Landing page
- `/dashboard` - Protected dashboard
- `/dashboard/payment-gated` - Subscription-gated content
- `/threads` - Agent threads UI
- `/api/chat` - Mastra + AI SDK chat endpoint
- `/api/stripe/checkout` - Stripe checkout session
- `/api/stripe/webhook` - Stripe webhook handler

### Authentication Flow

- Auth.js with GitHub OAuth
- JWT sessions with user id stored in the token
- Route protection via middleware and layouts

### Billing Flow

- Create Stripe checkout sessions for subscriptions
- Store Stripe customer + subscription status in `userBilling`
- Webhooks keep billing status in sync

## Project Structure

```
├── app/
│   ├── (landing)/          # Landing page components
│   ├── (auth)/             # Sign-in and auth-related routes
│   ├── (pages)/            # Main app pages (threads, settings)
│   ├── dashboard/          # Protected dashboard
│   ├── api/                # Chat + Stripe APIs
│   └── globals.css         # Global styles
├── components/             # UI and layout components
├── lib/
│   ├── db/                 # Drizzle schema + client
│   ├── mastra/             # Agents, tools, workflows
│   └── stripe.ts           # Stripe SDK config
├── middleware.ts           # Route protection
└── auth.config.ts          # Auth.js config
```

## Environment Variables

### Required

- `AUTH_SECRET`
- `AUTH_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `DATABASE_DIALECT`
- `DATABASE_URL`
- `MASTRA_STORAGE`
- `MASTRA_STORAGE_DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Optional Model Providers

- `OPENAI_API_KEY`, `OPENAI_MODELS`, `OPENAI_BASE_URL`
- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODELS`, `ANTHROPIC_BASE_URL`
- `GOOGLE_API_KEY`, `GOOGLE_MODELS`, `GOOGLE_BASE_URL`
- `DEEPSEEK_API_KEY`, `DEEPSEEK_MODELS`, `DEEPSEEK_BASE_URL`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database Migrations

Generate a new migration after schema changes:

```bash
npx drizzle-kit generate --config drizzle.config.ts
```

Apply migrations to your database:

```bash
npx drizzle-kit migrate --config drizzle.config.ts
```

## License

MIT
