import { useState, useEffect, useEffectEvent } from "react";
import { getSiteKeyFn } from "@/actions/get.site.key";

const SITE_KEY_STORAGE_KEY = "cf_site_key";

export function useSiteKey() {
  const [siteKey, setSiteKey] = useState<string | null>(() => {
    // Try to get cached site key from localStorage on initial render
    try {
      return localStorage.getItem(SITE_KEY_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const updateSiteKey = useEffectEvent((key: string) => {
    setSiteKey(key);
    // Cache the site key in localStorage for future use
    try {
      localStorage.setItem(SITE_KEY_STORAGE_KEY, key);
    } catch (error) {
      console.warn("Failed to cache site key in localStorage:", error);
    }
  });

  useEffect(() => {
    // If we already have a cached site key, no need to fetch
    if (siteKey) {
      return;
    }

    const fetchSiteKey = async () => {
      try {
        const key = await getSiteKeyFn();
        updateSiteKey(key);
      } catch (error) {
        console.error("Failed to fetch site key:", error);
      }
    };

    fetchSiteKey();
  }, [siteKey]);

  return siteKey;
}
