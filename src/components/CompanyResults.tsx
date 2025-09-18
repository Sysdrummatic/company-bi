import { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  country: string;
  industry: string;
  address: string;
  employees: string;
  foundedYear: number;
  status: 'Active' | 'Inactive';
  description: string;
}

interface CompanyResultsProps {
  searchQuery: string;
  selectedCountry: string;
  selectedIndustry: string;
}

// Mock data for demonstration
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechFlow Solutions Sp. z o.o.',
    registrationNumber: 'KRS 0000123456',
    country: 'PL',
    industry: 'Technology',
    address: 'ul. Marszałkowska 126, 00-008 Warsaw, Poland',
    employees: '50-99',
    foundedYear: 2018,
    status: 'Active',
    description: 'Software development and IT consulting services'
  },
  {
    id: '2',
    name: 'Alpine Healthcare GmbH',
    registrationNumber: 'HRB 98765',
    country: 'DE',
    industry: 'Healthcare',
    address: 'Maximilianstraße 35, 80539 Munich, Germany',
    employees: '100-249',
    foundedYear: 2015,
    status: 'Active',
    description: 'Medical device manufacturing and healthcare solutions'
  },
  {
    id: '3',
    name: 'Green Energy Ltd.',
    registrationNumber: '12345678',
    country: 'GB',
    industry: 'Energy',
    address: '123 London Bridge St, London SE1 9SG, UK',
    employees: '250-499',
    foundedYear: 2020,
    status: 'Active',
    description: 'Renewable energy solutions and consulting'
  },
  {
    id: '4',
    name: 'Digital Finance Corp.',
    registrationNumber: 'C123456789',
    country: 'US',
    industry: 'Finance',
    address: '456 Wall Street, New York, NY 10005, USA',
    employees: '500+',
    foundedYear: 2012,
    status: 'Active',
    description: 'Fintech solutions and digital banking services'
  },
];

const getCountryName = (code: string) => {
  const countries: Record<string, string> = {
    'PL': 'Poland',
    'DE': 'Germany',
    'GB': 'United Kingdom',
    'US': 'United States',
    'FR': 'France',
    'NL': 'Netherlands',
    'CA': 'Canada',
    'AU': 'Australia',
  };
  return countries[code] || code;
};

export const CompanyResults = ({ searchQuery, selectedCountry, selectedIndustry }: CompanyResultsProps) => {
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(mockCompanies);

  useEffect(() => {
    let filtered = mockCompanies;

    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(company => company.country === selectedCountry);
    }

    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }

    setFilteredCompanies(filtered);
  }, [searchQuery, selectedCountry, selectedIndustry]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">
          Companies Found: {filteredCompanies.length}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg leading-tight">{company.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{company.registrationNumber}</p>
                  </div>
                </div>
                <Badge variant={company.status === 'Active' ? 'default' : 'secondary'}>
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{company.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-business-accent" />
                  <span>{getCountryName(company.country)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-business-accent" />
                  <span>{company.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-business-accent" />
                  <span>{company.employees} employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-business-accent" />
                  <span>Founded {company.foundedYear}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">Address:</p>
                <p className="text-sm">{company.address}</p>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card className="p-8 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
        </Card>
      )}
    </div>
  );
};