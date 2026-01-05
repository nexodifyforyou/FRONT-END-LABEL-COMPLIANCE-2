import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const sections = [
  { id: 'who-we-are', title: '1. Who we are' },
  { id: 'what-data', title: '2. What data we collect' },
  { id: 'why-collect', title: '3. Why we collect it' },
  { id: 'where-stored', title: '4. Where your data is stored' },
  { id: 'sharing', title: '5. Sharing and processors' },
  { id: 'retention', title: '6. Data retention' },
  { id: 'security', title: '7. Security' },
  { id: 'your-rights', title: '8. Your rights' },
  { id: 'cookies', title: '9. Cookies' },
  { id: 'contact', title: '10. Contact' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[960px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-[#5B6CFF]" />
            <span className="text-lg font-semibold text-white/95">Nexodify</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-[960px] mx-auto">
          <div 
            className="bg-white/[0.04] border border-white/[0.10] rounded-2xl p-8 sm:p-10"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
          >
            {/* Title */}
            <h1 className="text-4xl font-bold text-white/95 mb-2">Privacy Policy</h1>
            <p className="text-white/50 text-sm mb-8">Last updated: {today}</p>

            {/* Table of Contents */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 mb-10">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Table of Contents</h2>
              <nav className="grid sm:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <a 
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-[#5B6CFF] hover:text-[#7B8CFF] text-sm transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="space-y-8 text-white/[0.78] text-base leading-relaxed" style={{ lineHeight: '1.65' }}>
              <section id="who-we-are">
                <h2 className="text-xl font-bold text-white/90 mb-3">1. Who we are</h2>
                <p>Nexodify ("we", "us") provides Nexodify AVA Label Compliance Preflight (the "Service").</p>
              </section>

              <section id="what-data">
                <h2 className="text-xl font-bold text-white/90 mb-3">2. What data we collect</h2>
                <p className="mb-3">We may collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Account data:</strong> email, password hash, login metadata.</li>
                  <li><strong>Usage data:</strong> pages/actions used, timestamps, basic diagnostics.</li>
                  <li><strong>Uploaded files:</strong> product label files and supplier TDS files you upload.</li>
                  <li><strong>Extracted text:</strong> OCR/text extracted from uploaded files.</li>
                  <li><strong>Audit outputs:</strong> generated reports, findings, corrections you submit, and related metadata.</li>
                </ul>
              </section>

              <section id="why-collect">
                <h2 className="text-xl font-bold text-white/90 mb-3">3. Why we collect it</h2>
                <p className="mb-3">We use the data to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Provide the Service (process uploads, generate preflight reports).</li>
                  <li>Maintain security, prevent abuse, and troubleshoot issues.</li>
                  <li>Improve the quality and reliability of checks and outputs.</li>
                </ul>
              </section>

              <section id="where-stored">
                <h2 className="text-xl font-bold text-white/90 mb-3">4. Where your data is stored</h2>
                <p className="mb-3">For this MVP, core audit artifacts (uploads, extracted text/OCR, report outputs) are stored on Nexodify infrastructure on disk (run artifacts stored under <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">/srv/ava/data/runs/&lt;run_id&gt;/</code>).</p>
                <p>If optional third-party processors are enabled (e.g., OCR providers), relevant data may be sent to them solely to perform that processing.</p>
              </section>

              <section id="sharing">
                <h2 className="text-xl font-bold text-white/90 mb-3">5. Sharing and processors</h2>
                <p className="mb-3">We do not sell your personal data.</p>
                <p>We may share data with service providers only as needed to run the Service (e.g., hosting, email delivery, OCR processing if enabled).</p>
              </section>

              <section id="retention">
                <h2 className="text-xl font-bold text-white/90 mb-3">6. Data retention</h2>
                <p className="mb-3">We retain data for as long as needed to provide the Service and maintain audit history.</p>
                <p>You may request deletion of your account and related artifacts by contacting us.</p>
              </section>

              <section id="security">
                <h2 className="text-xl font-bold text-white/90 mb-3">7. Security</h2>
                <p>We use reasonable technical and organizational measures to protect your data. No method of transmission or storage is 100% secure.</p>
              </section>

              <section id="your-rights">
                <h2 className="text-xl font-bold text-white/90 mb-3">8. Your rights</h2>
                <p>You may request access, correction, or deletion of your data by contacting us.</p>
              </section>

              <section id="cookies">
                <h2 className="text-xl font-bold text-white/90 mb-3">9. Cookies</h2>
                <p>We use only essential cookies/session storage required to operate the Service (and optional analytics only if explicitly enabled).</p>
              </section>

              <section id="contact">
                <h2 className="text-xl font-bold text-white/90 mb-3">10. Contact</h2>
                <p>For privacy requests, contact: <a href="mailto:nexodifyforyou@gmail.com" className="text-[#5B6CFF] hover:text-[#7B8CFF] transition-colors">nexodifyforyou@gmail.com</a></p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/[0.06]">
        <div className="max-w-[960px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-white/40" />
            <span className="text-white/40 text-sm">© 2025 Nexodify. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-white/60 hover:text-white/80 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-white/40 hover:text-white/70 transition-colors">Terms</Link>
            <a href="mailto:nexodifyforyou@gmail.com?subject=Nexodify%20AVA%20Support&body=Hi%20Nexodify%20Team%2C%0A%0A%5BDescribe%20your%20issue%5D%0A%0AThanks%2C" className="text-white/40 hover:text-white/70 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
