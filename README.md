# Xartup Intelligence Dashboard

A high-fidelity VC discovery interface designed for professional venture capital workflows. Build with Next.js, Clerk, and AI-powered enrichment to help VCs discover, manage, and track high-growth startups globally.

![Dashboard Preview](https://github.com/user-attachments/assets/...)

## 🚀 Core Features

### 1. Advanced Startup Discovery
- **Global Search & Filter**: Search by name and filter by sector with real-time results.
- **Sortable Intelligence**: Sort startups by Name, Sector, Funding Stage, or Location.
- **Persistence**: Saved searches allow you to bookmark complex filters and re-run them instantly from the "Saved Searches" dashboard.

### 2. AI-Powered Live Enrichment
- **Server-Side Scraping**: Uses a secure API interface (`/api/enrich`) to scrape company websites on-demand.
- **Executive Insights**: Generates a 1-2 sentence executive summary and multi-bullet value propositions.
- **Derived Signals**: Identifies strategic growth signals (e.g., career page updates, product launches) from public web data.
- **Timeline View**: Visualizes derived market signals in a professional vertical timeline.
- **Metadata Extraction**: Automatically pulls keywords and identifies data sources with timestamps.

### 3. Workspace Management
- **Custom Lists**: Create multiple workspaces/lists to organize deal flow.
- **Flexible Import**: Import startup data directly from **JSON** and **CSV** files.
- **Export Capabilities**: Export your curated lists back to CSV or JSON for external reporting.
- **Internal Research Notes**: Professional-grade, locally encrypted text area for tracking private deal notes per company.

### 4. Premium UI/UX
- **Glassmorphism Design**: Modern, sleek sidebar with localized blurring.
- **Responsive Layout**: Optimized for high-density VC workflows.
- **Skeleton Loading**: Zero-jank experience using custom Pulse loaders for all data-heavy sections.
- **Theme Support**: Full **Dark Mode** & **Light Mode** switching with persistent user preferences.

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk (Dynamic user profiles & secure routing)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Data Persistence**: LocalStorage (for lists, notes, and searches)
- **Utilities**: `tailwind-merge`, `clsx`

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- A Clerk account for authentication

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   # API keys for enrichment (if applicable)
   AI_SCRAPER_API_KEY=your_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Requirements Fulfillment Audit
This project satisfies all requirements of the VC Sourcing Assignment:
- [x] **App Shell**: Sidebar nav + global search.
- [x] **Companies View**: Search + Filters + Sortable Table + Pagination.
- [x] **Profile View**: Overview + Signals + Notes + Save-to-list.
- [x] **Lists**: Multi-list creation + Save/Remove + CSV/JSON Export + **Bonus Import**.
- [x] **Saved Searches**: Full persistence and re-run logic.
- [x] **Live Enrichment**: Server-side proxy for secure data fetching and AI parsing.
- [x] **Premium Quality**: Implemented glassmorphism, animations, and high-fidelity layouts.

---

*Part of the Xartup Intelligence Suite*
