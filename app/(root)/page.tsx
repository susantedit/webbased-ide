import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Terminal,
  Sparkles,
  Zap,
  Globe,
  Layers,
  ShieldCheck,
  Github,
  Heart,
  Code2,
} from "lucide-react";

const SOCIALS = [
  {
    name: "GitHub",
    href: "https://github.com/susantedit",
    badge: "https://img.shields.io/badge/GitHub-181717.svg?logo=github&logoColor=white",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/kantaraj-luitel",
    badge: "https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white",
  },
  {
    name: "X",
    href: "https://x.com/Susantedit",
    badge: "https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/susantgamerz",
    badge: "https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/Kantaraj.Luitel",
    badge: "https://img.shields.io/badge/Facebook-%231877F2.svg?logo=Facebook&logoColor=white",
  },
  {
    name: "Reddit",
    href: "https://reddit.com/user/Successful-Twist2608",
    badge: "https://img.shields.io/badge/Reddit-%23FF4500.svg?logo=Reddit&logoColor=white",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@vortexeditz34",
    badge: "https://img.shields.io/badge/TikTok-%23000000.svg?logo=TikTok&logoColor=white",
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/susantluitel",
    badge: "https://img.shields.io/badge/Pinterest-%23E60023.svg?logo=Pinterest&logoColor=white",
  },
  {
    name: "Codepen",
    href: "https://codepen.io/susant-gamerz",
    badge: "https://img.shields.io/badge/Codepen-000000?logo=codepen&logoColor=white",
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/9779708838261",
    badge: "https://img.shields.io/badge/WhatsApp-25D366?logo=whatsapp&logoColor=white",
  },
  {
    name: "Email",
    href: "mailto:susantedit@gmail.com",
    badge: "https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white",
  },
];

const FEATURES = [
  {
    icon: Terminal,
    title: "WebContainers In-Browser Runtime",
    description:
      "Run real Node.js processes, install npm packages, and execute dev servers without any cloud VM lag.",
  },
  {
    icon: Sparkles,
    title: "BYOK Multi-Provider AI",
    description:
      "Use your own API keys for Groq, Google Gemini, OpenAI, Claude, xAI Grok, or run local models offline with Ollama.",
  },
  {
    icon: Layers,
    title: "One-Click Full-Stack Starters",
    description:
      "Spin up instant workspaces with React, Next.js, Express, Vue, Hono, and Angular with ready-to-run file trees.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Persistent Workspaces",
    description:
      "Your code and file explorer structure are saved directly to your account in MongoDB whenever you work.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-8 pb-16 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto mt-4 space-y-6">
        {/* Brand Logo & Pill */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative p-2 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Image
              src="/logo.png"
              alt="VibeForge Logo"
              height={84}
              width={84}
              className="object-contain"
              priority
            />
          </div>

          <Badge
            variant="outline"
            className="text-xs px-3 py-1 bg-zinc-100/80 dark:bg-zinc-900/80 border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            ⚡ Next-Gen Browser IDE
          </Badge>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            VibeForge
          </h1>
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-700 dark:text-zinc-300">
            Build. Run. Ship. Right in your browser.
          </p>
        </div>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          A lightning-fast, full-stack cloud IDE powered by WebContainers. Write code, launch dev servers, preview applications in real time, and build faster with Bring-Your-Own-Key AI assistants.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/dashboard">
            <Button size="lg" className="h-11 px-6 font-semibold gap-2 bg-indigo-600 hover:bg-indigo-500 text-white">
              Launch Workspace
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>

          <a
            href="https://github.com/susantedit/webbased-ide"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="h-11 px-6 gap-2 border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Github className="w-4 h-4" />
              GitHub Repository
            </Button>
          </a>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-5xl w-full mx-auto mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Everything you need to code at the speed of thought
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Zero installation. Zero setup. Instant full-stack power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 space-y-3 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {feat.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About the Developer Section */}
      <section className="max-w-4xl w-full mx-auto mt-24 p-8 rounded-3xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 text-center space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
            👨‍💻 Creator & Maintainer
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            About the Developer
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
            Created with passion by <span className="font-semibold text-zinc-900 dark:text-zinc-100">Kantaraj Luitel (Susant)</span>. VibeForge is designed to give developers frictionless, browser-first coding with open-source tools and modular AI.
          </p>
        </div>

        {/* Socials Grid / Shields */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Connect & Socials
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2.5 max-w-2xl mx-auto">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 inline-flex"
                title={s.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.badge} alt={s.name} className="h-6 rounded shadow-xs" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
