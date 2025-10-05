"use client";

import { useState } from "react";
import RefreshControls from "./refresh-controls";

export default function RefreshToggle({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`mb-4 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="refresh-panel"
        className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/15"
      >
        option
      </button>

      {open && (
        <div id="refresh-panel" className="mt-2 max-w-[300px] z-50">
          <RefreshControls />
        </div>
      )}
    </div>
  );
}