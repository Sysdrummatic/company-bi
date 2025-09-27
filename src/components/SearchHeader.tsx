import { Sparkles, ShieldCheck, Globe, BarChart3 } from 'lucide-react';

export const SearchHeader = () => {
  return (
    <div className="space-y-8 text-left">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-white/80 shadow-[0_10px_40px_rgba(15,23,42,0.25)] backdrop-blur">
        <Sparkles className="h-4 w-4 text-business-accent" />
        Intelligence built for deal teams
      </div>

      <div className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
          Discover and qualify companies with
          <span className="bg-gradient-to-r from-business-accent via-sky-400 to-blue-500 bg-clip-text text-transparent">
            {' '}
            confidence
          </span>
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-white/70">
          Accelerate origination with enriched firmographic data, real-time compliance checks, and market intelligence
          tuned to your portfolio strategy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="text-3xl font-semibold text-white">1.2M+</p>
          <p className="mt-1 text-sm">enriched company profiles with executive coverage</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="flex items-center gap-2 text-3xl font-semibold text-white">
            <ShieldCheck className="h-6 w-6 text-emerald-300" />
            24/7
          </p>
          <p className="mt-1 text-sm">screening across sanctions, PEP, and adverse media</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="flex items-center gap-2 text-3xl font-semibold text-white">
            <BarChart3 className="h-6 w-6 text-sky-300" />
            360°
          </p>
          <p className="mt-1 text-sm">coverage of growth, hiring, and digital footprint metrics</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          SOC 2 Type II ready
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-business-accent" />
          50+ emerging markets tracked
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sky-300" />
          AI-assisted prospecting workflows
        </div>
      </div>
    </div>
  );
};