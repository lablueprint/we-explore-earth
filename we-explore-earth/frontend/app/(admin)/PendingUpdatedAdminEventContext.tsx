import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
} from "react";
import type { Event } from "@shared/types/event";

type PendingUpdatedAdminEventContextValue = {
  setPendingUpdatedEvent: (event: Event) => void;
  consumePendingUpdatedEvent: () => Event | null;
};

const PendingUpdatedAdminEventContext =
  createContext<PendingUpdatedAdminEventContextValue | null>(null);

export function PendingUpdatedAdminEventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pendingRef = useRef<Event | null>(null);

  const setPendingUpdatedEvent = useCallback((event: Event) => {
    pendingRef.current = event;
  }, []);

  const consumePendingUpdatedEvent = useCallback(() => {
    const next = pendingRef.current;
    pendingRef.current = null;
    return next;
  }, []);

  return (
    <PendingUpdatedAdminEventContext.Provider
      value={{ setPendingUpdatedEvent, consumePendingUpdatedEvent }}
    >
      {children}
    </PendingUpdatedAdminEventContext.Provider>
  );
}

export function usePendingUpdatedAdminEvent() {
  const ctx = useContext(PendingUpdatedAdminEventContext);
  if (ctx == null) {
    return {
      setPendingUpdatedEvent: () => {},
      consumePendingUpdatedEvent: () => null as Event | null,
    };
  }
  return ctx;
}
