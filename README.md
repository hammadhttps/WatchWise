<div align="center">

<img src="https://img.shields.io/badge/WatchWise-Movie%20Discovery-6d28d9?style=for-the-badge" alt="WatchWise" />

<h1>WatchWise</h1>

<p>
  <img src="https://img.shields.io/badge/Stack-MERN-0ea5e9?style=flat-square" alt="MERN" />
  <img src="https://img.shields.io/badge/AI-Google%20Gemini-7c3aed?style=flat-square" alt="Gemini" />
  <img src="https://img.shields.io/badge/Realtime-Socket.io-059669?style=flat-square" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Movies-TMDB-f59e0b?style=flat-square" alt="TMDB" />
</p>

<p align="center">
  <b>A full-stack movie discovery platform where taste meets conversation.</b><br/>
  Discover, like, save, and get AI-curated recommendations &mdash; then watch together in real time.
</p>

</div>

---

WatchWise is a full-stack movie discovery platform built on the MERN stack (MongoDB, Express, React, Node.js). It combines TMDB-powered browsing with a personal taste engine: users like and save movies, get AI-generated recommendations from Google Gemini based on their actual viewing taste, write community reviews, and chat about movies with friends in real-time watch party rooms.

## Features

<div align="center">

| Secure Auth | Smart Discovery | AI Movie Match | Live Watch Parties |
| :---: | :---: | :---: | :---: |
| JWT + bcrypt, security questions | TMDB browse, search & detail pages | Gemini recommendations from your taste | Real-time rooms over Socket.io |

</div>

### Authentication

- Sign up with name, email and password; passwords are hashed with bcrypt (12 rounds) before storage.
- Sessions use JWT stored in an httpOnly cookie (24 hours by default, 7 days with "Remember me"), so tokens are never exposed to client-side JavaScript.
- Security questions are optional at signup. If a user sets them, exactly three are required and the hashed answers enable self-service password recovery.
- Password reset flow: the user answers at least 2 of their 3 security questions, which issues a short-lived (10 minute) reset token in an httpOnly cookie. Only then can a new password be set. Failed attempts are rate limited and lock the account for 15 minutes after 3 failures.
- Accounts without security questions receive a clear message that online reset is unavailable rather than a silent failure.

### Movie discovery

- Home page with a featured hero and a paginated upcoming movies grid.
- Dedicated browse pages for Popular, Trending (weekly) and Coming Soon, plus an Anime Hub section.
- Live navbar search against TMDB with a debounced dropdown showing posters, release year and rating; selecting a result opens the movie page.
- Movie detail pages with score breakdown, cast/production details, streaming providers, trailers, image galleries, similar titles and a famous quote for the film.

### Likes and watchlist

- Heart (like) and bookmark (watchlist) buttons on every movie card and detail page.
- Stored per-user in MongoDB with duplicate protection; each saved entry keeps the title, poster, genres and release year.
- The frontend uses TanStack Query with optimistic updates and automatic server reconciliation, so the UI responds instantly and stays consistent across tabs and reloads.

### AI Movie Match (Google Gemini)

- Signed-in users open the AI Movie Match wizard from the navbar, pick tonight's mood, company, era and genres, and optionally add a free-text note.
- The backend builds a prompt from the user's liked movies and watchlist plus the session context and calls Gemini with a strict JSON response schema, so results are always structured. A model fallback chain keeps the feature working if a model is unavailable.
- Gemini is instructed never to recommend movies the user has already liked or saved. Each of the six picks includes a match score and a personal reason referencing the user's taste.
- Results are enriched with TMDB posters and link to the movie pages.
- Every session (preferences plus all six picks) is saved to the user's profile, capped at the 20 most recent sessions.

### Taste profile

- The profile's Taste tab computes a genre breakdown and favorite-decades summary from the user's liked movies.
- "The Critic's Verdict" asks Gemini to write a short, witty roast of the user's taste that references their actual liked movies. Requires at least three likes.

### Community reviews

- Any signed-in user can rate a movie (1 to 5 stars) with an optional written review of up to 2000 characters.
- One review per user per movie, enforced by a unique database index; reviews are editable and deletable by their author.
- The Reviews tab shows a comparison between the WatchWise community average and the TMDB critics score, alongside imported TMDB reviews.

### Watch party rooms (real time)

- A Watch Party button on any movie page creates a room with a shareable invite link.
- Rooms run over Socket.io; the websocket handshake authenticates using the same JWT cookie as the REST API.
- Live member list with join/leave system messages, chat with message bubbles and timestamps, and chat history (last 100 messages) replayed to anyone who joins or reloads.
- Messages are trimmed and capped at 500 characters server-side. Rooms are held in memory and expire after the server restarts; visiting a dead room shows a friendly notice.

### Profile

- Avatar, member-since date and stat tiles for watchlist, likes and AI sessions.
- Tabs for Watchlist, Liked movies (poster grids with hover-remove), AI History (expandable past sessions with preferences and picks) and Taste.

## Tech stack

<div align="center">

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, TanStack Query 5, Socket.io client, Axios, Lucide icons |
| **Backend** | Node.js, Express 5, Socket.io, JSON Web Tokens, bcryptjs, cookie-parser |
| **Database** | MongoDB with Mongoose 9 |
| **External APIs** | TMDB (movie data), Google Gemini (recommendations, taste analysis) |

</div>

> [!NOTE]
> WatchWise pairs a modern React frontend with a secure Express backend. Every authenticated route is protected by a JWT cookie, and AI features are gated so the Gemini key is never exposed to the browser.

## Project structure

```text
WatchWise/
  backend/
    server.js               Express app, Socket.io server, route registration
    src/
      config/db.js          MongoDB connection
      middleware/auth.js    JWT cookie authentication middleware
      models/               User (likes, watchlist, AI history), Review
      routes/               auth, likes, watchlist, recommendations,
                            taste, reviews, party, quotes
      services/gemini.js    Shared Gemini API client with model fallback
      party.js              In-memory watch party rooms and socket handlers
  frontend/
    src/
      components/           Movie cards, community reviews, AI Movie Match,
                            taste section, navbar, trailer modal
      context/              Auth context and provider
      hooks/                TanStack Query hooks (likes, watchlist, search,
                            AI history) and TMDB data hooks
      pages/                Home, browse pages, movie detail, anime hub,
                            profile, watch party, auth pages
      services/             API client (backend) and TMDB client
```

## Getting started

### Prerequisites

- Node.js 20 or later
- A MongoDB database (local or MongoDB Atlas)
- A TMDB API read access token (free at themoviedb.org)
- A Google Gemini API key (free tier at aistudio.google.com)

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/watchwise
JWT_SECRET=a-long-random-string
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your-gemini-api-key
```

Start the server:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_TMDB_API_URL=https://api.themoviedb.org/3
VITE_TMDB_API_TOKEN=your-tmdb-read-access-token
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server proxies `/api` and `/socket.io` to the backend on port 5000, so no CORS configuration is needed during development.

## API overview

All routes are prefixed with `/api`. Routes marked "auth" require the JWT cookie.

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | /auth/signup | - | Create an account (security questions optional) |
| POST | /auth/login | - | Log in; sets the JWT cookie |
| POST | /auth/logout | - | Clear the session cookie |
| GET | /auth/me | auth | Current user |
| POST | /auth/forgot-password | - | Fetch security questions for an email |
| POST | /auth/verify-questions | - | Verify answers; issues a reset token cookie |
| POST | /auth/reset-password | reset token | Set a new password |
| PUT | /auth/security-questions | auth | Update security questions |
| GET/POST | /likes | auth | List / add liked movies |
| DELETE | /likes/:tmdbId | auth | Remove a liked movie |
| GET/POST | /watchlist | auth | List / add watchlist movies |
| DELETE | /watchlist/:tmdbId | auth | Remove from watchlist |
| POST | /recommendations | auth | Generate six Gemini picks from taste and context |
| GET | /recommendations/history | auth | Past AI sessions (latest 20) |
| POST | /taste/roast | auth | Gemini-written analysis of the user's taste |
| GET | /reviews/:movieId | - | Reviews and rating stats for a movie |
| POST | /reviews | auth | Create or update your review |
| DELETE | /reviews/:movieId | auth | Delete your review |
| POST | /party | auth | Create a watch party room |
| GET | /party/:id | - | Room info |
| GET | /quotes | - | A quote for a movie title |

Socket.io events: `party:join`, `party:message` (client to server); `party:state`, `party:history`, `party:message`, `party:error` (server to client).

## Why WatchWise

<div align="center">

**Built for people who finish a great film and immediately want the next one.**

</div>

WatchWise is more than a catalog. It learns what you enjoy, explains its picks, and turns watching into something social &mdash; whether that's a quiet evening with a tailored recommendation or a live room with friends debating the ending.

- Personalized by design: likes and watchlist drive every AI suggestion.
- Honest by default: community scores sit side by side with critic scores.
- Social by nature: real-time rooms keep the conversation going after the credits roll.

## Notes

- Watch party rooms are intentionally in-memory: they are ephemeral chat spaces, not persisted conversations. Restarting the backend clears them.
- The Gemini integration uses structured JSON output and a model fallback chain (`gemini-3.5-flash`, `gemini-flash-latest`, `gemini-2.5-flash`), and the recommendations endpoint is authenticated to prevent anonymous use of the API key.
- Change `JWT_SECRET` to a long random value before deploying, and set `NODE_ENV=production` so cookies are sent with the Secure flag.
