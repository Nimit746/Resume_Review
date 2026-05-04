"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocalStorage } from "hooknest";

export const USER_KEY = "resumeforge_user";

export function getMockUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setMockUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useLocalStorage(USER_KEY, null);

  useEffect(() => {
    const publicRoutes = ["/", "/auth/signup", "/auth/login"]; // Added login just in case
    const isPublic = publicRoutes.some((route) => pathname === route);
    
    // Check if path starts with a public route (like /auth/)
    const isAuthPath = pathname.startsWith("/auth/");
    
    if (!isPublic && !isAuthPath && !user) {
      router.push("/auth/signup");
    }
    
    // Redirect logged in users away from auth pages
    if (user && isAuthPath) {
      router.push("/dashboard");
    }
  }, [pathname, router, user]);
}
