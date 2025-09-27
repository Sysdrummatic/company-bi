import { Search, MapPin, Building, Users, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COUNTRIES, INDUSTRIES, EMPLOYEE_SIZES, COMPANY_STATUSES } from '@/data/filters';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  selectedEmployeeRange: string;
  setSelectedEmployeeRange: (range: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onResetFilters: () => void;
}

export const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCountry,
  setSelectedCountry,
  selectedIndustry,
  setSelectedIndustry,
  selectedEmployeeRange,
  setSelectedEmployeeRange,
  selectedStatus,
  setSelectedStatus,
  onResetFilters,
}: SearchFiltersProps) => {
  const selectedCountryLabel = COUNTRIES.find((country) => country.code === selectedCountry)?.name || selectedCountry;

  const hasActiveFilters =
    !!searchQuery ||
    selectedCountry !== 'all' ||
    selectedIndustry !== 'all' ||
    selectedEmployeeRange !== 'all' ||
    selectedStatus !== 'all';

  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_35px_80px_-30px_rgba(15,23,42,0.65)] backdrop-blur">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Search className="h-4 w-4" />
            Company Name or Keywords
          </label>
          <Input
            placeholder="Search companies, products, or executives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-white/10 bg-slate-950/60 text-white placeholder:text-white/40 transition-all duration-200 focus-visible:ring-white/20 focus-visible:ring-offset-0"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-white/70">
            <MapPin className="h-4 w-4" />
            Country
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="border-white/10 bg-slate-950/60 text-white transition-all duration-200 focus:ring-white/20 focus:ring-offset-0">
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-slate-950 text-white">
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Building className="h-4 w-4" />
            Industry
          </label>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="border-white/10 bg-slate-950/60 text-white transition-all duration-200 focus:ring-white/20 focus:ring-offset-0">
              <SelectValue placeholder="Select industry..." />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-slate-950 text-white">
              <SelectItem value="all">All Industries</SelectItem>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Users className="h-4 w-4" />
            Employee Range
          </label>
          <Select value={selectedEmployeeRange} onValueChange={setSelectedEmployeeRange}>
            <SelectTrigger className="border-white/10 bg-slate-950/60 text-white transition-all duration-200 focus:ring-white/20 focus:ring-offset-0">
              <SelectValue placeholder="Select employee range..." />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-slate-950 text-white">
              {EMPLOYEE_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size === 'all' ? 'All Company Sizes' : size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-1 xl:col-span-4">
          <label className="flex items-center gap-2 text-sm font-medium text-white/70">
            <ShieldCheck className="h-4 w-4" />
            Company Status
          </label>
          <div className="flex flex-wrap gap-3">
            {COMPANY_STATUSES.map((status) => (
              <Button
                key={status}
                type="button"
                variant="outline"
                size="sm"
                className={`rounded-full border-white/20 px-4 text-white/70 transition hover:bg-white/10 hover:text-white ${
                  selectedStatus === status ? 'bg-white text-slate-900 hover:bg-white hover:text-slate-900' : ''
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {status === 'all' ? 'Any status' : status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-white/60">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/80 backdrop-blur">
              “{searchQuery}”
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                aria-label="Clear search"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCountry !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/80 backdrop-blur">
              Country: {selectedCountryLabel}
              <button
                type="button"
                onClick={() => setSelectedCountry('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                aria-label="Clear country filter"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedIndustry !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/80 backdrop-blur">
              Industry: {selectedIndustry}
              <button
                type="button"
                onClick={() => setSelectedIndustry('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                aria-label="Clear industry filter"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedEmployeeRange !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/80 backdrop-blur">
              Size: {selectedEmployeeRange}
              <button
                type="button"
                onClick={() => setSelectedEmployeeRange('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                aria-label="Clear employee range filter"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white/80 backdrop-blur">
              Status: {selectedStatus}
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-white/20"
                aria-label="Clear status filter"
              >
                ×
              </button>
            </Badge>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-white/70 hover:bg-white/10 hover:text-white"
            onClick={onResetFilters}
          >
            Reset all
          </Button>
        </div>
      )}
    </Card>
  );
};
