import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../app/redux/hooks';
import { clearAvatarUrl, setAvatarUrl } from '../app/redux/slices/userSlice';

const AVATAR_URL_EXPIRY_BUFFER_MS = 60_000;

export const useUser = () => {
  const user = useAppSelector((state) => state.user);
  const avatarKey = user?.avatar ?? null;

  const cachedAvatar = useAppSelector((state) => state.avatarUrl);
  const dispatch = useAppDispatch();
  const inFlightKeyRef = useRef<string | null>(null);

  const isAvatarUrlFresh =
    !!avatarKey &&
    cachedAvatar.key === avatarKey &&
    cachedAvatar.url !== null &&
    cachedAvatar.expiresAt !== null &&
    cachedAvatar.expiresAt - AVATAR_URL_EXPIRY_BUFFER_MS > Date.now();

  useEffect(() => {
    if (!avatarKey) {
      if (cachedAvatar.key !== null) dispatch(clearAvatarUrl());
      return;
    }
    if (isAvatarUrlFresh) return;
    if (inFlightKeyRef.current === avatarKey) return;

    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) return;

    inFlightKeyRef.current = avatarKey;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${baseUrl}/users/avatars/signed-url?key=${encodeURIComponent(avatarKey)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Avatar URL request failed: ${res.status}`);

        const { url, expiresIn } = (await res.json()) as {
          url?: string;
          expiresIn?: number;
        };
        if (!url || !expiresIn) return;

        dispatch(
          setAvatarUrl({
            key: avatarKey,
            url,
            expiresAt: Date.now() + expiresIn * 1000,
          })
        );
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        console.error('Failed to load avatar URL:', err);
      } finally {
        if (inFlightKeyRef.current === avatarKey) {
          inFlightKeyRef.current = null;
        }
      }
    })();

    return () => controller.abort();
  }, [avatarKey, isAvatarUrlFresh, cachedAvatar.key, dispatch]);

  const avatarUrl =
    cachedAvatar.key === avatarKey ? cachedAvatar.url : null;

  return {
    user,
    userId: user?.id || null,
    isAuthenticated: user !== null,
    avatarUrl,
  };
};
