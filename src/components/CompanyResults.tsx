import { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import companiesData from '@/data/database.json';

interface Company {
  companyName: string;
  krsNIPorHRB: string;
  status: string;
  description: string;
  country: string;
  industry: string;
  employeeCount: string;
  foundedYear: number;
  address: string;
  website: string;
  contactEmail: string;
  phoneNumber: string;
  revenue: string;
  management: string[];
  productsAndServices: string[];
  technologiesUsed: string[];
  lastUpdated: string;
}

interface CompanyResultsProps {
  searchQuery: string;
  selectedCountry: string;
  selectedIndustry: string;
}

const companies: Company[] = companiesData as Company[];

const getCountryCode = (countryName: string) => {
  const countries: Record<string, string> = {
    'Poland': 'PL',
    'Germany': 'DE', 
    'United Kingdom': 'GB',
    'United States': 'US',
    'France': 'FR',
    'Netherlands': 'NL',
    'Canada': 'CA',
    'Australia': 'AU',
  };
  return countries[countryName] || countryName;
};

export const CompanyResults = ({ searchQuery, selectedCountry, selectedIndustry }: CompanyResultsProps) => {
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companies);

  useEffect(() => {
    let filtered = companies;

    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCountry && selectedCountry !== 'all') {
      filtered = filtered.filter(company => getCountryCode(company.country) === selectedCountry);
    }

    if (selectedIndustry && selectedIndustry !== 'all') {
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
        {filteredCompanies.map((company, index) => (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg leading-tight">{company.companyName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{company.krsNIPorHRB}</p>
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
                  <span>{company.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-business-accent" />
                  <span>{company.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-business-accent" />
                  <span>{company.employeeCount}</span>
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
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(`/company/${index}`, '_blank')}
              >
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