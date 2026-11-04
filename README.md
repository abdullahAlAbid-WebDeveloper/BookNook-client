# 📚 BookNook — Library Management System (Client)

🔗 **Live Site:** https://booknook-frontend-phi.vercel.app

A library web application built with **Next.js (App Router)**, **Tailwind CSS v4**, **shadcn-style UI components** and **Better Auth** for authentication. Books are stored in MongoDB and managed through a separate Express REST API server (see `assaignment-08 server`).

## ✨ Features

- 🔐 **User Authentication** — Secure register / login / logout powered by Better Auth (email & password with MongoDB adapter), plus JWT-protected API calls
- 📖 **Book Catalog & Details** — Browse all books, view a rich details page with cover, description, "Added by" info and a **live "Copies left" counter**
- ➕ **Add Books** — Add a new book with a −/+ copies stepper, image URL validation (error toast for invalid links) and empty-field protection
- 🛒 **Borrow & Return System** — Borrow a book (copies left −1), and 0 copies fully blocks borrowing with a "No Copies Available" toast; returning a book restores copies (+1)
- ✏️ **My Books & My Borrows** — Edit/delete only the books you added, and track + return everything you've borrowed
- 🌓 **Dark Mode & Modern UI** — Class-based dark mode, toasts for every action, responsive navbar with auth-aware links and a session-driven profile page

## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config, tokens in `globals.css`)
- [shadcn-style components](https://ui.shadcn.com) on `@base-ui/react`
- [Better Auth](https://better-auth.com) with `jwt` plugin + Mongo adapter
- [Swiper](https://swiperjs.com) hero slider, Swiper CSS imported in the client component

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file in the project root
NEXT_PUBLIC_BASE_URL=http://localhost:5000   # Express API server
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URL=your-mongodb-connection-string

# 3. Start the backend server first (../assaignment-08 server)
# 4. Start the client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build + TypeScript check |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## 🗂️ Project Structure

```
src/
├── app/                  # App Router pages
│   ├── page.tsx          # Home (HeroSlider, HowBorrowingWorks, NewArrivals, TopCategories)
│   ├── books/            # All Books catalog + book details /books/[id]
│   ├── add-book/         # Add Book (with copies stepper & URL validation)
│   ├── my-books/         # Your books — edit / delete
│   ├── my-borrows/       # Borrowed books — Return Book
│   ├── my-profile/       # Session-driven profile card
│   ├── login/ register/  # Auth pages
│   └── api/auth/[...all] # Better Auth route handler
├── components/
│   ├── ui/               # shadcn-style primitives (button, card, dialog, toast, ...)
│   ├── books/            # BorrowModal, AllBooks
│   ├── home/             # HeroSlider, sections
│   ├── Navbar.tsx, ThemeToggle.tsx, icons.tsx
├── lib/                  # auth.ts (server), auth-client.ts (client)
└── data/                 # Dummy data (books.ts)
```

## 📡 API

All data comes from the Express server (`NEXT_PUBLIC_BASE_URL`). Protected routes require:

```
Authorization: Bearer <JWT from GET /api/auth/token>
```

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/bookData` | Add a book |
| GET | `/bookData` | All books |
| GET | `/bookData/:id` | Single book |
| POST | `/bookData/borrow` | Borrow a book (copies −1) |
| DELETE | `/bookData/borrow/:id` | Return a book (copies +1) |
| GET | `/bookData/borrow/:email` | Your borrows |
| GET | `/myBooks/:email` | Books you created |
| PATCH | `/bookData/:id` | Update a book |
| DELETE | `/bookData/:id` | Delete a book |

## 🔑 How Auth → API works

1. Better Auth issues a session cookie on login.
2. The client fetches a JWT via `GET /api/auth/token` (`fetch("/api/auth/token")`).
3. That token is sent to the Express server in the `Authorization: Bearer` header.
4. The server verifies it against the app's JWKS endpoint (`/api/auth/jwks`).
