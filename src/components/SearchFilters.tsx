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
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Company, product, executive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-input text-foreground focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
            Location
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="bg-background border-input text-foreground focus:ring-primary">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select country" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
            Industry
          </label>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="bg-background border-input text-foreground focus:ring-primary">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select industry" />
              </div>
            </SelectTrigger>
            <SelectContent>
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
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
            Size
          </label>
          <Select value={selectedEmployeeRange} onValueChange={setSelectedEmployeeRange}>
            <SelectTrigger className="bg-background border-input text-foreground focus:ring-primary">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Any size" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {EMPLOYEE_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size === 'all' ? 'Any size' : size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 md:col-span-1 xl:col-span-4">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
            Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            {COMPANY_STATUSES.map((status) => (
              <Badge
                key={status}
                variant="outline"
                onClick={() => setSelectedStatus(status)}
                className={`cursor-pointer px-4 py-1.5 rounded-full border transition-all ${selectedStatus === status
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-background hover:bg-secondary text-muted-foreground'
                  }`}
              >
                {status === 'all' ? 'All Statuses' : status}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
              “{searchQuery}”
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-1 rounded-full p-0.5 hover:bg-background/20"
                aria-label="Clear search"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCountry !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
              Country: {selectedCountryLabel}
              <button
                type="button"
                onClick={() => setSelectedCountry('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-background/20"
                aria-label="Clear country filter"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedIndustry !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
              Industry: {selectedIndustry}
              <button
                type="button"
                onClick={() => setSelectedIndustry('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-background/20"
                aria-label="Clear industry filter"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedEmployeeRange !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
              Size: {selectedEmployeeRange}
              <button
                type="button"
                onClick={() => setSelectedEmployeeRange('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-background/20"
                aria-label="Clear employee range filter"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
              Status: {selectedStatus}
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-background/20"
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
            className="text-muted-foreground hover:text-foreground"
            onClick={onResetFilters}
          >
            Reset all
          </Button>
        </div>
      )}
    </div>
  );
};
