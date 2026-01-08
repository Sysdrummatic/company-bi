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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-hero opacity-30"></div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] animate-pulse-glow rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] h-[40rem] w-[40rem] animate-pulse-glow rounded-full bg-accent/20 blur-[120px] delay-1000"></div>
      </div>

      <div className="relative z-10">
        <header className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <span className="text-xl font-bold">BI</span>
            </div>
            <span className="text-lg font-bold tracking-tight">CompanyBI</span>
          </div>

          <nav className="hidden items-center gap-8 text-muted-foreground md:flex">
            <a href="#" className="font-medium transition hover:text-foreground">Solutions</a>
            <a href="#" className="font-medium transition hover:text-foreground">Data coverage</a>
            <a href="#" className="font-medium transition hover:text-foreground">Pricing</a>
            <a href="#" className="font-medium transition hover:text-foreground">Resources</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden text-muted-foreground md:inline">Witaj, {user?.email}</span>
                <Button variant="ghost" className="rounded-full font-medium" asChild>
                  <Link to="/dashboard">Panel</Link>
                </Button>
                <Button className="rounded-full shadow-md" onClick={handleLogout}>
                  Wyloguj
                </Button>
              </>
            ) : (
              <Button className="group rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105" asChild>
                <Link to="/auth">
                  Zaloguj się
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            )}
          </div>
        </header>

        <main>
          <section className="container mx-auto px-6 pt-10 pb-16 lg:pt-16 lg:pb-24">
            <div className="grid gap-12 lg:grid-cols-[1fr_380px] items-start">
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 w-full">
                <SearchHeader />
              </div>

              <div className="space-y-6 animate-in fade-in delay-200 slide-in-from-bottom-8 duration-500 w-full">
                <div className="glass-panel p-6 rounded-xl">
                  <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Why teams switch</span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.65rem] text-primary">Updated weekly</span>
                  </div>
                  <ul className="mt-6 space-y-5 text-sm">
                    {[
                      { icon: CheckCircle2, title: "Unified workflows", desc: "Instant KYC/KYB checks and automated watchlists.", color: "text-emerald-500" },
                      { icon: Compass, title: "Trusted signals", desc: "Revenue momentum, hiring velocity, and risk alerts.", color: "text-blue-500" },
                      { icon: ArrowUpRight, title: "Built-in collaboration", desc: "Shared notes and CRM syncs keep teams aligned.", color: "text-purple-500" }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/50 ${item.color}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p className="text-muted-foreground leading-snug">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel glass-panel-hover overflow-hidden rounded-xl p-6 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-muted-foreground">Launch faster</p>
                  <h3 className="relative z-10 mt-3 text-2xl font-bold leading-tight text-foreground">Deploy the 2024 origination playbook</h3>
                  <p className="relative z-10 mt-3 text-sm text-muted-foreground">
                    Get curated workflows and scoring templates. Ship a full prospecting workspace in under a week.
                  </p>
                  <div className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
                    Secure early access
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-6 pb-24">
            <Tabs defaultValue="search" className="w-full">
              <div className="flex justify-center mb-10">
                <TabsList className="grid w-full max-w-sm grid-cols-2 rounded-full p-1 h-12 bg-secondary/50 border border-border/50">
                  <TabsTrigger
                    value="search"
                    className="rounded-full text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                  >
                    Company Search
                  </TabsTrigger>
                  <TabsTrigger
                    value="dashboard"
                    className="rounded-full text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                  >
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="search" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-8">
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

              <TabsContent value="dashboard">
                <BusinessDashboard selectedCountry={selectedCountry} />
              </TabsContent>
            </Tabs>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
