# 🎬 Movie Catalog App

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white) ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

This is a full-stack **React + Supabase** web app for managing a personal movie catalog and watchlist. Users can browse movies by genre, view detailed info and trailers, manage a watchlists, and handle user accounts with integrated login and admin tools.

---

## Screenshots

---

https://lv3-capstone.vercel.app

---

## Home Page Movie View Manage Users

![Home                                                      ![Movie                                                      ![Manage
Page](https://via.placeholder.com/300x180?text=Home+Page)   View](https://via.placeholder.com/300x180?text=Movie+View)   Users](https://via.placeholder.com/300x180?text=Manage+Users)

---

## 🧩 Tech Stack

- ⚛️ **React (Vite)** -- fast front-end framework
- 🧠 **React Router** -- page routing and navigation
- 🧾 **Supabase** -- backend-as-a-service for database and auth
- 🎨 **Bootstrap 5** -- UI layout and components
- 🎥 **YouTube Embed API** -- responsive trailers
- 🗃️ **PostgreSQL** -- data persistence and relations

---

## 🚀 Features

### 🎞 Movie Library

- Displays all movies in a responsive grid by genre.
- Each movie has a detailed view page with poster, trailer,
  description, and cast info.
- Layout automatically adapts between desktop and mobile.

### 👤 User Authentication

- Custom login/logout system using Supabase or localStorage.
- Authenticated sessions persist across refreshes.
- Displays logged-in user in Navbar.

### 🎬 Watchlist Management

- Personalized watchlist for each user.
- Add/remove movies directly from the movie detail page.
- Highlights movies already on the user's watchlist.

### 🧰 Admin Features

- Manage users: add, edit, delete, and activate/deactivate accounts.
- Confirmation modals for sensitive actions.
- Filter and refresh functionality for user list.

### 🖥️ Responsive Layout

- Poster resizes dynamically with the viewport.
- Trailer uses a responsive YouTube embed.
- Stacks poster → trailer → description → details on small screens.

---

## 🧱 Database Schema

### **users**

Column Type Description

---

id integer (PK) Auto-increment ID
username text Unique username
password text Password (demo only)
first_name text User's first name
last_name text User's last name
email text Email address
is_active boolean Indicates active status
admin boolean Marks admin users (optional)

### **movies**

Column Type Description

---

imdb_id text (PK) IMDb identifier
title text Movie title
year integer Release year
poster text Poster image URL
genres text Comma-separated genre list
runtime text Runtime (e.g. 2h 58m)
rating text Rating (e.g. PG-13)
description text Movie synopsis
yt_trailer_id text YouTube trailer ID
budget numeric Production budget
worldwide_gross numeric Total revenue

### **watchlist**

Column Type Description

---

user_id integer Foreign key → users.id
imdb_id text Foreign key → movies.imdb_id

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/movie-catalog-app.git
cd movie-catalog-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4️⃣ Run locally

```bash
npm run dev
```

Visit **http://localhost:5173**

---

## 📂 Folder Structure

    src/
    ├── components/
    │   ├── auth/
    │   │   ├── LoginPage.jsx
    │   │   ├── ManageUsers.jsx
    │   │   ├── AddUser.jsx
    │   │   ├── EditUser.jsx
    │   │   └── NoticeModal.jsx
    │   ├── media/
    │   │   ├── HomePage.jsx
    │   │   ├── MovieView.jsx
    │   │   ├── MovieClip.jsx
    │   │   └── ViewWatchlist.jsx
    │   └── Navbar.jsx
    ├── context/
    │   └── AuthContext.jsx
    ├── utils/
    │   └── supabase.js
    ├── data/
    │   └── enriched-collection.json
    └── App.jsx

---

## 🧩 Key Components

### 🔐 AuthContext.jsx

Provides app-wide authentication context. Manages login, logout, and
session state with localStorage and Supabase.

### 🧾 ManageUsers.jsx

Displays and manages user records from Supabase. Includes refresh, edit,
delete, and confirmation modals.

### 🎬 MovieView.jsx

Responsive movie detail page with poster, trailer, description, and
metadata.

### 🎥 MovieClip.jsx

Responsive YouTube trailer embed using `react-youtube` and CSS aspect
ratio for scaling.

### 💾 supabase.js

Configures Supabase client connection using your environment variables.

---

## 💡 Stretch Goals

- 🔐 Migrate to full Supabase Auth
- ⭐ Add movie ratings and comments
- 📈 Show watchlist and genre stats per user
- 🧩 Public vs. private watchlists
- 🎭 Hover effects for poster overlays
- 🧠 Recommendation engine by genre
- 📱 PWA support for offline browsing

---

## 👨‍💻 Author

**Clay Aucoin**\
Developer • Systems Enthusiast • Movie Data Wrangler\
Built with ❤️ using React, Supabase, and Bootstrap.

---

## 📜 License

Distributed under the [MIT License](LICENSE).
