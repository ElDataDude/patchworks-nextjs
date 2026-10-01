"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import BookingWidget from "../Common/BookingWidget";
import BrandLogo from "../Common/BrandLogo";
import menuData from "./menuData";
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    navigation.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-container header-inner">
        <BrandLogo />
        <nav
          ref={navigation}
          id="main-navigation"
          className={`header-nav ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <ul>
            {menuData.map((item) => {
              const href = item.path || "/";
              return (
                <li key={item.id}>
                  <Link
                    className="nav-link"
                    href={href}
                    aria-current={pathname === href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="header-partner-booking">
          <BookingWidget className="header-start header-booking" />
        </div>
        <div className="header-actions">
          <span
            className="language-label"
            lang="en"
            aria-label="Current language: English"
          >
            EN
          </span>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X strokeWidth={1.5} /> : <MenuIcon strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </header>
  );
}
