"use client";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const handleSignOut = () => {
    document.cookie = "gh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    window.location.href = "/";
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
