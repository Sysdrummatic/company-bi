import { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Calendar, ExternalLink, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [displayedCount, setDisplayedCount] = useState(10);

  useEffect(() => {
    // Only show results if there's a search query or filters applied
    if (!searchQuery && selectedCountry === 'all' && selectedIndustry === 'all') {
      setFilteredCompanies([]);
      return;
    }

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
    setDisplayedCount(10); // Reset to show first 10 companies when filters change
  }, [searchQuery, selectedCountry, selectedIndustry]);

  const checkGoogleMaps = async (company: Company) => {
    const query = `${company.companyName} ${company.address}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">
          Companies Found: {filteredCompanies.length}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCompanies.slice(0, displayedCount).map((company, index) => (
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
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedCompany(company)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => checkGoogleMaps(company)}
                >
                  🗺️ Maps
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {filteredCompanies.length > displayedCount && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={() => setDisplayedCount(prev => prev + 10)}
            className="px-8"
          >
            Show more ({filteredCompanies.length - displayedCount} remaining)
          </Button>
        </div>
      )}

      {filteredCompanies.length === 0 && (searchQuery || selectedCountry !== 'all' || selectedIndustry !== 'all') && (
        <Card className="p-8 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
        </Card>
      )}

      {/* Company Details Modal */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  {selectedCompany.companyName}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Company Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Registration:</strong> {selectedCompany.krsNIPorHRB}</p>
                        <p><strong>Status:</strong> <Badge variant={selectedCompany.status === 'Active' ? 'default' : 'secondary'}>{selectedCompany.status}</Badge></p>
                        <p><strong>Founded:</strong> {selectedCompany.foundedYear}</p>
                        <p><strong>Industry:</strong> {selectedCompany.industry}</p>
                        <p><strong>Employees:</strong> {selectedCompany.employeeCount}</p>
                        <p><strong>Revenue:</strong> {selectedCompany.revenue}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Address:</strong> {selectedCompany.address}</p>
                        <p><strong>Website:</strong> <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{selectedCompany.website}</a></p>
                        <p><strong>Email:</strong> <a href={`mailto:${selectedCompany.contactEmail}`} className="text-primary hover:underline">{selectedCompany.contactEmail}</a></p>
                        <p><strong>Phone:</strong> <a href={`tel:${selectedCompany.phoneNumber}`} className="text-primary hover:underline">{selectedCompany.phoneNumber}</a></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Management</h3>
                      <div className="space-y-1">
                        {selectedCompany.management.map((manager, idx) => (
                          <p key={idx} className="text-sm">{manager}</p>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Products & Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.productsAndServices.map((service, idx) => (
                          <Badge key={idx} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.technologiesUsed.map((tech, idx) => (
                          <Badge key={idx} variant="outline">{tech}</Badge>
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
                  <Button onClick={() => checkGoogleMaps(selectedCompany)} variant="outline">
                    🗺️ Check on Google Maps
                  </Button>
                  <Button onClick={() => window.open(selectedCompany.website, '_blank')} variant="outline">
                    🌐 Visit Website
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">Last updated: {selectedCompany.lastUpdated}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};