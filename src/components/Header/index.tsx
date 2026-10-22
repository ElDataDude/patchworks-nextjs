"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import BookingWidget from "../Common/BookingWidget";
import BrandLogo from "../Common/BrandLogo";
import { useSessionApps } from "../Catalogue/SessionAppsProvider";
import { primaryNavigation, type NavItem } from "@/data/navigation";
import { SITE_URL } from "@/data/seo";
import { signInUrl, YOUR_APPS_URL } from "@/lib/identity";

const HOVER_QUERY = "(hover: hover) and (min-width: 768px)";
/** Grace period before a hover-opened panel closes, cancelled on re-entry. */
const HOVER_CLOSE_DELAY_MS = 200;

function groupId(panelId: string, title: string) {
  return `${panelId}-${title.toLowerCase().replace(/\s+/g, "-")}`;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [returnTo, setReturnTo] = useState(`${SITE_URL}${pathname}`);
  const session = useSessionApps();
  const toggle = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const disclosure = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    // Close menus and refresh the sign-in return URL (which needs the browser
    // URL, query included) after each navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    setPanel(null);
    setReturnTo(window.location.href);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    navigation.current?.querySelector<HTMLAnchorElement>("a")?.focus();
  }, [open]);
  useEffect(() => {
    if (!open && !panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panel) {
        setPanel(null);
        disclosure.current?.focus();
      } else {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, panel]);
  const signedIn = session.status === "signed-in";
  const account = signedIn
    ? { href: YOUR_APPS_URL, label: "Your apps" }
    : { href: signInUrl(returnTo), label: "Sign in" };
  const closeAll = () => {
    setOpen(false);
    setPanel(null);
  };
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
          <ul className="nav-list">
            {primaryNavigation.map((item) =>
              item.panel ? (
                <PanelItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  expanded={panel === item.panel.id}
                  drawerOpen={open}
                  buttonRef={disclosure}
                  onToggle={(next) => setPanel(next ? item.panel!.id : null)}
                  onNavigate={closeAll}
                />
              ) : (
                <li key={item.href}>
                  <Link
                    className="nav-link"
                    data-nav-level="1"
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={closeAll}
                  >
                    {item.title}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <a
            className="nav-account"
            href={account.href}
            data-account={signedIn ? "apps" : "sign-in"}
          >
            {account.label}
          </a>
        </nav>
        <div className="header-partner-booking">
          <BookingWidget className="header-start header-booking" />
        </div>
        <div className="header-actions">
          <a
            className="header-account"
            href={account.href}
            data-account={signedIn ? "apps" : "sign-in"}
          >
            {account.label}
          </a>
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

/**
 * WAI-ARIA disclosure navigation: the section link navigates and the chevron
 * button shows or hides the panel. The panel is always in the server HTML and
 * inert while closed. Hover opens it only on devices that can hover; leaving
 * the item closes it after a short delay so the pointer can cross from the
 * trigger to the panel (an invisible bridge in CSS covers the gap as well).
 */
function PanelItem({
  item,
  pathname,
  expanded,
  drawerOpen,
  buttonRef,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  expanded: boolean;
  drawerOpen: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onToggle: (next: boolean) => void;
  onNavigate: () => void;
}) {
  const panel = item.panel!;
  const closeTimer = useRef<number | undefined>(undefined);
  const cancelClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = undefined;
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  const canHover = (event: PointerEvent<HTMLLIElement>) =>
    event.pointerType === "mouse" && window.matchMedia(HOVER_QUERY).matches;
  const onPointerEnter = (event: PointerEvent<HTMLLIElement>) => {
    if (!canHover(event)) return;
    cancelClose();
    onToggle(true);
  };
  const onPointerLeave = (event: PointerEvent<HTMLLIElement>) => {
    if (!canHover(event)) return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = undefined;
      onToggle(false);
    }, HOVER_CLOSE_DELAY_MS);
  };
  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (drawerOpen) return;
    const next = event.relatedTarget as Node | null;
    if (!next || !event.currentTarget.contains(next)) onToggle(false);
  };
  const inSection =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  return (
    <li
      className="nav-item-panel"
      data-open={expanded}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onBlur}
    >
      <div className="nav-item-row">
        <Link
          className="nav-link"
          data-nav-level="1"
          data-section-current={inSection ? "true" : undefined}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          onClick={onNavigate}
        >
          {item.title}
        </Link>
        <button
          ref={buttonRef}
          type="button"
          className="nav-disclosure"
          aria-expanded={expanded}
          aria-controls={panel.id}
          aria-label={panel.label}
          onClick={() => {
            cancelClose();
            onToggle(!expanded);
          }}
        >
          <ChevronDown aria-hidden="true" strokeWidth={1.5} />
        </button>
      </div>
      <div
        id={panel.id}
        className="nav-panel"
        data-open={expanded}
        inert={!expanded}
      >
        <div className="site-container nav-panel-inner">
          {panel.groups.map((group) => (
            <div className="nav-panel-group" key={group.title}>
              <p
                className="nav-panel-heading"
                id={groupId(panel.id, group.title)}
              >
                {group.title}
              </p>
              <ul aria-labelledby={groupId(panel.id, group.title)}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-nav-level="2"
                      aria-current={pathname === link.href ? "page" : undefined}
                      onClick={onNavigate}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="nav-panel-overview">
            {panel.overviewLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-link text-link--quiet"
                data-nav-level="2"
                onClick={onNavigate}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}
