import { useState } from 'react';
import { SearchHeader } from '@/components/SearchHeader';
import { SearchFilters } from '@/components/SearchFilters';
import { CompanyResults } from '@/components/CompanyResults';
import { BusinessDashboard } from '@/components/BusinessDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <SearchHeader />
        
        <div className="mt-8">
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="search">Company Search</TabsTrigger>
              <TabsTrigger value="dashboard">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-8">
              <div className="space-y-8">
                <SearchFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedIndustry={selectedIndustry}
                  setSelectedIndustry={setSelectedIndustry}
                />
                <CompanyResults
                  searchQuery={searchQuery}
                  selectedCountry={selectedCountry}
                  selectedIndustry={selectedIndustry}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="dashboard" className="mt-8">
              <BusinessDashboard selectedCountry={selectedCountry} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;