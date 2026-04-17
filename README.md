# ResumeForge 📄

A production-ready resume builder built with React + Vite. Create, edit, and export professional resumes with multiple templates and format support.

## ✨ Features

- **Authentication** – Sign up / log in (stored locally in browser)
- **4 Professional Templates** – Modern, Classic, Minimal, Creative
- **Full Resume Editor** – Personal info, experience, education, skills, projects, certifications
- **Live Preview** – See your resume update in real-time
- **Multi-format Download** – PDF, DOCX, TXT, JSON
- **Privacy First** – All data stored in `localStorage`, zero servers
- **Responsive** – Works on desktop & mobile

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The `dist/` folder is ready to deploy.

---

## 🌐 Deploy for Free

### Option 1: Netlify (Recommended – easiest)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Connect your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **Deploy** ✅

The `netlify.toml` and `public/_redirects` files are already configured.

### Option 2: Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Vercel auto-detects Vite — just click **Deploy** ✅

The `vercel.json` is already configured for SPA routing.

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Add to vite.config.js:
# base: '/your-repo-name/'

npm run build && npm run deploy
```

---

## 📁 Project Structure

```
src/
├── context/
│   ├── AuthContext.jsx       # User auth (localStorage)
│   └── ResumeContext.jsx     # Resume state management
├── pages/
│   ├── Landing.jsx           # Home / marketing page
│   ├── Login.jsx             # Login form
│   ├── Signup.jsx            # Signup form
│   ├── Dashboard.jsx         # Resume list + CRUD
│   ├── Templates.jsx         # Template gallery
│   └── Editor.jsx            # Split editor + live preview
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── DownloadModal.jsx
│   └── editor/
│       └── Sections.jsx      # Personal, Exp, Edu, Skills, Projects, Certs
├── templates/
│   ├── ModernTemplate.jsx
│   ├── ClassicTemplate.jsx
│   ├── MinimalTemplate.jsx
│   ├── CreativeTemplate.jsx
│   └── index.js
└── utils/
    └── downloads.js          # PDF, DOCX, TXT, JSON export logic
```

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| PDF Export | jsPDF + html2canvas |
| DOCX Export | docx.js |
| File Save | file-saver |
| Icons | lucide-react |
| Fonts | Google Fonts (Playfair Display + DM Sans) |

## 📝 Notes

- Data persists in `localStorage` per user account
- No backend required — fully static deployment
- ATS-friendly templates using semantic HTML
- PDF export captures the live preview as an image
- DOCX export generates a properly formatted Word document
