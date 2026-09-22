# ⚡ VibeForge – Build. Run. Ship. Right in your browser

<p align="center">
  <img src="public/logo.png" alt="VibeForge Logo" width="120" />
</p>

<p align="center">  
  <strong>A blazing-fast, in-browser full-stack cloud IDE powered by Next.js 15, WebContainers, Monaco Editor, and Multi-Provider AI (Groq, Gemini, Grok, GPT, Claude, and Ollama).</strong>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsusantedit%2Fwebbased-ide">
    <img src="https://vercel.com/button" alt="Deploy with Vercel"/>
  </a>
</p>

---

## 🚀 Features

- ⚡ **In-Browser WebContainers** – Run real Node.js processes, npm scripts, and dev servers with instant previews.
- 🤖 **BYOK Multi-Model AI Assistant** – Bring your own key for **Groq**, **Google Gemini**, **xAI Grok**, **OpenAI GPT**, **Anthropic Claude**, or run local models with **Ollama**.
- 🧱 **Full-Stack Templates** – One-click starter environments for **React**, **Next.js**, **Express**, **Vue**, **Hono**, and **Angular**.
- 🗂️ **Live File Explorer & Persistence** – Create, rename, delete, and save files directly to MongoDB on `Ctrl + S`.
- 💻 **Interactive Terminal** – Full xterm.js shell integrated with WebContainers.
- 🔐 **OAuth Authentication** – Google and GitHub login via NextAuth.js.
- 🎨 **Modern Dark/Light Theme** – TailwindCSS and Radix UI design.

---

## 🌐 Deploy to Vercel (Recommended)

Vercel provides native Next.js 15 support and seamless handling of the required WebContainer headers (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`).

1. **Fork or Push** this repository to your GitHub account.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import your repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL` – Your MongoDB connection string (e.g. MongoDB Atlas).
   - `AUTH_SECRET` – A 32-character random string (`openssl rand -base64 32`).
   - `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET` – (Optional) Google OAuth credentials.
   - `AUTH_GITHUB_ID` & `AUTH_GITHUB_SECRET` – (Optional) GitHub OAuth credentials.
   - `NEXTAUTH_URL` – Your production URL (e.g. `https://your-app.vercel.app`).
4. Click **Deploy**. Vercel will run `prisma generate && next build` and launch your IDE.

> **Note on AI Keys**: You do **not** need to set any AI API keys on Vercel. VibeForge uses a client-side **Bring-Your-Own-Key (BYOK)** model. Visitors enter their own keys in the playground settings, which are stored securely in their own browser's `localStorage`.

---

## 🖥️ Deploy to Render

You can also deploy VibeForge as a **Web Service** on Render:

1. Create a new **Web Service** on [Render Dashboard](https://dashboard.render.com/).
2. Connect your GitHub repository: `https://github.com/susantedit/webbased-ide`.
3. Configure the service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Add the same Environment Variables (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, OAuth keys).
5. Click **Create Web Service**.

---

## 🛠️ Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/susantedit/webbased-ide.git
cd webbased-ide
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create `.env` using `.env.example`:

```bash
cp .env.example .env
```

Fill in:
```env
DATABASE_URL="your_mongodb_connection_string"
AUTH_SECRET="your_auth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 About the Developer & Socials

Created by **Kantaraj Luitel (Susant)**.

[![GitHub](https://img.shields.io/badge/GitHub-181717.svg?logo=github&logoColor=white)](https://github.com/susantedit)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/kantaraj-luitel)
[![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/Susantedit)
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/susantgamerz)
[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?logo=Facebook&logoColor=white)](https://facebook.com/Kantaraj.Luitel)
[![Reddit](https://img.shields.io/badge/Reddit-%23FF4500.svg?logo=Reddit&logoColor=white)](https://reddit.com/user/Successful-Twist2608)
[![TikTok](https://img.shields.io/badge/TikTok-%23000000.svg?logo=TikTok&logoColor=white)](https://tiktok.com/@vortexeditz34)
[![Pinterest](https://img.shields.io/badge/Pinterest-%23E60023.svg?logo=Pinterest&logoColor=white)](https://pinterest.com/susantluitel)
[![Codepen](https://img.shields.io/badge/Codepen-000000?logo=codepen&logoColor=white)](https://codepen.io/susant-gamerz)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?logo=whatsapp&logoColor=white)](https://wa.me/9779708838261)
[![Email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:susantedit@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
