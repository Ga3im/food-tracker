import { useEffect, useState } from "react";

export const useIsDesktop = (breakpoint = 768) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.innerWidth >= breakpoint
  );

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);

  return { isDesktop };
};
