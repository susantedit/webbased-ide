import Link from "next/link";
import Image from "next/image";

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

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col items-center space-y-6 text-center">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center space-y-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="VibeForge Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
              VibeForge
            </span>
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Build. Run. Ship. Right in your browser.
          </p>
        </div>

        {/* Social Shields */}
        <div className="flex flex-wrap justify-center items-center gap-2 max-w-3xl">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-105 inline-flex"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.badge} alt={s.name} className="h-5 rounded" />
            </a>
          ))}
        </div>

        {/* Copyright & Attribution */}
        <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          <p>
            &copy; {new Date().getFullYear()} VibeForge. Built by{" "}
            <a
              href="https://github.com/susantedit"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-700 dark:text-zinc-200 hover:underline"
            >
              Kantaraj Luitel (Susant)
            </a>
            .
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Open-source browser IDE powered by WebContainers & AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
