import React from "react";

export function useThrottle(value: string, interval = 500) {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastUpdated = React.useRef<number | null>(null);

  React.useEffect(() => {
    const now = performance.now();

    if (!lastUpdated.current || now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
      }, interval);

      return () => window.clearTimeout(id);
    }
  }, [value, interval]);

  return throttledValue;
}
export default useThrottle;
