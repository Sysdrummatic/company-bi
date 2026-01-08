import { Sparkles, ShieldCheck, Globe, BarChart3 } from 'lucide-react';

export const SearchHeader = () => {
  return (
    <div className="space-y-12 text-center max-w-5xl mx-auto">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-foreground shadow-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Intelligence built for deal teams</span>
        </div>

        <h1 className="text-4xl font-heading font-bold tracking-tight text-slate-950 dark:text-foreground md:text-6xl max-w-3xl mx-auto">
          Qualify companies with
          <span className="text-primary"> confidence</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
          Accelerate origination with enriched firmographic data, real-time compliance checks, and market intelligence.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 text-left">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="font-bold">1.2M</span>
          </div>
          <h3 className="font-heading font-semibold text-slate-950 dark:text-foreground">Verified Profiles</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-muted-foreground">Enriched company profiles with full executive coverage and history.</p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-semibold text-slate-950 dark:text-foreground">24/7 Screening</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-muted-foreground">Continuous monitoring across sanctions, PEP, and adverse media lists.</p>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-semibold text-slate-950 dark:text-foreground">360° Intelligence</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-muted-foreground">Deep coverage of growth metrics, hiring velocity, and digital signals.</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          SOC 2 Type II
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          50+ Markets
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          AI Prospecting
        </div>
      </div>
    </div>
  );
};