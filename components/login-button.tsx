"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateState, getLoginUrl } from "@/lib/oauth";

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const state = generateState();
      const response = await fetch("/api/auth/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });

      if (response.ok) {
        const loginUrl = getLoginUrl(state);
        window.location.href = loginUrl;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="default" onClick={handleLogin} disabled={isLoading}>
      {isLoading ? "Signing in..." : "Sign in with GitHub"}
    </Button>
  );
}
