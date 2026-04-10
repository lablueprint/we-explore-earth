import React, { createContext, useContext, useState } from "react";

type EventFormDirtyContextValue = {
  isEventFormDirty: boolean;
  setEventFormDirty: (dirty: boolean) => void;
};

const EventFormDirtyContext = createContext<EventFormDirtyContextValue | null>(
  null,
);

export function EventFormDirtyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isEventFormDirty, setEventFormDirty] = useState(false);
  return (
    <EventFormDirtyContext.Provider
      value={{ isEventFormDirty, setEventFormDirty }}
    >
      {children}
    </EventFormDirtyContext.Provider>
  );
}

export function useEventFormDirty() {
  const ctx = useContext(EventFormDirtyContext);
  if (ctx == null) {
    return { isEventFormDirty: false, setEventFormDirty: () => {} };
  }
  return ctx;
}
