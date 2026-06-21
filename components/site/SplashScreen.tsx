/**
 * SplashScreen — first-visit-per-session loader overlay.
 *
 * Rendered as the first child of <body> so the markup paints before React
 * hydrates. The inline <script> dismisses it via opacity → display:none.
 *
 * IMPORTANT: the script must NOT remove the splash element from the DOM
 * before React hydrates — that would create a structural mismatch between
 * the SSR HTML and React's virtual DOM. Instead we keep the node in place
 * and just visually hide it. `suppressHydrationWarning` covers the inline
 * style mutations (opacity / display) that the script applies pre-hydration.
 *
 * Behaviour:
 *  - Shows once per browser session (`sessionStorage['fea_splash_seen']`).
 *  - Minimum ~1.4s visible so the logo registers.
 *  - Fades out once min time has elapsed AND window 'load' fired.
 *  - Subsequent in-tab navigations: hidden immediately via display:none.
 */

export function SplashScreen() {
  return (
    <>
      <div
        id="fea-splash"
        aria-hidden="true"
        role="presentation"
        suppressHydrationWarning
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink-950"
        style={{
          // Inline so it applies before the global CSS class is parsed
          transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo_basic.png"
            alt=""
            width="220"
            height="110"
            className="h-auto w-[min(220px,52vw)] opacity-0"
            style={{
              animation:
                'fea-splash-fade-in 0.6s ease-out forwards, fea-splash-breathe 2.4s ease-in-out 0.6s infinite',
            }}
          />
          <div
            className="mt-8 h-px w-32 overflow-hidden"
            style={{backgroundColor: 'rgba(201, 169, 97, 0.15)'}}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
                animation: 'fea-splash-shimmer 1.6s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Inline dismissal script — runs at parse-time, before React hydration.
          Important: this script must NOT remove the splash element from the
          DOM (only hide it). Removing would diverge from React's virtual DOM
          and trigger a hydration mismatch. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var splash = document.getElementById('fea-splash');
              if (!splash) return;

              // Subsequent in-session navigations — hide immediately
              try {
                if (sessionStorage.getItem('fea_splash_seen') === '1') {
                  splash.style.opacity = '0';
                  splash.style.pointerEvents = 'none';
                  splash.style.display = 'none';
                  return;
                }
              } catch (e) { /* sessionStorage blocked — show splash anyway */ }

              var MIN_MS = 1400;
              var FADE_MS = 700;
              var started = Date.now();
              var done = false;

              function dismiss() {
                if (done) return;
                done = true;
                var elapsed = Date.now() - started;
                var wait = Math.max(0, MIN_MS - elapsed);
                setTimeout(function () {
                  splash.style.opacity = '0';
                  splash.style.pointerEvents = 'none';
                  try { sessionStorage.setItem('fea_splash_seen', '1'); } catch (e) {}
                  // Hide (not remove) after fade so the node stays in the DOM
                  setTimeout(function () {
                    splash.style.display = 'none';
                  }, FADE_MS);
                }, wait);
              }

              if (document.readyState === 'complete') {
                dismiss();
              } else {
                window.addEventListener('load', dismiss);
                // Safety net — never let splash linger longer than 5s
                setTimeout(dismiss, 5000);
              }
            })();
          `,
        }}
      />
    </>
  );
}
