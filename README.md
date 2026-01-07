# Starter.diy - Elite Next.js SaaS Starter Kit

A modern, production-ready SaaS starter template for building full-stack applications using Next.js 15, Clerk, and Clerk Billing. The easiest way to start accepting payments with beautiful UI and seamless integrations.

[🌐 Live Demo](https://elite-next-clerk-convex-starter.vercel.app/) – Try the app in your browser!


## Features

- 🚀 **Next.js 15 with App Router** - Latest React framework with server components
- ⚡️ **Turbopack** - Ultra-fast development with hot module replacement
- 🎨 **TailwindCSS v4** - Modern utility-first CSS with custom design system
- 🔐 **Clerk Authentication** - Complete user management with social logins
- 💳 **Clerk Billing** - Integrated subscription management and payments
- 🛡️ **Protected Routes** - Authentication-based route protection
- 💰 **Payment Gating** - Subscription-based content access
- 🎭 **Beautiful 404 Page** - Custom animated error page
- 🌗 **Dark/Light Theme** - System-aware theme switching
- 📱 **Responsive Design** - Mobile-first approach with modern layouts
- ✨ **Custom Animations** - React Bits and Framer Motion effects
- 🧩 **shadcn/ui Components** - Modern component library with Radix UI
- 📊 **Interactive Dashboard** - Complete admin interface with charts
- �� **Webhook Integration** - Automated user and payment sync
- 🚢 **Vercel Ready** - One-click deployment

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TailwindCSS v4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations and transitions
- **Motion Primitives** - Advanced animation components
- **Lucide React & Tabler Icons** - Beautiful icon libraries
- **Recharts** - Data visualization components
- **React Bits** - Custom animation components

### Backend & Services
- **Clerk** - Authentication and user management
- **Clerk Billing** - Subscription billing and payments
- **Svix** - Webhook handling and validation

### Development & Deployment
- **TypeScript** - Type safety throughout
- **Vercel** - Deployment platform
- **Turbopack** - Fast build tool

## Getting Started

### Prerequisites

- Node.js 18+ 
- Clerk account for authentication and billing

### Installation

1. Download and set up the starter template:

```bash
# Download the template files to your project directory
# Then navigate to your project directory and install dependencies
npm install #or pnpm / yarn / bun
```

2. Set up your environment variables:

```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:

```bash
# Clerk Authentication & Billing
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Model providers
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODELS=gpt-4o-mini
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODELS=deepseek-chat
```
4. Set up Clerk webhooks:
   - In your Clerk dashboard, configure webhook endpoint: `{your_domain}/clerk-users-webhook`
   - Enable events: `user.created`, `user.updated`, `user.deleted`, `paymentAttempt.updated`
   - Copy the webhook signing secret to your deployment environment

5. Configure Clerk Billing:
   - Set up your pricing plans in Clerk dashboard
   - Configure payment methods and billing settings


9. Configure Clerk Sessions Claims
   - Go to your Clerk dashboard - Configure - Sessions - Customize session token
   - Add json claims
```json
{
	"metadata": "{{user.public_metadata}}"
}
```
   - Clerk dashboard - Users - Metadata - public , add json
```json
{
  "role": "admin"
}
```

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`.

## Architecture

### Key Routes
- `/` - Beautiful landing page with pricing
- `/dashboard` - Protected user dashboard
- `/dashboard/payment-gated` - Subscription-protected content
- `/clerk-users-webhook` - Clerk webhook handler

### Authentication Flow
- Seamless sign-up/sign-in with Clerk
- Protected routes with middleware
- Social login support
- Automatic redirects to dashboard after auth

### Payment Flow
- Custom Clerk pricing table component
- Subscription-based access control
- Real-time payment status updates
- Webhook-driven payment tracking

## Project Structure

```
├── app/
│   ├── (landing)/          # Landing page components
│   │   ├── hero-section.tsx
│   │   ├── features-one.tsx
│   │   ├── pricing.tsx
│   │   └── ...
│   ├── dashboard/          # Protected dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── payment-gated/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── not-found.tsx       # Custom 404 page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── custom-clerk-pricing.tsx
│   ├── theme-provider.tsx
│   └── ...
├── lib/
│   └── utils.ts            # Utility functions
└── middleware.ts           # Route protection
```

## Key Components

### Landing Page
- **Hero Section** - Animated hero with CTAs
- **Features Section** - Interactive feature showcase
- **Pricing Table** - Custom Clerk billing integration
- **Testimonials** - Social proof section
- **FAQ Section** - Common questions
- **Footer** - Links and information

### Dashboard
- **Sidebar Navigation** - Collapsible sidebar with user menu
- **Interactive Charts** - Data visualization with Recharts
- **Data Tables** - Sortable and filterable tables
- **Payment Gating** - Subscription-based access control

### Animations & Effects
- **Splash Cursor** - Interactive cursor effects
- **Animated Lists** - Smooth list animations
- **Progressive Blur** - Modern blur effects
- **Infinite Slider** - Continuous scrolling elements

## Theme Customization

The starter kit includes a fully customizable theme system. You can customize colors, typography, and components using:

- **Theme Tools**: [tweakcn.com](https://tweakcn.com/editor/theme?tab=typography), [themux.vercel.app](https://themux.vercel.app/shadcn-themes), or [ui.jln.dev](https://ui.jln.dev/)
- **Global CSS**: Modify `app/globals.css` for custom styling
- **Component Themes**: Update individual component styles in `components/ui/`

## Environment Variables

### Required for .env.local

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` - Redirect after sign in
- `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` - Redirect after sign up
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` - Fallback redirect for sign in
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` - Fallback redirect for sign up
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_MODELS` - Comma-separated OpenAI models
- `DEEPSEEK_API_KEY` - DeepSeek API key (optional)
- `DEEPSEEK_MODELS` - Comma-separated DeepSeek models (optional)
- `GOOGLE_API_KEY` - Google API key (optional)
- `GOOGLE_MODELS` - Comma-separated Google models (optional)
- `ANTHROPIC_API_KEY` - Anthropic API key (optional)
- `ANTHROPIC_MODELS` - Comma-separated Anthropic models (optional)

## Deployment

### Vercel Deployment (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

The project is optimized for Vercel with:
- Automatic builds with Turbopack
- Environment variable management
- Edge function support

### Manual Deployment

Build for production:

```bash
npm run build
npm start
```

## Customization

### Styling
- Modify `app/globals.css` for global styles
- Update TailwindCSS configuration
- Customize component themes in `components/ui/`

### Branding
- Update logo in `components/logo.tsx`
- Modify metadata in `app/layout.tsx`
- Customize color scheme in CSS variables

### Features
- Add new dashboard pages in `app/dashboard/`
- Create custom components in `components/`

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Why Starter.diy?

**THE EASIEST TO SET UP. EASIEST IN TERMS OF CODE.**

- ✅ **Clerk + Clerk Billing** make it incredibly simple
- ✅ **No complex payment integrations** - Clerk handles everything
- ✅ **Real-time user sync** - Webhooks work out of the box
- ✅ **Beautiful UI** - Tailark.com inspired landing page blocks
- ✅ **Production ready** - Authentication, payments, and database included
- ✅ **Type safe** - Full TypeScript support throughout

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

**Stop rebuilding the same foundation over and over.** Starter.diy eliminates weeks of integration work by providing a complete, production-ready SaaS template with authentication, payments, and a configurable provider layer out of the box.

Built with ❤️ using Next.js 15, Clerk, and modern web technologies.



Source: 
[elite-next-clerk-convex-starter](https://github.com/artem-lazarev/elite-next-clerk-convex-starter/)
