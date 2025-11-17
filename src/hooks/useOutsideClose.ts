"use client";

import { useEffect, useRef } from "react";

/**
 * Fecha o popover/modal quando clicar fora ou apertar ESC
 */
export function useOutsideClose<T extends HTMLElement>(
  open: boolean,
  onClose: () => void
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!open) return;

    function onDocMouseDown(e: MouseEvent | TouchEvent) {
      if (!ref.current) return;
      const target = e.target as Node;
      if (!ref.current.contains(target)) onClose();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("touchstart", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("touchstart", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return ref;
}
