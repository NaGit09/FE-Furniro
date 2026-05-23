"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "flag-icons/css/flag-icons.min.css";
import {
  AsYouType,
  CountryCode,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

/* ─────────────────────────────── Types ─── */
export interface CountryItem {
  code: string;    // "+84"
  iso: CountryCode;
  name: string;
}

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  /** Pass field-level error message from react-hook-form */
  error?: string;
  /** Unique id for aria linkage */
  id?: string;
  disabled?: boolean;
}

/* ─────────────────────────── Phone Icon SVG ─── */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round"
    className="w-4 h-4" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.18 2 2 0 0 1 3.52 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 14, height: 14, transition: "transform 200ms", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 14, height: 14, flexShrink: 0 }} aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 16, height: 16, flexShrink: 0 }} aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 12, height: 12 }} aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─────────────────────────── Main component ─── */
export default function PhoneInput({
  value,
  onChange,
  error,
  id = "phone-input",
  disabled = false,
}: PhoneInputProps) {
  /* ── Build sorted country list once ── */
  const countryList = useMemo<CountryItem[]>(() => {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return getCountries()
      .map((iso) => ({
        code: `+${getCountryCallingCode(iso)}`,
        iso,
        name: regionNames.of(iso) ?? iso,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const defaultCountry = useMemo(
    () => countryList.find((c) => c.iso === "VN") ?? countryList[0],
    [countryList]
  );

  /* ── State ── */
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(defaultCountry);
  const [phone, setPhone] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  /* ── Refs ── */
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* ── Filtered countries ── */
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return countryList;
    return countryList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [countryList, searchQuery]);

  /* ── Sync external value → local state ── */
  useEffect(() => {
    if (!value) {
      setPhone("");
      setIsValid(null);
      return;
    }
    try {
      const parsed = parsePhoneNumberFromString(value);
      if (parsed) {
        const iso = parsed.country ?? defaultCountry.iso;
        const found = countryList.find((c) => c.iso === iso) ?? defaultCountry;
        setSelectedCountry(found);
        const formatted = new AsYouType(iso).input(String(parsed.nationalNumber ?? ""));
        setPhone((prev) => (formatted !== prev ? formatted : prev));
        setIsValid(parsed.isValid());
      }
    } catch {
      /* ignore malformed values */
    }
  }, [value, countryList, defaultCountry]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  /* ── Focus search input when dropdown opens ── */
  useEffect(() => {
    if (dropdownOpen) {
      setHighlightIndex(filteredCountries.findIndex((c) => c.iso === selectedCountry.iso));
      setTimeout(() => searchRef.current?.focus(), 60);
    }
  }, [dropdownOpen]);

  /* ── Scroll highlighted item into view ── */
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.children[highlightIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex]);

  /* ── Validate phone ── */
  const validate = useCallback(
    (rawPhone: string, iso: CountryCode) => {
      if (!rawPhone) { setIsValid(null); return; }
      try {
        setIsValid(isValidPhoneNumber(rawPhone, iso));
      } catch {
        setIsValid(false);
      }
    },
    []
  );

  /* ── Handle phone text input ── */
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d\s\-().+]/g, "");
      const digits = raw.replace(/\D/g, "");
      const formatter = new AsYouType(selectedCountry.iso);
      const formatted = formatter.input(digits);
      setPhone(formatted);

      const parsed = parsePhoneNumberFromString(formatted, selectedCountry.iso);
      const e164 = parsed?.number ?? (digits ? `${selectedCountry.code}${digits}` : "");
      onChange?.(e164);
      validate(formatted, selectedCountry.iso);
    },
    [selectedCountry, onChange, validate]
  );

  /* ── Handle country selection ── */
  const handleSelectCountry = useCallback(
    (country: CountryItem) => {
      setSelectedCountry(country);
      setDropdownOpen(false);
      setSearchQuery("");

      const digits = phone.replace(/\D/g, "");
      const formatted = new AsYouType(country.iso).input(digits);
      setPhone(formatted);

      const parsed = parsePhoneNumberFromString(formatted, country.iso);
      const e164 = parsed?.number ?? (digits ? `${country.code}${digits}` : "");
      onChange?.(e164);
      validate(formatted, country.iso);

      setTimeout(() => phoneRef.current?.focus(), 50);
    },
    [phone, onChange, validate]
  );

  /* ── Keyboard navigation for dropdown ── */
  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!dropdownOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setDropdownOpen(true);
        }
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex((i) => Math.min(i + 1, filteredCountries.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCountries[highlightIndex]) {
            handleSelectCountry(filteredCountries[highlightIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setDropdownOpen(false);
          setSearchQuery("");
          break;
        case "Tab":
          setDropdownOpen(false);
          setSearchQuery("");
          break;
      }
    },
    [dropdownOpen, filteredCountries, highlightIndex, handleSelectCountry]
  );

  /* ── Clear phone ── */
  const handleClear = useCallback(() => {
    setPhone("");
    setIsValid(null);
    onChange?.("");
    phoneRef.current?.focus();
  }, [onChange]);

  /* ── Derived border color ── */
  const borderColor = error
    ? "rgba(220,38,38,0.7)"
    : isValid === true
    ? "rgba(22,163,74,0.6)"
    : isFocused
    ? "#ca8a04"
    : "rgba(202,138,4,0.25)";

  const boxShadow = error
    ? "0 0 0 3px rgba(220,38,38,0.1)"
    : isValid === true
    ? "0 0 0 3px rgba(22,163,74,0.1)"
    : isFocused
    ? "0 0 0 3px rgba(202,138,4,0.15)"
    : "none";

  return (
    <>
      {/* ─── Styles ─── */}
      <style>{`
        .pi-root { font-family: 'Inter', sans-serif; }

        /* wrapper */
        .pi-wrapper {
          display: flex;
          align-items: stretch;
          width: 100%;
          border-radius: 12px;
          border: 1.5px solid;
          background: rgba(255,255,255,0.22);
          overflow: visible;
          transition: border-color 200ms, box-shadow 200ms;
          position: relative;
        }
        .pi-wrapper:has(input:disabled) {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* country trigger */
        .pi-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 10px 0 12px;
          background: rgba(202,138,4,0.06);
          border: none;
          border-right: 1.5px solid rgba(202,138,4,0.18);
          cursor: pointer;
          border-radius: 10px 0 0 10px;
          min-width: 86px;
          height: 48px;
          flex-shrink: 0;
          transition: background 200ms;
          outline: none;
          white-space: nowrap;
        }
        .pi-trigger:hover:not(:disabled) {
          background: rgba(202,138,4,0.12);
        }
        .pi-trigger:focus-visible {
          outline: 2px solid #ca8a04;
          outline-offset: -2px;
          border-radius: 10px 0 0 10px;
        }
        .pi-trigger:disabled { cursor: not-allowed; }

        .pi-flag { border-radius: 2px; width: 20px; height: 15px; flex-shrink: 0; }
        .pi-calling-code {
          font-size: 13px;
          font-weight: 600;
          color: #5a3c14;
          letter-spacing: 0.2px;
        }

        /* text input */
        .pi-input-wrap {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
        }
        .pi-phone-icon {
          position: absolute;
          left: 12px;
          color: rgba(90,60,20,0.4);
          pointer-events: none;
          flex-shrink: 0;
        }
        .pi-input {
          flex: 1;
          height: 48px;
          padding: 0 36px 0 36px;
          border: none;
          background: transparent;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          color: #1a0a00;
          outline: none;
          border-radius: 0 10px 10px 0;
          letter-spacing: 0.3px;
          width: 0; /* allow flex to size it */
        }
        .pi-input::placeholder { color: rgba(90,60,20,0.38); font-weight: 400; }
        .pi-input:disabled { cursor: not-allowed; }

        /* right icons */
        .pi-right-icons {
          display: flex;
          align-items: center;
          gap: 4px;
          padding-right: 10px;
          flex-shrink: 0;
        }
        .pi-clear-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(90,60,20,0.1);
          border: none;
          cursor: pointer;
          color: rgba(90,60,20,0.55);
          transition: background 200ms, color 200ms;
          padding: 0;
        }
        .pi-clear-btn:hover { background: rgba(220,38,38,0.12); color: #dc2626; }
        .pi-clear-btn:focus-visible { outline: 2px solid #ca8a04; outline-offset: 2px; }

        /* ── DROPDOWN ── */
        .pi-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0; right: 0;
          z-index: 200;
          background: rgba(255,255,255,0.97);
          border: 1.5px solid rgba(202,138,4,0.22);
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(28,25,23,0.18), 0 2px 8px rgba(28,25,23,0.08);
          overflow: hidden;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          animation: piDropIn 180ms cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes piDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* search bar inside dropdown */
        .pi-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(202,138,4,0.12);
          color: rgba(90,60,20,0.5);
        }
        .pi-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 13.5px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          color: #1a0a00;
        }
        .pi-search-input::placeholder { color: rgba(90,60,20,0.38); }
        .pi-search-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(90,60,20,0.4);
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 4px;
          transition: color 200ms;
        }
        .pi-search-clear:hover { color: #1a0a00; }

        /* list */
        .pi-list {
          list-style: none;
          margin: 0;
          padding: 6px;
          max-height: 240px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(202,138,4,0.25) transparent;
        }
        .pi-list::-webkit-scrollbar { width: 5px; }
        .pi-list::-webkit-scrollbar-track { background: transparent; }
        .pi-list::-webkit-scrollbar-thumb { background: rgba(202,138,4,0.25); border-radius: 99px; }

        .pi-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 150ms;
          outline: none;
        }
        .pi-list-item:hover,
        .pi-list-item.highlighted {
          background: rgba(202,138,4,0.09);
        }
        .pi-list-item.selected {
          background: rgba(202,138,4,0.14);
        }
        .pi-item-code {
          font-size: 12.5px;
          font-weight: 700;
          color: #b45309;
          min-width: 38px;
          letter-spacing: 0.2px;
        }
        .pi-item-name {
          font-size: 13px;
          color: #3d2b0d;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pi-no-results {
          text-align: center;
          padding: 20px;
          font-size: 13.5px;
          color: rgba(90,60,20,0.5);
          font-style: italic;
        }

        /* validation message */
        .pi-msg {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
          font-size: 12.5px;
          font-weight: 500;
        }
        .pi-msg.error   { color: #dc2626; }
        .pi-msg.success { color: #16a34a; }
        .pi-msg.hint    { color: rgba(90,60,20,0.55); }

        @media (prefers-reduced-motion: reduce) {
          .pi-dropdown { animation: none; }
          .pi-trigger, .pi-clear-btn, .pi-list-item { transition: none; }
        }
      `}</style>

      {/* ─── Component root ─── */}
      <div className="pi-root" style={{ position: "relative" }} ref={dropdownRef}>
        {/* ─── Main input row ─── */}
        <div
          className="pi-wrapper"
          style={{ borderColor, boxShadow }}
          role="group"
          aria-labelledby={`${id}-label`}
        >
          {/* ── Country selector button ── */}
          <button
            type="button"
            className="pi-trigger"
            onClick={() => !disabled && setDropdownOpen((v) => !v)}
            onKeyDown={handleDropdownKeyDown}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-label={`Country: ${selectedCountry.name} (${selectedCountry.code})`}
            disabled={disabled}
          >
            <span
              className={`fi fi-${selectedCountry.iso.toLowerCase()} pi-flag`}
              role="img"
              aria-label={selectedCountry.name}
            />
            <span className="pi-calling-code">{selectedCountry.code}</span>
            <ChevronDownIcon open={dropdownOpen} />
          </button>

          {/* ── Phone number input ── */}
          <div className="pi-input-wrap">
            <span className="pi-phone-icon">
              <PhoneIcon />
            </span>
            <input
              ref={phoneRef}
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              className="pi-input"
              placeholder="000 000 0000"
              value={phone}
              onChange={handlePhoneChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              aria-invalid={!!error || isValid === false}
              aria-describedby={
                error
                  ? `${id}-error`
                  : isValid === true
                  ? `${id}-success`
                  : `${id}-hint`
              }
            />
            {/* Right-side icons */}
            <div className="pi-right-icons">
              {isValid === true && <CheckIcon />}
              {phone && !disabled && (
                <button
                  type="button"
                  className="pi-clear-btn"
                  onClick={handleClear}
                  aria-label="Clear phone number"
                  tabIndex={-1}
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Country dropdown ─── */}
        {dropdownOpen && (
          <div
            className="pi-dropdown"
            role="dialog"
            aria-label="Select country code"
          >
            {/* Search */}
            <div className="pi-search-bar">
              <SearchIcon />
              <input
                ref={searchRef}
                type="search"
                className="pi-search-input"
                placeholder="Search country or code…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightIndex(0);
                }}
                aria-label="Search countries"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="pi-search-clear"
                  onClick={() => { setSearchQuery(""); setHighlightIndex(0); searchRef.current?.focus(); }}
                  aria-label="Clear search"
                >
                  <ClearIcon />
                </button>
              )}
            </div>

            {/* List */}
            <ul
              ref={listRef}
              className="pi-list"
              role="listbox"
              aria-label="Countries"
              onKeyDown={handleDropdownKeyDown}
            >
              {filteredCountries.length === 0 ? (
                <li className="pi-no-results" role="option" aria-selected={false}>
                  No countries found
                </li>
              ) : (
                filteredCountries.map((country, idx) => {
                  const isSelected = country.iso === selectedCountry.iso;
                  return (
                    <li
                      key={`${country.iso}-${country.code}`}
                      role="option"
                      aria-selected={isSelected}
                      className={[
                        "pi-list-item",
                        isSelected ? "selected" : "",
                        idx === highlightIndex ? "highlighted" : "",
                      ].join(" ")}
                      onClick={() => handleSelectCountry(country)}
                      onMouseEnter={() => setHighlightIndex(idx)}
                    >
                      <span
                        className={`fi fi-${country.iso.toLowerCase()} pi-flag`}
                        role="img"
                        aria-label={country.name}
                      />
                      <span className="pi-item-code">{country.code}</span>
                      <span className="pi-item-name">{country.name}</span>
                      {isSelected && (
                        <span style={{ marginLeft: "auto", flexShrink: 0 }}>
                          <CheckIcon />
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}

        {/* ─── Validation / hint messages ─── */}
        {error ? (
          <p id={`${id}-error`} className="pi-msg error" role="alert" aria-live="assertive">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {error}
          </p>
        ) : isValid === true ? (
          <p id={`${id}-success`} className="pi-msg success" aria-live="polite">
            <CheckIcon />
            Valid phone number
          </p>
        ) : isValid === false && phone.length > 3 ? (
          <p id={`${id}-error`} className="pi-msg error" role="alert" aria-live="assertive">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            Please enter a valid phone number for {selectedCountry.name}
          </p>
        ) : (
          <p id={`${id}-hint`} className="pi-msg hint" aria-live="polite">
            Include country code · Format: {selectedCountry.code} XXX XXX XXXX
          </p>
        )}
      </div>
    </>
  );
}