"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import UserDropdown from "@/components/customs/common/UserLayout/UserDropdown";
import HeaderCartDrawer from "@/components/customs/common/UserLayout/HeaderCartDrawer";
import NotificationDropdown from "@/components/customs/common/NotificationDropdown";
import "@/style/Header.css";
import { SearchIcon, UserIcon, Menu, ShoppingCart, X, DoorClosed, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

/* ─── Types ──────────────────────────────────────────────── */
type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "Compare", href: "/compare" },
  { label: "About", href: "/about" },
  { label: "Subscribe", href: "/subscribe" },
];

/* ─── Main Component ──────────────────────────────────────── */
const Header = () => {

  const pathname = usePathname();

  const router = useRouter();

  const auth = useSelector((state: RootState) => state.authSlice);

  const cart = useSelector((state: RootState) => state.cartSlice);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <nav className="hdr-nav hidden xl:flex" aria-label="Main navigation">
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

            {/* Theme Toggle */}
            <button
              id="hdr-btn-theme"
              className="hdr-icon-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-stone-600 dark:text-stone-300" />
              )}
            </button>

            {/* Notifications */}
            {auth.isLoggedIn && (
              <div className="flex items-center justify-center">
                <NotificationDropdown />
              </div>
            )}

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
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="hdr-badge" aria-hidden="true">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              id="hdr-btn-menu"
              className="hdr-icon-btn xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu />
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
              <X />
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
                <DoorClosed />
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
                <ShoppingCart />
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
