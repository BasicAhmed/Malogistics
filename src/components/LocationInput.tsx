"use client";

import { useState, useRef, useEffect } from "react";
import { searchLocations, isKnownLocation } from "@/lib/locations";

export default function LocationInput({
  value,
  onChange,
  placeholder,
  dark,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dark?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const matches = searchLocations(query);
  const valid = isKnownLocation(query);
  const showWarning = query.trim().length > 2 && !valid && !open;

  const base = dark
    ? "w-full bg-deck-maroon rounded p-4 text-paper placeholder:text-fog outline-none"
    : "w-full bg-fog/40 rounded p-2.5 text-sm outline-none";

  return (
    <div className="relative" ref={wrapRef}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(""); // clear committed value until a valid one is re-selected
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || "Start typing a city…"}
        className={`${base} ${showWarning ? "ring-2 ring-status-hold" : ""}`}
      />
      {open && matches.length > 0 && (
        <div
          className={`absolute z-20 w-full mt-1 rounded-lg shadow-lg max-h-56 overflow-y-auto ${
            dark ? "bg-cargo-maroon border border-deck-maroon" : "bg-paper border border-fog"
          }`}
        >
          {matches.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                onChange(loc);
                setQuery(loc);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm ${
                dark ? "text-paper hover:bg-deck-maroon" : "hover:bg-fog/40"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      )}
      {showWarning && (
        <p className="text-xs text-status-hold mt-1">
          Please select a location from the list — we can only quote on serviced areas.
        </p>
      )}
    </div>
  );
}
