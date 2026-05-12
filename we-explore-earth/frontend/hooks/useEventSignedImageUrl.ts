import { useEffect, useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/** Resolve `events/…` S3 keys to a short-lived HTTPS URL (same pattern as avatar signed URLs). */
export function useEventSignedImageUrl(
  eventImageKey: string | null | undefined
): { url: string | null; loading: boolean } {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key =
      typeof eventImageKey === "string" && eventImageKey.trim() !== ""
        ? eventImageKey.trim()
        : "";

    if (!key || !API_URL) {
      setUrl(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`${API_URL}/events/signed-url?key=${encodeURIComponent(key)}`)
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return typeof data.url === "string" ? data.url : null;
      })
      .then((signed) => {
        if (!cancelled) setUrl(signed);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [eventImageKey]);

  return { url, loading };
}
