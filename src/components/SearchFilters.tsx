import { Search, MapPin, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
}

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'PL', name: 'Poland' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Construction',
  'Transportation',
  'Energy',
  'Education',
  'Real Estate',
];

export const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCountry,
  setSelectedCountry,
  selectedIndustry,
  setSelectedIndustry,
}: SearchFiltersProps) => {
  return (
    <Card className="p-6 shadow-medium animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Search className="h-4 w-4" />
            Company Name or Keywords
          </label>
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="transition-all duration-200 focus:shadow-soft"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Country
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="transition-all duration-200 focus:shadow-soft">
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Building className="h-4 w-4" />
            Industry
          </label>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="transition-all duration-200 focus:shadow-soft">
              <SelectValue placeholder="Select industry..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};