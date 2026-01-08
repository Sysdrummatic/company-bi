import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2, Globe, Users } from 'lucide-react';
import { countryNameToCode, countryCodeToName } from '@/lib/location';
import { useCompanies } from '@/hooks/use-companies';

interface BusinessDashboardProps {
  selectedCountry: string;
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-3 py-2 text-sm shadow-xl border-l-4" style={{ borderLeftColor: payload[0].payload.fill || payload[0].color }}>
        <p className="mb-1 font-semibold text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-muted-foreground">
            {entry.name}: <span className="font-medium text-foreground">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const BusinessDashboard = ({ selectedCountry }: BusinessDashboardProps) => {
  const { data: companies = [], isLoading, isError, error } = useCompanies();

  const industryColors = useMemo(
    () => [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#ef4444', // red-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#06b6d4', // cyan-500
      '#f97316', // orange-500
      '#84cc16', // lime-500
      '#6366f1', // indigo-500
      '#14b8a6', // teal-500
      '#d946ef', // fuchsia-500
    ],
    []
  );

  // Distinct colors for employee sizes to make them distinct bars
  const sizeColors = useMemo(
    () => [
      '#60a5fa', // blue-400
      '#34d399', // emerald-400
      '#fbbf24', // amber-400
      '#f87171', // red-400
      '#a78bfa', // violet-400
      '#f472b6', // pink-400
      '#22d3ee', // cyan-400
      '#fb923c', // orange-400
    ],
    []
  );

  const { industryData, employeeSizeData, countryStats } = useMemo(() => {
    const filteredCompanies =
      selectedCountry && selectedCountry !== 'all'
        ? companies.filter((company) => countryNameToCode(company.country) === selectedCountry)
        : companies;

    const industryCount: Record<string, number> = {};
    filteredCompanies.forEach((company) => {
      industryCount[company.industry] = (industryCount[company.industry] || 0) + 1;
    });

    const industryDataProcessed = Object.entries(industryCount)
      .map(([name, value], index) => ({
        name,
        value,
        color: industryColors[index % industryColors.length],
      }))
      .sort((a, b) => b.value - a.value);

    const sizeCount: Record<string, number> = {};
    filteredCompanies.forEach((company) => {
      const size = company.employee_count;
      sizeCount[size] = (sizeCount[size] || 0) + 1;
    });

    const employeeDataProcessed = Object.entries(sizeCount)
      .map(([name, count], index) => ({
        name,
        companies: count,
        color: sizeColors[index % sizeColors.length]
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const currentYear = new Date().getFullYear();
    const activeCompanies = filteredCompanies.filter((company) => company.status === 'Active').length;
    const newThisYear = filteredCompanies.filter((company) => company.founded_year && company.founded_year >= currentYear - 1).length;
    const avgAge =
      filteredCompanies.length > 0
        ? filteredCompanies.reduce((sum, company) => sum + (company.founded_year ? currentYear - company.founded_year : 0), 0) /
        filteredCompanies.length
        : 0;

    return {
      industryData: industryDataProcessed,
      employeeSizeData: employeeDataProcessed,
      countryStats: {
        totalCompanies: filteredCompanies.length,
        activeCompanies,
        newThisYear,
        averageAge: Math.round(avgAge * 10) / 10,
      },
    };
  }, [companies, selectedCountry, industryColors, sizeColors]);

  const countryName = selectedCountry && selectedCountry !== 'all'
    ? countryCodeToName(selectedCountry)
    : 'All Countries';

  if (isLoading) {
    return (
      <Card className="glass-panel p-8 text-center text-muted-foreground">
        <CardContent>Loading analytics...</CardContent>
      </Card>
    );
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'Unexpected error while loading analytics.';
    return (
      <Card className="glass-panel p-8 text-center text-muted-foreground">
        <CardContent>
          <p className="font-semibold text-foreground">Unable to load analytics</p>
          <p className="mt-2 text-sm">{errorMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold text-foreground">Business Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights for {countryName}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                <p className="text-2xl font-bold text-foreground">{countryStats.totalCompanies.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Companies</p>
                <p className="text-2xl font-bold text-emerald-500">{countryStats.activeCompanies.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New This Year</p>
                <p className="text-2xl font-bold text-violet-500">{countryStats.newThisYear}</p>
              </div>
              <div className="rounded-lg bg-violet-500/10 p-3 text-violet-500">
                <Globe className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel p-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Age</p>
                <p className="text-2xl font-bold text-amber-500">{countryStats.averageAge} years</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3 text-amber-500">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Companies by Industry
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={105}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Companies by Employee Size
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeSizeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  angle={-15}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.2 }} />
                <Bar dataKey="companies" radius={[4, 4, 0, 0]}>
                  {employeeSizeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="glass-panel p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-foreground">Market Insights</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-semibold text-foreground mb-2">Growth Rate</h4>
              <p className="text-2xl font-bold text-emerald-500">+12.3%</p>
              <p className="text-sm text-muted-foreground">Year over year</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-semibold text-foreground mb-2">Average Revenue</h4>
              <p className="text-2xl font-bold text-blue-500">€2.8M</p>
              <p className="text-sm text-muted-foreground">Per company</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-semibold text-foreground mb-2">Employment Rate</h4>
              <p className="text-2xl font-bold text-amber-500">95.4%</p>
              <p className="text-sm text-muted-foreground">Active workforce</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};