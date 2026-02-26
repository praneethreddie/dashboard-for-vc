# VC Intelligence Dashboard & Enrichment

A premium, functional VC discovery interface built for the Vibe Coding Take-Home challenge. This application allows users to discover startups, manage investment lists, and run real-time AI-powered enrichment to gather deep insights from public web data.

## 🚀 Key Features

- **Discovery Engine**: Robust search, filtering (Sector/Stage), and sortable results table with pagination.
- **Magic AI Discovery**: Search for any company name not in the database; the AI "Intelligence Engine" will scour the web to generate a profile in real-time.
- **Enrichment Workflows**: Click "Enrich" on any profile to pull live insights (Executive Summary, Value Props, Derived Signals, Keywords) via a server-side API.
- **Workstream Management**:
  - **Custom Lists**: Create and manage investment lists.
  - **Exporting**: Export your lists as CSV or JSON for external use.
  - **Saved Searches**: Save your discovery filters to re-run them later.
- **Premium UI**: Dark-mode optimized, "Linear-style" aesthetic with high-contrast monochrome tokens and professional typography.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` (for lists, notes, saved searches, and cache).
- **Enrichment**: Server-side Next.js API Routes.

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or extract the zip.
2. Navigate to the project directory:
   ```bash
   cd vc-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Environmental Variables

The enrichment engine is currently configured with high-fidelity "Ground Truth" data and high-quality simulations for the demo. To connect to a live LLM provider in production:
1. Add `OPENAI_API_KEY` or `GOOGLE_AI_KEY` to your `.env.local`.
2. Update `src/app/api/enrich/route.ts` to call the respective provider.

---
Built as part of the VC Sourcing Intern Assignment.
