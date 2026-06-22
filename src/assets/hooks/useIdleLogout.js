import { useEffect, useRef } from "react";

// Automatically signs the user out after `timeoutMs` of no activity.
// Any of the listed user-interaction events resets the timer.
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

export const useIdleLogout = (logout, { timeoutMs = 15 * 60 * 1000, enabled = true } = {}) => {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        logout();
      }, timeoutMs);
    };

    // Start the timer and listen for activity.
    reset();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, reset, { passive: true })
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [logout, timeoutMs, enabled]);
};
