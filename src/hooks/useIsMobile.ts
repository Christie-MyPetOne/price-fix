"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = (event: MediaQueryList | MediaQueryListEvent) => {
      const matches =
        "matches" in event ? event.matches : (event as MediaQueryList).matches;
      setIsMobile(matches);
    };

    update(mq);
    mq.addEventListener("change", update as any);

    return () => mq.removeEventListener("change", update as any);
  }, [breakpoint]);

  return isMobile;
}
