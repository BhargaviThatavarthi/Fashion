# Claude Instructions — Sri Subhakari Fashions

This file provides context, rules, and guidelines for Anthropic Claude (or other AI coding assistants) when editing or extending the **Sri Subhakari Fashions** codebase.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) & [TanStack Start](https://tanstack.com/router/v1/docs/framework/react/start/overview) (Server-side rendering, routing, and functions)
- **Routing**: [TanStack Router](https://tanstack.com/router) (Strictly typed file-based routing)
- **Data Fetching & State**: [TanStack Query v5](https://tanstack.com/query) (`@tanstack/react-query` & `@tanstack/react-router-ssr-query`)
- **Forms**: [TanStack Form](https://tanstack.com/form) (`@tanstack/react-form`)
- **Database / Auth / Storage**: [Supabase](https://supabase.com/) (`@supabase/supabase-js` & `@supabase/ssr`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite` plugin)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [tw-animate-css](https://github.com/dgrubelic/tw-animate-css)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Validation**: [Zod](https://zod.dev/)
- **Package Manager**: `pnpm` (primarily used for command execution/dependencies)

---

## 📂 Project Structure

- `src/routes/`: Contains all route components.
  - `__root.tsx`: The root shell layout. Includes global head meta, styling links, header, footer, floating widgets, and DevTools.
  - `index.tsx`: Homepage (features featured products, categories, testimonials, contact, etc.).
  - `shop.tsx` & `shop.$slug.tsx`: Customer-facing store pages.
  - `admin/`: Admin panel routes. Managed via layout wrapper `admin/_layout.tsx`. Contains order manager, product manager (`products.$id.tsx`, `products.new.tsx`), settings, reports, categories, etc.
- `src/components/`: Reusable react components.
  - `ui/`: Local UI components (e.g. `button.tsx`, `card.tsx`, `badge.tsx`, `skeleton.tsx`). Follows Shadcn patterns.
  - `layout/`: Shared layout headers, footers, navigation, theme toggle, and floating widgets (WhatsApp FAB).
  - `home/` & `shop/`: Feature-specific UI elements.
- `src/services/`: Isolated database operations and API calls.
  - `products.ts`: CRUD for products.
  - `categories.ts`: Fetching and saving product categories.
  - `enquiries.ts`: Customer WhatsApp and form enquiry logs.
  - `testimonials.ts`: Customer reviews & testimonial functions.
- `src/lib/`: Library initialization.
  - `supabase.ts`: Supabase client instance and helpers.
  - `utils.ts`: Standard class merger tools (`cn`).
- `src/utils/`: Generic utilities.
  - `format.ts`: Price formats (`formatPrice`), slugs (`slugify`), dates.
  - `media.ts`: Image and media library/helpers.
  - `whatsapp.ts`: Deep links for sending shop enquiries directly to WhatsApp.
- `src/constants/`: Configuration files and static select options (e.g. `FABRIC_OPTIONS`, `SIZE_OPTIONS`).
- `src/styles.css`: Global styles & Tailwind base directives.

---

## 📜 Key Development Guidelines

### 1. TanStack Intent (Critical Rules)
Always follow the TanStack Intent rules documented in [AGENTS.md](file:///c:/Users/New%20User/Desktop/fashions/AGENTS.md). When editing router features, data loading, auth, server functions, or forms, execute the matching guidance command using `npx @tanstack/intent@latest load ...` to fetch target documentation if needed.

### 2. Adding / Modifying Routes
- This app uses file-based routing. To add a route, create a file inside `src/routes/`.
- Routes must use `createFileRoute('/path/to/route')` from `@tanstack/react-router`.
- Run `npm run generate-routes` to regenerate the route tree file (`src/routeTree.gen.ts`) whenever routes are added, renamed, or modified.

### 3. Styling & Aesthetics
- The website is designed for premium, elegant Indian ethnic wear (Sri Subhakari Fashions). Maintain a clean, vibrant, and responsive layout.
- Use curated colors: primary pinks/roses (`#D85C8A`), rich golds, deep darks for dark mode, and elegant light/glassmorphism aesthetics.
- Use `cn()` from `src/lib/utils` for merging Tailwind classes dynamically.

### 4. Database Interactions
- All direct Supabase query operations must go through service files inside `src/services/`.
- Avoid direct invocation of `supabase.from(...)` inside component files; instead, create a service function in the appropriate file and import it.
- Use TanStack Query's `useQuery` and `useMutation` hooks to manage fetching state, caching, errors, and invalidations.

### 5. Code Splitting & Performance
- Follow lazy loading conventions for components.
- For extremely large admin components, let TanStack Router split code automatically.

### 6. Local Server Running
- Start dev server: `npm run dev` (typically listens on `http://localhost:3000`).
- Build application: `npm run build`.

---

*This guide ensures codebase consistency, robustness, and visual elegance across all modules.*
