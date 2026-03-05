import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

function CustomSelect({
  value,
  onChange,
  options = [],
  className,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Button"
        className="w-full px-4 py-2 rounded-xl border bg-white text-sm
                   flex items-center justify-between focus:outline-none
                   focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected?.label || placeholder}
        </span>
        <span className="text-slate-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border bg-white shadow-lg overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={clsx(
                "px-4 py-2 text-sm cursor-pointer hover:bg-slate-100",
                value === opt.value && "bg-slate-100 font-medium"
              )}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
