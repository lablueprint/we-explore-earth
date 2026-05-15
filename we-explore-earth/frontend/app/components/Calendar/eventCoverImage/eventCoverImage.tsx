import React, { useEffect, useState } from "react";
import { Image, type ImageStyle, type StyleProp } from "react-native";

import { fetchEventCoverSignedUrl } from "@/utils/eventUtils";

type Props = {
  imageKey?: string | null;
  style?: StyleProp<ImageStyle>;
  /** Shown while loading or when there is no resolvable URL */
  fallback?: React.ReactNode;
};

export function EventCoverImage({ imageKey, style, fallback }: Props) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!imageKey?.startsWith("events/")) {
      setUri(null);
      return;
    }
    fetchEventCoverSignedUrl(imageKey).then((url) => {
      if (!cancelled) {
        setUri(url);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [imageKey]);

  if (!uri) {
    return <>{fallback ?? null}</>;
  }

  return <Image source={{ uri }} style={style} resizeMode="cover" />;
}
