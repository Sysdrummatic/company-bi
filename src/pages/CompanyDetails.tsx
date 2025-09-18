import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Building2, MapPin, Users, Calendar, Phone, Mail, Globe, DollarSign, User, Code, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (id) {
      const companyIndex = parseInt(id);
      const foundCompany = companiesData[companyIndex] as Company;
      setCompany(foundCompany);
    }
  }, [id]);

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Company not found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>

        <div className="space-y-6">
          {/* Company Header */}
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-primary rounded-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{company.companyName}</CardTitle>
                    <p className="text-muted-foreground">{company.krsNIPorHRB}</p>
                  </div>
                </div>
                <Badge variant={company.status === 'Active' ? 'default' : 'secondary'}>
                  {company.status}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mt-4">{company.description}</p>
            </CardHeader>
          </Card>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-business-accent" />
                  <span>{company.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-business-accent" />
                  <span>{company.industry}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-business-accent" />
                  <span>{company.employeeCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-business-accent" />
                  <span>Founded in {company.foundedYear}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-business-accent" />
                  <span>{company.revenue}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-business-accent mt-0.5" />
                  <span className="text-sm">{company.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-business-accent" />
                  <a href={`tel:${company.phoneNumber}`} className="text-sm hover:text-primary transition-colors">
                    {company.phoneNumber}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-business-accent" />
                  <a href={`mailto:${company.contactEmail}`} className="text-sm hover:text-primary transition-colors">
                    {company.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-business-accent" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                    {company.website}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Management Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {company.management.map((manager, index) => (
                  <Badge key={index} variant="outline">
                    {manager}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Products and Services */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {company.productsAndServices.map((service, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Technologies Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {company.technologiesUsed.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card className="shadow-medium">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                Last updated: {new Date(company.lastUpdated).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;