import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2, Globe, Users } from 'lucide-react';
import companiesData from '@/data/database.json';

interface BusinessDashboardProps {
  selectedCountry: string;
}

interface Company {
  companyName: string;
  country: string;
  industry: string;
  employeeCount: string;
  foundedYear: number;
  status: string;
}

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

export const BusinessDashboard = ({ selectedCountry }: BusinessDashboardProps) => {
  const [industryData, setIndustryData] = useState<any[]>([]);
  const [employeeSizeData, setEmployeeSizeData] = useState<any[]>([]);
  const [countryStats, setCountryStats] = useState<any>({
    totalCompanies: 0,
    activeCompanies: 0,
    newThisYear: 0,
    averageAge: 0
  });

  const companies: Company[] = companiesData as Company[];

  useEffect(() => {
    let filteredCompanies = companies;
    
    // Filter by country if selected
    if (selectedCountry && selectedCountry !== 'all') {
      filteredCompanies = companies.filter(company => 
        getCountryCode(company.country) === selectedCountry
      );
    }

    // Calculate industry distribution
    const industryCount: Record<string, number> = {};
    filteredCompanies.forEach(company => {
      industryCount[company.industry] = (industryCount[company.industry] || 0) + 1;
    });

    const industryColors = ['hsl(var(--business-primary))', 'hsl(var(--business-accent))', 'hsl(var(--business-secondary))', 'hsl(var(--business-success))', 'hsl(var(--business-warning))', 'hsl(var(--muted))'];
    const industryDataProcessed = Object.entries(industryCount)
      .map(([name, value], index) => ({
        name,
        value,
        color: industryColors[index % industryColors.length]
      }))
      .sort((a, b) => b.value - a.value);

    setIndustryData(industryDataProcessed);

    // Calculate employee size distribution
    const sizeCount: Record<string, number> = {};
    filteredCompanies.forEach(company => {
      const size = company.employeeCount;
      sizeCount[size] = (sizeCount[size] || 0) + 1;
    });

    const employeeDataProcessed = Object.entries(sizeCount)
      .map(([name, companies]) => ({ name, companies }))
      .sort((a, b) => a.name.localeCompare(b.name));

    setEmployeeSizeData(employeeDataProcessed);

    // Calculate stats
    const activeCompanies = filteredCompanies.filter(c => c.status === 'Active').length;
    const currentYear = new Date().getFullYear();
    const newThisYear = filteredCompanies.filter(c => c.foundedYear >= currentYear - 1).length;
    const avgAge = filteredCompanies.length > 0 
      ? filteredCompanies.reduce((sum, c) => sum + (currentYear - c.foundedYear), 0) / filteredCompanies.length 
      : 0;

    setCountryStats({
      totalCompanies: filteredCompanies.length,
      activeCompanies,
      newThisYear,
      averageAge: Math.round(avgAge * 10) / 10
    });
  }, [selectedCountry]);

  const countryName = selectedCountry ? 
    {'PL': 'Poland', 'DE': 'Germany', 'GB': 'United Kingdom', 'US': 'United States'}[selectedCountry] || selectedCountry
    : 'All Countries';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Business Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights for {countryName}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-2xl font-bold text-foreground">{countryStats.totalCompanies.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-primary rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Companies</p>
                <p className="text-2xl font-bold text-business-success">{countryStats.activeCompanies.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-business-success rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Year</p>
                <p className="text-2xl font-bold text-business-accent">{countryStats.newThisYear}</p>
              </div>
              <div className="p-3 bg-business-accent rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Age</p>
                <p className="text-2xl font-bold text-business-warning">{countryStats.averageAge} years</p>
              </div>
              <div className="p-3 bg-business-warning rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Companies by Industry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Companies by Employee Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeSizeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="companies" fill="hsl(var(--business-primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-accent rounded-lg">
              <h4 className="font-semibold text-accent-foreground mb-2">Growth Rate</h4>
              <p className="text-2xl font-bold text-business-success">+12.3%</p>
              <p className="text-sm text-muted-foreground">Year over year</p>
            </div>
            <div className="p-4 bg-accent rounded-lg">
              <h4 className="font-semibold text-accent-foreground mb-2">Average Revenue</h4>
              <p className="text-2xl font-bold text-business-primary">€2.8M</p>
              <p className="text-sm text-muted-foreground">Per company</p>
            </div>
            <div className="p-4 bg-accent rounded-lg">
              <h4 className="font-semibold text-accent-foreground mb-2">Employment Rate</h4>
              <p className="text-2xl font-bold text-business-accent">95.4%</p>
              <p className="text-sm text-muted-foreground">Active workforce</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};