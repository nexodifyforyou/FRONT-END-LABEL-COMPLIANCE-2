import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const sections = [
  { id: 'service', title: '1. Service' },
  { id: 'not-legal', title: '2. Not legal advice / not certification' },
  { id: 'responsibilities', title: '3. Your responsibilities' },
  { id: 'acceptable-use', title: '4. Acceptable use' },
  { id: 'ip', title: '5. Intellectual property' },
  { id: 'availability', title: '6. Availability' },
  { id: 'liability', title: '7. Limitation of liability' },
  { id: 'termination', title: '8. Termination' },
  { id: 'changes', title: '9. Changes' },
  { id: 'governing-law', title: '10. Governing law' },
];

export default function TermsPage() {
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
            <h1 className="text-4xl font-bold text-white/95 mb-2">Terms of Service</h1>
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
                <a href="#contact" className="text-[#5B6CFF] hover:text-[#7B8CFF] text-sm transition-colors">11. Contact</a>
              </nav>
            </div>

            {/* Content */}
            <div className="space-y-8 text-white/[0.78] text-base leading-relaxed" style={{ lineHeight: '1.65' }}>
              <section id="service">
                <h2 className="text-xl font-bold text-white/90 mb-3">1. Service</h2>
                <p>Nexodify AVA Label Compliance Preflight provides automated preflight checks for food labeling and supplier documentation. Primary scope focuses on EU labeling (Regulation (EU) 1169/2011). Optional modules (e.g., Halal export-readiness preflight) may be available.</p>
              </section>

              <section id="not-legal">
                <h2 className="text-xl font-bold text-white/90 mb-3">2. Not legal advice / not certification</h2>
                <p>The Service provides automated preflight flags and is not legal advice, certification, or a substitute for qualified human review. You are responsible for final decisions and compliance.</p>
              </section>

              <section id="responsibilities">
                <h2 className="text-xl font-bold text-white/90 mb-3">3. Your responsibilities</h2>
                <p className="mb-3">You confirm you have the right to upload the files and information you submit.</p>
                <p>You are responsible for the accuracy and completeness of the inputs you provide.</p>
              </section>

              <section id="acceptable-use">
                <h2 className="text-xl font-bold text-white/90 mb-3">4. Acceptable use</h2>
                <p>You agree not to misuse the Service, attempt unauthorized access, interfere with operation, or upload unlawful content.</p>
              </section>

              <section id="ip">
                <h2 className="text-xl font-bold text-white/90 mb-3">5. Intellectual property</h2>
                <p className="mb-3">You retain ownership of the files you upload.</p>
                <p className="mb-3">Nexodify retains ownership of the Service, software, and related intellectual property.</p>
                <p>You grant Nexodify a limited right to process your uploads solely to provide the Service.</p>
              </section>

              <section id="availability">
                <h2 className="text-xl font-bold text-white/90 mb-3">6. Availability</h2>
                <p>We aim to keep the Service available, but uptime is not guaranteed. Maintenance, outages, or changes may occur.</p>
              </section>

              <section id="liability">
                <h2 className="text-xl font-bold text-white/90 mb-3">7. Limitation of liability</h2>
                <p>To the maximum extent permitted by law, Nexodify is not liable for indirect, incidental, special, or consequential damages. Our total liability for any claim related to the Service is limited to the amount you paid to Nexodify in the preceding 3 months (if any).</p>
              </section>

              <section id="termination">
                <h2 className="text-xl font-bold text-white/90 mb-3">8. Termination</h2>
                <p>We may suspend or terminate access if you violate these Terms or misuse the Service.</p>
              </section>

              <section id="changes">
                <h2 className="text-xl font-bold text-white/90 mb-3">9. Changes</h2>
                <p>We may update these Terms from time to time by posting an updated version with a new "Last updated" date.</p>
              </section>

              <section id="governing-law">
                <h2 className="text-xl font-bold text-white/90 mb-3">10. Governing law</h2>
                <p>These Terms are governed by the laws of Italy, without regard to conflict of law principles.</p>
              </section>

              <section id="contact">
                <h2 className="text-xl font-bold text-white/90 mb-3">11. Contact</h2>
                <p>Support: <a href="mailto:nexodifyforyou@gmail.com" className="text-[#5B6CFF] hover:text-[#7B8CFF] transition-colors">nexodifyforyou@gmail.com</a></p>
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
            <Link to="/privacy" className="text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-white/60 hover:text-white/80 transition-colors">Terms</Link>
            <a href="mailto:nexodifyforyou@gmail.com?subject=Nexodify%20AVA%20Support&body=Hi%20Nexodify%20Team%2C%0A%0A%5BDescribe%20your%20issue%5D%0A%0AThanks%2C" className="text-white/40 hover:text-white/70 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
