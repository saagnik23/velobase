import { Github, Twitter } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Changelog', 'Status'],
  Developers: ['Documentation', 'API reference', 'CLI', 'SDKs'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'GDPR'],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-surface-raised">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-saffron flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M8 8L16 24L24 8"
                    stroke="var(--color-basalt)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-display font-bold text-salt">VELORA</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              Application operating system.
              <br />
              Intent to production.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/velora"
                className="text-neutral-500 hover:text-salt transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/velora"
                className="text-neutral-500 hover:text-salt transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-salt mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-neutral-500 hover:text-salt transition-colors"
                      style={{ transitionDuration: 'var(--duration-fast)' }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t border-border-subtle flex items-center justify-between">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} VELORA. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600 font-mono">
            Built with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
