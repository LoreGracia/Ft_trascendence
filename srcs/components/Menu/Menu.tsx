"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

export default function MenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative corner-right"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button>
        <Menu/>
      </button>

      {open && (
        <div>
          <button className="w-full button--highlight">
            Acción 1
          </button>

          <button className="w-full button--highlight" >
            Acción 2
          </button>

          <button className="w-full button--highlight">
            Acción 3
          </button>
        </div>
      )}
    </div>
  );
}