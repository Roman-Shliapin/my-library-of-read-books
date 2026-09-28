"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./BottomNav.module.css";

const items = [
  {
    href: "/",
    label: "Головна",
    match: (p: string) => p === "/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/library",
    label: "Книги",
    match: (p: string) => p.startsWith("/library") && !p.endsWith("/new"),
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 4h9a2 2 0 0 1 2 2v14l-4.5-2.5L7 20V6a2 2 0 0 0-2-2Z" strokeLinejoin="round" />
        <path d="M16 6h3a2 2 0 0 1 2 2v12l-3-1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/quotes",
    label: "Цитати",
    match: (p: string) => p === "/quotes" || (p.startsWith("/quotes") && !p.endsWith("/new")),
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 8h5v5H9.5A2.5 2.5 0 0 1 7 10.5V8Zm8 0h5v5h-3.5A2.5 2.5 0 0 1 15 10.5V8Z" strokeLinejoin="round" />
        <path d="M8 13c0 4 2.5 6 4 7M16 13c0 4 2.5 6 4 7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/library/new",
    label: "Додати",
    match: (p: string) => p.endsWith("/new"),
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={css.nav} aria-label="Нижня навігація">
      <div className={css.inner}>
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${css.item} ${active ? css.active : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className={css.icon}>{item.icon}</span>
              <span className={css.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}