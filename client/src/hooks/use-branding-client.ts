import { BrandingClient } from "@/lib/branding-client";
import { useMemo } from "react";

export default function useBrandingClient() {
  return useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is not defined for Wordsmith.");
      return null;
    }
    return new BrandingClient({ baseUrl, timeoutMs: 15000 });
  }, []);
}