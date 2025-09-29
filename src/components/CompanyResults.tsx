import { useState, useMemo, useEffect } from 'react';
import { Building2, MapPin, Users, Calendar, ExternalLink, Filter, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Company } from '@/types/company';
import { countryNameToCode } from '@/lib/location';
import { useCompanies } from '@/hooks/use-companies';

interface CompanyResultsProps {
  searchQuery: string;
  selectedCountry: string;
  selectedIndustry: string;
  selectedEmployeeRange: string;
  selectedStatus: string;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export type SortOption =
  | 'relevance'
  | 'name-asc'
  | 'name-desc'
  | 'founded-newest'
  | 'founded-oldest';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'founded-newest', label: 'Newest companies' },
  { value: 'founded-oldest', label: 'Oldest companies' },
];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'ig'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="bg-business-accent/20 text-foreground rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
};

const computeRelevanceScore = (company: Company, normalizedQuery: string) => {
  if (!normalizedQuery) return 0;
  let score = 0;

  const name = company.company_name?.toLowerCase() || '';
  const description = company.description?.toLowerCase() || '';
  const industry = company.industry?.toLowerCase() || '';
  const address = company.address?.toLowerCase() || '';

  if (name.includes(normalizedQuery)) score += 6;
  if (company.krs_nip_or_hrb?.toLowerCase().includes(normalizedQuery)) score += 4;
  if (description.includes(normalizedQuery)) score += 3;
  if (industry.includes(normalizedQuery)) score += 2;
  if (address.includes(normalizedQuery)) score += 1;

  return score;
};

export const CompanyResults = ({
  searchQuery,
  selectedCountry,
  selectedIndustry,
  selectedEmployeeRange,
  selectedStatus,
  sortOption,
  onSortChange,
}: CompanyResultsProps) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [displayedCount, setDisplayedCount] = useState(10);
  const { data: companies = [], isLoading, isError, error } = useCompanies();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesQuery = normalizedQuery
        ? company.company_name?.toLowerCase().includes(normalizedQuery) ||
          company.description?.toLowerCase().includes(normalizedQuery) ||
          company.products_and_services?.some((service) => service.toLowerCase().includes(normalizedQuery)) ||
          company.technologies_used?.some((tech) => tech.toLowerCase().includes(normalizedQuery))
        : true;

      const matchesCountry = selectedCountry === 'all'
        ? true
        : countryNameToCode(company.country || '') === selectedCountry;

      const matchesIndustry = selectedIndustry === 'all'
        ? true
        : company.industry === selectedIndustry;

      const matchesEmployeeRange = selectedEmployeeRange === 'all'
        ? true
        : company.employee_count === selectedEmployeeRange;

      const matchesStatus = selectedStatus === 'all'
        ? true
        : company.status === selectedStatus;

      return matchesQuery && matchesCountry && matchesIndustry && matchesEmployeeRange && matchesStatus;
    });
  }, [companies, normalizedQuery, selectedCountry, selectedIndustry, selectedEmployeeRange, selectedStatus]);

  const sortedCompanies = useMemo(() => {
    const companiesWithScore = filteredCompanies.map((company) => ({
      company,
      score: computeRelevanceScore(company, normalizedQuery),
    }));

    return companiesWithScore
      .sort((a, b) => {
        switch (sortOption) {
          case 'name-asc':
            return a.company.company_name.localeCompare(b.company.company_name);
          case 'name-desc':
            return b.company.company_name.localeCompare(a.company.company_name);
          case 'founded-newest':
            return (b.company.founded_year || 0) - (a.company.founded_year || 0);
          case 'founded-oldest':
            return (a.company.founded_year || 0) - (b.company.founded_year || 0);
          case 'relevance':
          default:
            return b.score - a.score;
        }
      })
      .map(({ company }) => company);
  }, [filteredCompanies, normalizedQuery, sortOption]);

  const summary = useMemo(() => {
    const activeCompanies = filteredCompanies.filter((company) => company.status === 'Active').length;
    const uniqueCountries = new Set(filteredCompanies.map((company) => company.country));
    const uniqueIndustries = new Set(filteredCompanies.map((company) => company.industry));

    return {
      activeCompanies,
      totalCountries: uniqueCountries.size,
      totalIndustries: uniqueIndustries.size,
    };
  }, [filteredCompanies]);

  useEffect(() => {
    setDisplayedCount(10);
    setSelectedCompany(null);
  }, [filteredCompanies, sortOption]);

  const visibleCompanies = sortedCompanies.slice(0, displayedCount);

  const shouldRenderResults =
    normalizedQuery.length > 0 ||
    selectedCountry !== 'all' ||
    selectedIndustry !== 'all' ||
    selectedEmployeeRange !== 'all' ||
    selectedStatus !== 'all';

  const remainingCount = Math.max(sortedCompanies.length - displayedCount, 0);

  const openMaps = (company: Company) => {
    const query = `${company.company_name} ${company.address}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapsUrl, '_blank');
  };

  if (!shouldRenderResults) {
    return (
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70 shadow-[0_35px_80px_-30px_rgba(15,23,42,0.65)] backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-semibold text-white">
            <Sparkles className="h-6 w-6 text-sky-300" />
            Start exploring companies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-white/70">
          <p>Use the search panel above to filter by country, industry, size, and status.</p>
          <p className="text-sm">Tip: combine keywords with filters to surface highly targeted results.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Loading company data...</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-white/60">Please wait while we synchronise data from the database.</CardContent>
      </Card>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error while loading companies.';
    return (
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Unable to load companies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-white/60">
          <p>{errorMessage}</p>
          <p>Verify that the API server is running and reachable, then try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Showing {visibleCompanies.length} of {sortedCompanies.length} companies
          </h2>
          <p className="text-sm text-white/60">
            {summary.activeCompanies.toLocaleString()} active companies · {summary.totalCountries} countries · {summary.totalIndustries} industries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-white/60" aria-hidden="true" />
          <Select value={sortOption} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[210px] border-white/10 bg-slate-950/60 text-white focus:ring-white/20 focus:ring-offset-0">
              <SelectValue placeholder="Sort results" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-slate-950 text-white">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {visibleCompanies.map((company) => (
          <Card
            key={company.id}
            className="rounded-3xl border border-white/10 bg-slate-950/60 text-white/80 shadow-[0_35px_80px_-30px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_45px_100px_-30px_rgba(56,189,248,0.35)]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-business-accent/40 via-sky-500/30 to-purple-500/20 p-2">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg leading-tight text-white">
                      {highlightMatch(company.company_name, normalizedQuery)}
                    </CardTitle>
                    <p className="text-sm text-white/60">
                      {highlightMatch(company.krs_nip_or_hrb || '', normalizedQuery)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`border-white/20 px-3 py-1 text-xs font-medium ${
                    company.status === 'Active'
                      ? 'bg-emerald-400/20 text-emerald-200'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {company.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="line-clamp-3 text-sm text-white/70">
                {highlightMatch(company.description || '', normalizedQuery)}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-300" />
                  <span>{company.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-sky-300" />
                  <span>{company.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-300" />
                  <span>{company.employee_count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-sky-300" />
                  <span>Founded {company.founded_year}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {company.products_and_services?.slice(0, 3).map((service) => (
                  <Badge key={service} variant="outline" className="border-white/20 text-xs text-white/70">
                    {service}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/20 text-white/80 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setSelectedCompany(company)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View details
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => openMaps(company)}
                >
                  🗺️ Maps
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {remainingCount > 0 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setDisplayedCount((prev) => prev + 10)}
            className="px-8 border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
          >
            Show more ({remainingCount} remaining)
          </Button>
        </div>
      )}

      {sortedCompanies.length === 0 && (
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/70 backdrop-blur">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-white/40" />
          <h3 className="mb-2 text-lg font-medium text-white">No companies found</h3>
          <p className="text-sm">
            Refine your filters or broaden the search criteria to discover more businesses.
          </p>
        </Card>
      )}

      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  {selectedCompany.company_name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Company Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Registration:</strong> {selectedCompany.krs_nip_or_hrb}</p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <Badge variant={selectedCompany.status === 'Active' ? 'default' : 'secondary'}>
                            {selectedCompany.status}
                          </Badge>
                        </p>
                        <p><strong>Founded:</strong> {selectedCompany.founded_year}</p>
                        <p><strong>Industry:</strong> {selectedCompany.industry}</p>
                        <p><strong>Employees:</strong> {selectedCompany.employee_count}</p>
                        <p><strong>Revenue:</strong> {selectedCompany.revenue}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Address:</strong> {selectedCompany.address}</p>
                        <p>
                          <strong>Website:</strong>{' '}
                          <a
                            href={selectedCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {selectedCompany.website}
                          </a>
                        </p>
                        <p>
                          <strong>Email:</strong>{' '}
                          <a href={`mailto:${selectedCompany.contact_email}`} className="text-primary hover:underline">
                            {selectedCompany.contact_email}
                          </a>
                        </p>
                        <p>
                          <strong>Phone:</strong>{' '}
                          <a href={`tel:${selectedCompany.phone_number}`} className="text-primary hover:underline">
                            {selectedCompany.phone_number}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Management</h3>
                      <div className="space-y-1">
                        {selectedCompany.management?.map((manager) => (
                          <p key={manager} className="text-sm">
                            {manager}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Products & Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.products_and_services?.map((service) => (
                          <Badge key={service} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.technologies_used?.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedCompany.description}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => openMaps(selectedCompany)} variant="outline">
                    🗺️ Check on Google Maps
                  </Button>
                  <Button onClick={() => window.open(selectedCompany.website, '_blank')} variant="outline">
                    🌐 Visit Website
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">Last updated: {selectedCompany.last_updated}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
