import { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <p className="text-sm text-[var(--text-muted)]">Current Time</p>
      <p className="text-xl font-mono text-[var(--color-primary)]">
        {time.toLocaleTimeString()}
      </p>
    </>
  );
}

export default Clock