"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import UserDropdown from "@/components/customs/common/UserLayout/UserDropdown";
import HeaderCartDrawer from "@/components/customs/common/UserLayout/HeaderCartDrawer";
import "../../../../app/Header.css";
/* ─── Types ──────────────────────────────────────────────── */
type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ─── SVG Icons ───────────────────────────────────────────── */
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16 }}
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ─── Main Component ──────────────────────────────────────── */
const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.authSlice);
  const cart = useSelector((state: RootState) => state.cartSlice);
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── Scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close on route change ── */
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* ── Focus search input when overlay opens ── */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [searchOpen]);

  /* ── Escape key ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Lock body scroll when drawer open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/product?name=${encodeURIComponent(searchQuery.trim())}`);
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery, router],
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ══════════════════════ HEADER ══════════════════════ */}
      <header
        className={`hdr-root${scrolled ? " scrolled" : ""}`}
        role="banner"
      >
        <div className="hdr-pill">
          {/* Logo */}
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

          {/* Desktop Nav */}
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

          {/* Actions */}
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

            {/* ── User section — delegated to UserDropdown ── */}
            {auth.isLoggedIn ? (
              <UserDropdown />
            ) : (
              <Link
                href="/auth/login"
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
              onClick={() => setCartDrawerOpen(true)}
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
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
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
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(68,64,60,0.5)",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                transition: "color 200ms",
              }}
              aria-label="Close search"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1917")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(68,64,60,0.5)")
              }
            >
              <XIcon />
            </button>
            <button
              type="submit"
              className="search-submit"
              disabled={!searchQuery.trim()}
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* ══════════════════════ MOBILE DRAWER ══════════════════════ */}
      {mobileOpen && (
        <>
          <div
            className="mobile-backdrop"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="mobile-drawer"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
          >
            {/* Drawer header */}
            <div className="drawer-header">
              <Link
                href="/"
                className="hdr-logo"
                onClick={() => setMobileOpen(false)}
              >
                <div className="hdr-logo-img" style={{ width: 32, height: 32 }}>
                  <Image
                    src="/images/logo.png"
                    alt="Furniro"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="hdr-logo-text" style={{ fontSize: "18px" }}>
                  Furniro
                </span>
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
                /* Mobile: compact UserDropdown trigger sits inline */
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <UserDropdown />
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="drawer-cta ghost"
                  onClick={() => setMobileOpen(false)}
                >
                  <UserIcon />
                  Sign In
                </Link>
              )}
              <button 
                className="drawer-cta primary"
                onClick={() => {
                  setMobileOpen(false);
                  setCartDrawerOpen(true);
                }}
              >
                <CartIcon />
                View Cart
                {cartCount > 0 && (
                  <span
                    className="hdr-badge"
                    style={{ position: "static", border: "none" }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </>
      )}

      <HeaderCartDrawer 
        isOpen={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)} 
      />
    </>
  );
};

export default Header;
