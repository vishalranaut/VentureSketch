# VentureSketch Developer Onboarding Guide

Welcome to the VentureSketch engineering team! This repository is designed to be highly modular, scalable, and decoupled. Before you get your hands dirty, please read through these core rules and guidelines to understand how we build here.

## 🏗️ 1. Repository Structure

We use a **pnpm workspaces / TurboRepo** monorepo setup.

- **`apps/api`**: The backend, built with NestJS. Highly modular.
- **`apps/web`**: The web frontend, built with Next.js (App Router).
- **`apps/mobile`**: The mobile app, built with Expo (React Native) and Expo Router.
- **`packages/types` & `packages/validators`**: Shared TypeScript interfaces and Zod schemas. **(Crucial)**
- **`packages/theme`**: Shared design system tokens (colors, typography, spacing).
- **`workers/*`**: Background processing jobs (AI, Export, Research, etc.).

---

## 📜 2. The Golden Rules of Development

### Rule 1: Never Break the Contract
The Web and Mobile apps **never** guess what data the backend expects or returns. 
- All data shapes must be defined in `packages/types` and validated with `packages/validators` (using Zod).
- If you change an API response, you **must** update the shared types first. TypeScript will automatically break the build if the frontend is incompatible.

### Rule 2: Keep the Backend Modular
The NestJS API (`apps/api`) is divided into distinct domains (e.g., `ideas`, `workspaces`).
- **Do not tightly couple modules.** A module should not directly reach into another module's database tables. 
- If you are adding a completely new feature (e.g., `comments`), generate a brand new module (`apps/api/src/modules/comments`) and import it into `app.module.ts`.

### Rule 3: Use the Shared Theme
Our UI relies on a premium, dark-mode-first, glassmorphic aesthetic.
- **Never hardcode hex colors** (e.g., `#FF0000`).
- Always import your tokens from `@venture-sketch/theme`. If a color needs to change, it changes in `packages/theme/src/colors.ts` so that Web and Mobile update simultaneously.

### Rule 4: OpenAPI is the Source of Truth
The backend automatically generates an `openapi.json` file on startup. 
- Ensure any new controllers or endpoints you create in NestJS are decorated with `@ApiTags()`, `@ApiOperation()`, and `@ApiResponse()`.
- If the swagger documentation doesn't reflect your API, your PR is not finished.

---

## 🛠️ 3. Standard Feature Workflow

When you are assigned a new feature, follow this exact order of operations:

1. **Define the Types**: Go to `packages/types` and `packages/validators`. Write the Zod schemas and export the inferred TypeScript types for your new feature.
2. **Build the API**: Go to `apps/api`. Create your module, controller, and service. Rely on the types you just created for your DTOs.
3. **Verify OpenAPI**: Start the API server locally (`npm run dev` in `apps/api`) and verify the `openapi.json` reflects your new endpoints.
4. **Build the UI**: Go to `apps/web` and `apps/mobile`. Use `@venture-sketch/api-client` to fetch your new endpoints. Use `@venture-sketch/theme` to style the UI.

---

## 🚀 Getting Started Locally

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development environment (API, Web, and Workers):
   ```bash
   pnpm run dev
   ```
3. Check the Swagger documentation to see available endpoints:
   - `http://localhost:3000/api/docs`

Welcome aboard! 🚢
