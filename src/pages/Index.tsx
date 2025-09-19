import { useState } from 'react';
import { SearchHeader } from '@/components/SearchHeader';
import { SearchFilters } from '@/components/SearchFilters';
import { CompanyResults } from '@/components/CompanyResults';
import { BusinessDashboard } from '@/components/BusinessDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Building2, Globe } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-hero bg-[length:400%_400%] animate-gradient-shift"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-business-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-business-accent/30 rounded-lg animate-float delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-business-secondary/20 rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-business-primary/25 rounded-lg animate-spin-slow"></div>
        
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-business-primary/10 via-transparent to-business-accent/10"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-business-secondary/5 via-transparent to-business-primary/5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-strong">
                <Building2 className="h-12 w-12 text-business-primary animate-pulse-glow" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 bg-gradient-to-r from-business-primary to-business-accent bg-clip-text text-transparent">
              Business Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover, analyze, and connect with companies worldwide through our comprehensive business database
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-medium animate-slide-up">
                <Search className="h-8 w-8 text-business-accent mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Smart Search</h3>
                <p className="text-sm text-muted-foreground">Advanced filtering and real-time search capabilities</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-medium animate-slide-up delay-200">
                <TrendingUp className="h-8 w-8 text-business-success mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Analytics</h3>
                <p className="text-sm text-muted-foreground">Comprehensive business insights and market trends</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-medium animate-slide-up delay-300">
                <Globe className="h-8 w-8 text-business-primary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Global Reach</h3>
                <p className="text-sm text-muted-foreground">Access companies from multiple countries and industries</p>
              </div>
            </div>
          </div>

          {/* Interactive Content */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-strong p-8 animate-slide-up delay-500">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/20 backdrop-blur-sm">
                <TabsTrigger 
                  value="search" 
                  className="data-[state=active]:bg-white/30 data-[state=active]:text-foreground text-muted-foreground"
                >
                  Company Search
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className="data-[state=active]:bg-white/30 data-[state=active]:text-foreground text-muted-foreground"
                >
                  Analytics
                </TabsTrigger>
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
    </div>
  );
};

export default Index;