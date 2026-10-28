# 📚 BookNook - Full-Stack E-Commerce Bookstore & Literary Platform

> **FSJP Assignment 1 — Task 2**  
> A feature-packed, interactive online bookstore platform built with HTML5, CSS3, modern Vanilla JavaScript, Node.js/Express backend APIs, and an integrated AI literary assistant powered by Google Gemini.

---

## 🌟 Overview

**BookNook** is a responsive e-commerce web application designed for readers, collectors, and independent book publishers. The application blends a bookstore user interface with interactive e-commerce capabilities, state management via LocalStorage, dynamic PDF invoice generation, and an intelligent literary recommendation assistant powered by the Google Generative AI (Gemini) SDK.

---

## 🚀 Key Features

### 1. 📖 Dynamic Catalog & Genre Browsing
- **Extensive Collections**: Categorized books across genres including Fiction, Science Fiction, Classic Novels, Manga, American & Indian Comics, Thrillers, and Self-Help.
- **Curated Sections**: Dedicated pages for *Today's Deals*, *Top Rated Books*, *Stationary & Gifts*, and *Kids Corner*.
- **Interactive Search & Filter**: Real-time filtering and category exploration with interactive dropdown navigation.

### 2. 🛒 Shopping Cart & Coupon Engine
- **Dynamic Cart Management**: Real-time item quantity adjustment, item removal, and auto-updating subtotal calculations.
- **Interactive Coupon Discounts**: Dynamic coupon code validation with real-time feedback and percentage discounts.
- **Persistence**: Cart items saved in browser `localStorage` across page reloads.

### 3. 💳 Checkout & Instant PDF Invoicing
- **Responsive Checkout Page**: Complete shipping, billing, and payment method selection forms.
- **Client-Side PDF Generation**: Integrated `jsPDF` library generates professional, downloadable tax invoices with unique order IDs, itemized breakdowns, and timestamps.

### 4. ❤️ Interactive Wishlist
- **Persistent Bookmark System**: Save favorite books with one-click heart buttons.
- **Micro-Animations**: Smooth keyframe transitions (`heartBeat`, `cartAdd`, `slideInHeader`).
- **Direct Move-to-Cart**: Seamless transfer of saved wishlist items directly into the active cart.

### 5. ✍️ Author / Vendor Self-Publishing Portal
- **Book Publishing Form**: Independent authors can publish new titles directly to the catalog.
- **Drag-and-Drop Cover Upload**: Interactive image upload with instant client-side `FileReader` data-URL previews.
- **Backend Sync**: REST API endpoint (`/api/books`) stores published books into `books.json`.

### 6. 🤖 AI-Powered Literary Assistant (Gemini Chatbot)
- **Natural Language Interaction**: AI chatbot powered by Google Gemini 1.5 Flash (`@google/generative-ai`).
- **Context-Aware Recommendations**: Recommends books based on user mood, plot tropes, themes, or author preferences.
- **Dedicated Backend Service**: Express server running on port 3001 with CORS support.

### 7. 📱 Mobile Responsiveness & Modern UI
- **Responsive Grid & Flexbox**: Fully responsive across mobile (<480px), tablet (<768px), and desktop viewports.
- **Design Language**: Custom typography, glassmorphism accents, hover micro-interactions, and accessible forms.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+), FontAwesome Icons, Swiper.js, jsPDF |
| **Backend** | Node.js, Express.js (v5), CORS, Dotenv |
| **AI Integration** | Google Generative AI SDK (`@google/generative-ai` - Gemini 1.5 Flash) |
| **Data Persistence** | `localStorage` (client state) & `books.json` (server catalog) |
| **Tooling & Dev** | Nodemon, Concurrently |

---

## 📁 Project Directory Structure

```text
booke_commerce final/
│
├── html/                         # Frontend Web Pages
│   ├── index.html                # Main Home & Landing Page
│   ├── cart.html                 # Shopping Cart & Coupon Page
│   ├── checkout.html             # Multi-step Checkout & Order Summary
│   ├── wishlist.html             # Saved Books & Wishlist
│   ├── deals.html                # Special Offers & Discount Deals
│   ├── publish.html              # Author / Vendor Publishing Portal
│   ├── chatbot-combined.html     # AI Chatbot Assistant Interface
│   ├── account.html              # User Authentication (Login/Register)
│   ├── aboutus.html              # About BookNook Platform
│   └── invoice.html              # Invoice Preview Page
│
├── css/                          # Stylesheets
│   ├── style.css                 # Master Site Styles & Media Queries
│   ├── cart.css                  # Cart Styles & Responsive Breakpoints
│   ├── deals.css                 # Deals Page Styles
│   ├── stationary.css            # Stationary Catalog Styles
│   └── top.css                   # Top Books & Ranking Styles
│
├── Genres/                       # Genre-Specific Landing Pages (20+ categories)
│   ├── fiction.html
│   ├── Science Fiction.html
│   ├── Manga.html
│   └── ...
│
├── server.js                     # Express REST API (Port 5000) for Book Catalog
├── chatbotserver.js              # Gemini AI Chatbot Server (Port 3001)
├── publish.js                    # Publishing UI & LocalStorage Handler
├── wishlist.js                   # Wishlist Logic & LocalStorage Sync
├── books.json                    # Backend Book Database
├── package.json                  # Project Dependencies & Run Scripts
├── .env.example                  # Environment Configuration Template
├── .gitignore                    # Git Exclusion Rules
└── README.md                     # Project Documentation
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/) for the AI assistant

### 1. Clone the Repository
```bash
git clone https://github.com/mayu10-cyber/Book-Ecommerce-Website.git
cd Book-Ecommerce-Website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

### 4. Run the Backend & Chatbot Servers
To run both the Book API Server and the Gemini Chatbot Server simultaneously:
```bash
npm run start-all
```
- **Book API Server**: Runs on `http://localhost:5000`
- **Chatbot Server**: Runs on `http://localhost:3001`

### 5. Launch the Frontend
Open `http://localhost:5000` directly in your browser or use VS Code **Live Server**:
```text
http://localhost:5000
```

---

## 🔌 API Endpoints

### Book Management (`server.js` — Port 5000)
- `GET /api/books`: Returns list of all published books.
- `POST /api/books`: Publishes a new book entry into `books.json`.

### AI Literary Assistant (`chatbotserver.js` — Port 3001)
- `POST /chatbot`: Accepts `{ "message": "query" }` and returns AI literary recommendations powered by Gemini.

---

## 📋 FSJP Assignment 1 Submission Checklist

- [x] **Source Code**: Clean, well-structured HTML, CSS, JavaScript, and Node.js files.
- [x] **Functional UI**: Catalog, Cart, Deals, Wishlist, Checkout, and Invoicing.
- [x] **Interactive States**: Hover effects, coupon redemption, modal alerts, dynamic DOM updates.
- [x] **Mobile Responsiveness**: Viewport configurations and media queries for mobile/tablet screens.
- [x] **Backend & AI Integration**: Express servers running REST endpoints and Google Gemini AI.
- [x] **Structured README**: Complete project guide and setup instructions.
