import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchHeader } from '@/components/SearchHeader';
import { SearchFilters } from '@/components/SearchFilters';
import { CompanyResults, SortOption } from '@/components/CompanyResults';
import { BusinessDashboard } from '@/components/BusinessDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CheckCircle2, Compass } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedEmployeeRange, setSelectedEmployeeRange] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');

  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedIndustry('all');
    setSelectedEmployeeRange('all');
    setSelectedStatus('all');
    setSortOption('relevance');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-[-30%] top-[-35%] h-[32rem] rounded-full bg-gradient-to-r from-business-primary/40 via-sky-500/30 to-purple-500/20 blur-[140px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),transparent_60%)]"></div>
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,white,transparent)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
      </div>

      <div className="relative z-10">
        <header className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-semibold text-white">
              BI
            </div>
            <span className="text-base font-semibold tracking-tight text-white">CompanyBI</span>
          </div>

          <nav className="hidden items-center gap-8 text-white/70 md:flex">
            <a href="#" className="transition hover:text-white">
              Solutions
            </a>
            <a href="#" className="transition hover:text-white">
              Data coverage
            </a>
            <a href="#" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#" className="transition hover:text-white">
              Resources
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden text-white/70 md:inline">Witaj, {user?.email}</span>
                <Button variant="ghost" className="text-white/80 hover:text-white" asChild>
                  <Link to="/dashboard">Panel użytkownika</Link>
                </Button>
                <Button className="rounded-full bg-white px-5 py-2 text-slate-900 hover:bg-white/90" onClick={handleLogout}>
                  Wyloguj
                </Button>
              </>
            ) : (
              <>
                <Button className="rounded-full bg-white px-5 py-2 text-slate-900 hover:bg-white/90" asChild>
                  <Link to="/auth">
                    Zaloguj się / Utwórz konto
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <main>
          <section className="container mx-auto grid gap-12 px-6 pb-16 pt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:pb-24 lg:pt-16">
            <SearchHeader />

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_45px_100px_-20px_rgba(15,23,42,0.45)] backdrop-blur">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-white/60">
                  <span>Why teams switch to us</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[0.7rem] tracking-normal text-white/70">Updated weekly</span>
                </div>
                <ul className="mt-6 space-y-5 text-sm text-white/80">
                  <li className="flex gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-business-accent/40 via-sky-500/30 to-purple-500/20 text-white">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Unified due diligence workflows</p>
                      <p className="text-white/60">Instant KYC/KYB checks, beneficial ownership maps, and automated watchlists.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/30 via-sky-400/20 to-cyan-500/20 text-white">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Signals your pipeline can trust</p>
                      <p className="text-white/60">Revenue momentum, hiring velocity, digital adoption, and risk alerts in one stream.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 via-indigo-500/20 to-sky-500/20 text-white">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Collaboration built-in</p>
                      <p className="text-white/60">Shared notes, automated briefings, and CRM syncs keep teams aligned.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_45px_80px_-30px_rgba(56,189,248,0.45)] backdrop-blur">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Launch faster</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">Deploy the 2024 origination playbook</h3>
                <p className="mt-3 text-sm text-white/70">
                  Get curated workflows, scoring templates, and data connectors tailored to your ICP. Invite teammates and
                  ship a full prospecting workspace in under a week.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/80">
                  Secure early access
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-24">
            <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_60px_120px_-45px_rgba(15,23,42,0.8)] backdrop-blur-2xl md:p-10">
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="mx-auto grid w-full max-w-md grid-cols-2 rounded-full border border-white/10 bg-white/5 p-1 text-white/70 backdrop-blur">
                  <TabsTrigger
                    value="search"
                    className="rounded-full px-6 py-2 text-sm font-medium transition data-[state=active]:bg-white data-[state=active]:text-slate-900"
                  >
                    Company Search
                  </TabsTrigger>
                  <TabsTrigger
                    value="dashboard"
                    className="rounded-full px-6 py-2 text-sm font-medium transition data-[state=active]:bg-white data-[state=active]:text-slate-900"
                  >
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="mt-10">
                  <div className="space-y-10">
                    <SearchFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      selectedIndustry={selectedIndustry}
                      setSelectedIndustry={setSelectedIndustry}
                      selectedEmployeeRange={selectedEmployeeRange}
                      setSelectedEmployeeRange={setSelectedEmployeeRange}
                      selectedStatus={selectedStatus}
                      setSelectedStatus={setSelectedStatus}
                      onResetFilters={handleResetFilters}
                    />
                    <CompanyResults
                      searchQuery={debouncedSearchQuery}
                      selectedCountry={selectedCountry}
                      selectedIndustry={selectedIndustry}
                      selectedEmployeeRange={selectedEmployeeRange}
                      selectedStatus={selectedStatus}
                      sortOption={sortOption}
                      onSortChange={setSortOption}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="dashboard" className="mt-10">
                  <BusinessDashboard selectedCountry={selectedCountry} />
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
