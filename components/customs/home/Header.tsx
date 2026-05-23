"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";

/* ─── Types ──────────────────────────────────────────────── */
type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ─── SVG Icon helpers ────────────────────────────────────── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─── Main Component ──────────────────────────────────────── */
const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.authSlice);
  const cartCount: number = 0; // replace with real cart count from store if available

  /* scroll-aware shrink */
  const [scrolled, setScrolled] = useState(false);
  /* mobile drawer */
  const [mobileOpen, setMobileOpen] = useState(false);
  /* search overlay */
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close mobile on route change ── */
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* ── focus search input when overlay opens ── */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [searchOpen]);

  /* ── close mobile drawer on Escape ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── lock body scroll when drawer open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?name=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery, router]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ══════════════════════ STYLES ══════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ── Floating glass pill ── */
        .hdr-root {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 12px 20px;
          transition: padding 350ms cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
        }
        .hdr-root.scrolled {
          padding: 8px 16px;
        }

        .hdr-pill {
          pointer-events: all;
          width: 100%;
          max-width: 1320px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 28px;
          border-radius: 20px;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow:
            0 4px 24px rgba(28,25,23,0.08),
            0 1px 0 rgba(255,255,255,0.9) inset;
          transition:
            height 350ms cubic-bezier(0.4,0,0.2,1),
            box-shadow 350ms cubic-bezier(0.4,0,0.2,1),
            background 350ms cubic-bezier(0.4,0,0.2,1),
            border-radius 350ms cubic-bezier(0.4,0,0.2,1);
        }
        .hdr-root.scrolled .hdr-pill {
          height: 56px;
          border-radius: 16px;
          background: rgba(255,255,255,0.92);
          box-shadow:
            0 8px 32px rgba(28,25,23,0.12),
            0 1px 0 rgba(255,255,255,0.9) inset;
        }

        /* iridescent top-line accent */
        .hdr-pill::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(202,138,4,0.6) 30%,
            rgba(255,255,255,0.9) 50%,
            rgba(202,138,4,0.6) 70%,
            transparent 100%
          );
          border-radius: 50%;
          pointer-events: none;
        }

        /* ── Logo ── */
        .hdr-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .hdr-logo-img {
          position: relative;
          width: 38px; height: 38px;
          flex-shrink: 0;
          transition: transform 600ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .hdr-logo:hover .hdr-logo-img {
          transform: rotate(360deg);
        }
        .hdr-logo-text {
          font-size: 22px;
          font-weight: 800;
          font-style: italic;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #1C1917 0%, #78350f 60%, #CA8A04 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        /* ── Nav ── */
        .hdr-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hdr-nav-link {
          position: relative;
          padding: 6px 14px;
          font-size: 15px;
          font-weight: 600;
          color: #44403C;
          text-decoration: none;
          border-radius: 10px;
          transition: color 200ms, background 200ms;
          cursor: pointer;
          white-space: nowrap;
        }
        .hdr-nav-link:hover {
          color: #1C1917;
          background: rgba(202,138,4,0.08);
        }
        .hdr-nav-link.active {
          color: #1C1917;
        }
        /* sliding gold underline */
        .hdr-nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 14px; right: 14px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #b45309, #CA8A04);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 250ms cubic-bezier(0.4,0,0.2,1);
        }
        .hdr-nav-link.active::after,
        .hdr-nav-link:hover::after {
          transform: scaleX(1);
        }

        /* ── Icon buttons ── */
        .hdr-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: #44403C;
          cursor: pointer;
          transition: background 200ms, color 200ms, transform 150ms;
          position: relative;
          flex-shrink: 0;
        }
        .hdr-icon-btn:hover {
          background: rgba(202,138,4,0.1);
          color: #1C1917;
          transform: translateY(-1px);
        }
        .hdr-icon-btn:active { transform: translateY(0); }
        .hdr-icon-btn:focus-visible {
          outline: 2px solid #CA8A04;
          outline-offset: 2px;
        }

        /* cart badge */
        .hdr-badge {
          position: absolute;
          top: -3px; right: -3px;
          min-width: 18px; height: 18px;
          padding: 0 4px;
          border-radius: 9px;
          background: linear-gradient(135deg, #b45309, #CA8A04);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255,255,255,0.9);
          line-height: 1;
        }

        /* ── Primary CTA (cart) ── */
        .hdr-cart-btn {
          background: linear-gradient(135deg, #1C1917 0%, #44403C 100%);
          color: #fff;
          box-shadow: 0 2px 12px rgba(28,25,23,0.25);
        }
        .hdr-cart-btn:hover {
          background: linear-gradient(135deg, #b45309 0%, #CA8A04 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(180,83,9,0.35);
        }

        /* ── User avatar ── */
        .hdr-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(202,138,4,0.5);
          overflow: hidden;
          background: linear-gradient(135deg, #b45309, #CA8A04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
          cursor: pointer;
          transition: border-color 200ms, transform 150ms;
        }
        .hdr-avatar:hover {
          border-color: #CA8A04;
          transform: translateY(-1px);
        }

        /* ── Divider ── */
        .hdr-divider {
          width: 1px;
          height: 24px;
          background: rgba(68,64,60,0.15);
          flex-shrink: 0;
        }

        /* ── SEARCH OVERLAY ── */
        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          background: rgba(28,25,23,0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
          animation: overlayIn 200ms ease forwards;
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .search-box {
          width: 100%;
          max-width: 600px;
          margin: 0 16px;
          background: rgba(255,255,255,0.96);
          border-radius: 20px;
          padding: 6px 6px 6px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 20px 60px rgba(28,25,23,0.25);
          border: 1px solid rgba(202,138,4,0.25);
          animation: searchBoxIn 250ms cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes searchBoxIn {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 18px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          color: #1C1917;
        }
        .search-input::placeholder { color: rgba(68,64,60,0.4); }
        .search-submit {
          height: 44px;
          padding: 0 20px;
          background: linear-gradient(135deg, #b45309, #CA8A04);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: filter 200ms, transform 150ms;
          white-space: nowrap;
        }
        .search-submit:hover { filter: brightness(1.08); transform: translateY(-1px); }

        /* ── MOBILE DRAWER ── */
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1050;
          background: rgba(28,25,23,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: fadeIn 200ms ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .mobile-drawer {
          position: fixed;
          top: 0; right: 0;
          height: 100%;
          width: min(320px, 85vw);
          z-index: 1060;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid rgba(202,138,4,0.15);
          box-shadow: -8px 0 40px rgba(28,25,23,0.15);
          display: flex;
          flex-direction: column;
          padding: 0 0 32px;
          animation: drawerIn 300ms cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes drawerIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(68,64,60,0.08);
        }
        .drawer-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 12px 12px;
          gap: 4px;
          overflow-y: auto;
        }
        .drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #44403C;
          text-decoration: none;
          transition: background 200ms, color 200ms;
          cursor: pointer;
        }
        .drawer-link:hover, .drawer-link.active {
          background: rgba(202,138,4,0.09);
          color: #1C1917;
        }
        .drawer-link.active {
          background: rgba(202,138,4,0.12);
          color: #b45309;
        }
        .drawer-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b45309, #CA8A04);
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 200ms;
        }
        .drawer-link.active .drawer-dot { opacity: 1; }
        .drawer-footer {
          padding: 16px 20px 0;
          border-top: 1px solid rgba(68,64,60,0.08);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .drawer-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          transition: filter 200ms, transform 150ms;
          cursor: pointer;
          border: none;
        }
        .drawer-cta:hover { transform: translateY(-1px); filter: brightness(1.06); }
        .drawer-cta.primary {
          background: linear-gradient(135deg, #1C1917, #44403C);
          color: #fff;
        }
        .drawer-cta.ghost {
          background: rgba(202,138,4,0.1);
          color: #b45309;
        }

        /* ── responsive ── */
        @media (max-width: 767px) {
          .hdr-pill { padding: 0 16px; }
          .hdr-logo-text { font-size: 20px; }
        }
        @media (max-width: 480px) {
          .hdr-root { padding: 10px 10px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hdr-logo:hover .hdr-logo-img { transform: none; }
          .hdr-nav-link::after { transition: none; }
          .hdr-icon-btn { transition: none; }
          .search-overlay, .search-box, .mobile-backdrop, .mobile-drawer { animation: none; }
        }
      `}</style>

      {/* ══════════════════════ HEADER ══════════════════════ */}
      <header
        className={`hdr-root${scrolled ? " scrolled" : ""}`}
        role="banner"
      >
        <div className="hdr-pill" style={{ position: "relative" }}>

          {/* ── Logo ── */}
          <Link href="/" className="hdr-logo" aria-label="Furniro — Home">
            <div className="hdr-logo-img">
              <Image
                src="/images/logo.png"
                alt="Furniro logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hdr-logo-text">Furniro</span>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hdr-nav hidden md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`hdr-nav-link${isActive(href) ? " active" : ""}`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Search */}
            <button
              id="hdr-btn-search"
              className="hdr-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <SearchIcon />
            </button>

            {/* Wishlist */}
            <button
              id="hdr-btn-wishlist"
              className="hdr-icon-btn hidden sm:flex"
              aria-label="Wishlist"
            >
              <HeartIcon />
            </button>

            <div className="hdr-divider hidden sm:block" aria-hidden="true" />

            {/* User / Login */}
            {auth.isLoggedIn ? (
              <Link href="/user" aria-label={`Account — ${auth.UserName}`}>
                <div className="hdr-avatar" title={auth.UserName}>
                  {auth.AvatarURL ? (
                    <Image
                      src={auth.AvatarURL}
                      alt={auth.UserName}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    (auth.FirstName?.[0] ?? auth.UserName?.[0] ?? "U").toUpperCase()
                  )}
                </div>
              </Link>
            ) : (
              <Link
                href="/user/login"
                id="hdr-btn-login"
                className="hdr-icon-btn hidden sm:flex"
                aria-label="Sign in"
                style={{ textDecoration: "none" }}
              >
                <UserIcon />
              </Link>
            )}

            {/* Cart */}
            <button
              id="hdr-btn-cart"
              className="hdr-icon-btn hdr-cart-btn"
              aria-label={`Shopping cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="hdr-badge" aria-hidden="true">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              id="hdr-btn-menu"
              className="hdr-icon-btn md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════ SEARCH OVERLAY ══════════════════════ */}
      {searchOpen && (
        <div
          className="search-overlay"
          role="dialog"
          aria-label="Search"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <form className="search-box" onSubmit={handleSearch}>
            <span style={{ color: "#CA8A04", flexShrink: 0 }}>
              <SearchIcon />
            </span>
            <input
              ref={searchInputRef}
              className="search-input"
              type="search"
              placeholder="Search furniture, rooms, styles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search query"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(68,64,60,0.5)", padding: "8px", borderRadius: "8px",
                display: "flex", alignItems: "center", flexShrink: 0,
                transition: "color 200ms"
              }}
              aria-label="Close search"
              onMouseEnter={e => (e.currentTarget.style.color = "#1C1917")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(68,64,60,0.5)")}
            >
              <XIcon />
            </button>
            <button type="submit" className="search-submit" disabled={!searchQuery.trim()}>
              Search
            </button>
          </form>
        </div>
      )}

      {/* ══════════════════════ MOBILE DRAWER ══════════════════════ */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="mobile-backdrop"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <nav
            className="mobile-drawer"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
          >
            {/* Drawer header */}
            <div className="drawer-header">
              <Link href="/" className="hdr-logo" onClick={() => setMobileOpen(false)}>
                <div className="hdr-logo-img" style={{ width: 32, height: 32 }}>
                  <Image src="/images/logo.png" alt="Furniro" fill className="object-contain" />
                </div>
                <span className="hdr-logo-text" style={{ fontSize: "18px" }}>Furniro</span>
              </Link>
              <button
                className="hdr-icon-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Nav links */}
            <div className="drawer-nav">
              {NAV_ITEMS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`drawer-link${isActive(href) ? " active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  <span className="drawer-dot" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Drawer footer */}
            <div className="drawer-footer">
              {auth.isLoggedIn ? (
                <Link
                  href="/user"
                  className="drawer-cta ghost"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserIcon />
                  My Account
                </Link>
              ) : (
                <Link
                  href="/user/login"
                  className="drawer-cta ghost"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserIcon />
                  Sign In
                </Link>
              )}
              <button className="drawer-cta primary">
                <CartIcon />
                View Cart
                {cartCount > 0 && (
                  <span className="hdr-badge" style={{ position: "static", border: "none" }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Header;
