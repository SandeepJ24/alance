import { useEffect, useState } from 'react';
import backgroundImage from './assets/images/Backgroundimage.png';
import PersistentLogo from './components/PersistentLogo';

// Monday, 26 October 2026, 10:00 PM in the viewer's local time zone (months are 0-based).
const countdownTarget = new Date(2026, 9, 26, 22, 0, 0, 0).getTime();

const getRemainingMs = () => Math.max(0, countdownTarget - Date.now());

function App() {
  const [remainingMs, setRemainingMs] = useState(getRemainingMs);

  useEffect(() => {
    let timeoutId: number | undefined;

    const updateCountdown = () => {
      window.clearTimeout(timeoutId);
      const nextRemainingMs = getRemainingMs();
      setRemainingMs(nextRemainingMs);
      if (nextRemainingMs === 0) return;
      // Wake up exactly when the displayed second changes, so zero lands on the target instant.
      timeoutId = window.setTimeout(updateCountdown, nextRemainingMs % 1000 || 1000);
    };

    // Background tabs throttle timers; resync as soon as the page is visible again.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') updateCountdown();
    };

    updateCountdown();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Round up so the display only reads 00:00:00:00 once the target time has actually been reached.
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const hasStarted = remainingMs === 0;

  return (
    <main className="relative flex min-h-screen min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-slate-950">
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/25 via-slate-950/5 to-slate-950/60"
      />
      <div
        id="hero-logo-anchor"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <PersistentLogo />

      <section
        aria-label="Alance website launch"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          width: 'min(94vw, 44rem)',
          backgroundColor: 'rgba(15, 23, 42, 0.2)',
        }}
        className="rounded-3xl border border-white/15 bg-[#111111]/90 px-4 py-4 text-center text-white shadow-2xl shadow-black/50 backdrop-blur-2xl sm:px-7 sm:py-5"
      >
        <div>
          <h1 aria-live="polite" className="text-xl font-bold tracking-[0.12em] text-white sm:text-3xl">
            {hasStarted ? 'EVENT STARTED' : 'COMING SOON ....'}
          </h1>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
            {hasStarted
              ? 'Alance Finance is now live.'
              : 'Alance Finance launches Monday, October 26, 2026 at 10:00 PM (your local time).'}
          </p>
          <div
            role="timer"
            aria-label="Countdown to Monday, October 26, 2026 at 10:00 PM local time"
            className="mt-4 grid grid-cols-4 gap-2 sm:mt-5 sm:gap-3"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(6px, 2vw, 12px)' }}
          >
            {[
              ['Days', days],
              ['Hours', hours],
              ['Minutes', minutes],
              ['Seconds', seconds],
            ].map(([label, value]) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-2xl border border-white/15 px-1.5 py-2.5 shadow-lg sm:px-3 sm:py-3"
                style={{
                  background: 'linear-gradient(180deg, rgba(56,56,56,0.56) 0%, rgba(36,36,36,0.48) 50%, rgba(23,23,23,0.6) 100%)',
                  boxShadow: '0 8px 14px rgba(0,0,0,0.32)',
                }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 z-10 h-px"
                  style={{ top: '50%', backgroundColor: 'rgba(0,0,0,0.9)', boxShadow: '0 1px 0 rgba(255,255,255,0.12)' }}
                />
                <div className="font-mono text-3xl font-bold tabular-nums tracking-tight text-slate-100 [text-shadow:0_2px_2px_rgba(0,0,0,0.8)] sm:text-5xl">
                  {String(value).padStart(2, '0')}
                </div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-300 sm:text-[11px]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
