import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your VELORA account.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-basalt">
      {/* Left side: interactive product moment */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-raised border-r border-border-subtle">
        {/* Subtle saffron radial */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(242, 169, 0, 0.05) 0%, transparent 60%)',
          }}
        />

        <div className="relative flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-saffron flex items-center justify-center shadow-saffron-sm">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path
                  d="M8 8L16 24L24 8"
                  stroke="var(--color-basalt)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-display text-lg font-bold tracking-wide text-salt">
              VELORA
            </span>
          </a>

          {/* Product moment — live trace visualization */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="rounded-xl border border-border-subtle bg-surface-base p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-moss animate-pulse" />
                  <span className="text-xs font-mono text-neutral-400">
                    Live system trace
                  </span>
                </div>

                {/* Simulated trace bars */}
                {[
                  { name: 'Edge gateway', width: '8%', time: '0.2ms' },
                  { name: 'Auth engine', width: '15%', time: '0.4ms' },
                  { name: 'PostgreSQL', width: '45%', time: '1.2ms' },
                  { name: 'Realtime', width: '12%', time: '0.3ms' },
                ].map((span) => (
                  <div key={span.name} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-neutral-500 flex-shrink-0">
                      {span.name}
                    </span>
                    <div className="flex-1 h-5 bg-surface-overlay rounded overflow-hidden">
                      <div
                        className="h-full bg-saffron/80 rounded flex items-center justify-end pr-1.5"
                        style={{ width: span.width }}
                      >
                        <span className="text-[9px] font-mono text-basalt font-semibold">
                          {span.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">
                    Total: 2.1ms
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-moss">
                    <span className="w-1.5 h-1.5 rounded-full bg-moss" />
                    Within budget
                  </span>
                </div>
              </div>

              <p className="mt-6 text-sm text-neutral-500 leading-relaxed text-center">
                See every millisecond of every request.
                <br />
                Database, auth, storage, realtime — one trace.
              </p>
            </div>
          </div>

          {/* Bottom testimonial / stat */}
          <div className="text-sm text-neutral-500">
            <p className="font-mono text-xs text-neutral-600">
              Intent → production in minutes, not months.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
