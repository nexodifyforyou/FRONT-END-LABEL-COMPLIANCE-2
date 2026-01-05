import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Check,
  FileSearch,
  Zap,
  Globe,
  FileText,
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'AI-Powered Analysis',
    description: 'Advanced OCR and compliance checking against FDA, EU, and international standards.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get comprehensive compliance reports in under 30 seconds.',
  },
  {
    icon: Globe,
    title: 'Multi-Region Support',
    description: 'Validate labels for US, EU, UK, Canada, Australia, and more.',
  },
  {
    icon: FileText,
    title: 'Detailed Reports',
    description: 'Downloadable PDF reports with actionable fixes and regulatory citations.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-slate-900" />
              <span className="text-xl font-semibold text-slate-900 font-heading">Nexodify</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-slate-900 hover:bg-slate-800" data-testid="get-started-btn">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Trusted by 500+ brands
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 font-heading tracking-tight leading-tight">
                Label Compliance
                <br />
                <span className="text-indigo-600">Made Simple</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                AVA automatically audits your food and supplement labels against FDA, EU, and international regulations. Get instant compliance reports and actionable fixes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 h-12 px-6">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="h-12 px-6">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  5 free audits
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-sm p-8 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1652096268855-e05fe8790fb0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxmb29kJTIwc2FmZXR5JTIwbGFib3JhdG9yeSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3Njc2MjY4NzR8MA&ixlib=rb-4.1.0&q=85"
                  alt="Food safety professional"
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-sm shadow-lg p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">FDA Compliant</div>
                    <div className="text-xs text-slate-500">98% accuracy</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 font-heading tracking-tight">
              Everything you need for label compliance
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              AVA combines advanced AI with regulatory expertise to streamline your compliance workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-sm border border-slate-200 p-6"
              >
                <div className="w-12 h-12 rounded-sm bg-slate-100 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 font-heading">{feature.title}</h3>
                <p className="mt-2 text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 font-heading tracking-tight">
            Ready to ensure compliance?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Join hundreds of brands using AVA to streamline their label compliance process.
          </p>
          <Link to="/register">
            <Button size="lg" className="mt-8 bg-slate-900 hover:bg-slate-800 h-12 px-8">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-slate-400" />
              <span className="text-slate-600">© 2025 Nexodify. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <Link to="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link to="/terms" className="hover:text-slate-900">Terms</Link>
              <a href="mailto:support@nexodify.com" className="hover:text-slate-900">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
