import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useCompanies, useCreateCompany } from '@/hooks/use-companies';
import type { CompanyPayload } from '@/types/company';
import { useToast } from '@/components/ui/use-toast';

const parseList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const buildInitialFormState = useMemo(
    () =>
      () => ({
        companyName: '',
        krsNIPorHRB: '',
        status: '',
        description: '',
        country: '',
        industry: '',
        employeeCount: '',
        foundedYear: String(new Date().getFullYear()),
        address: '',
        website: '',
        contactEmail: '',
        phoneNumber: '',
        revenue: '',
        management: '',
        productsAndServices: '',
        technologiesUsed: '',
        lastUpdated: new Date().toISOString().slice(0, 10),
        isPublic: true,
      }),
    []
  );

  const [formState, setFormState] = useState(buildInitialFormState);

  const {
    data: myCompanies = [],
    isLoading: isLoadingCompanies,
    isError: isCompaniesError,
    error: companiesError,
  } = useCompanies({ mine: true, userId: user?.id, enabled: isAuthenticated });

  const createCompany = useCreateCompany(user?.id);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleInputChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.id) {
      setError('Musisz być zalogowany, aby dodać firmę.');
      return;
    }

    setError(null);

    const payload: CompanyPayload = {
      company_name: formState.companyName.trim(),
      krs_nip_or_hrb: formState.krsNIPorHRB.trim(),
      status: formState.status.trim(),
      description: formState.description.trim(),
      country: formState.country.trim(),
      industry: formState.industry.trim(),
      employee_count: formState.employeeCount.trim(),
      founded_year: Number(formState.foundedYear),
      address: formState.address.trim(),
      website: formState.website.trim(),
      contact_email: formState.contactEmail.trim(),
      phone_number: formState.phoneNumber.trim(),
      revenue: formState.revenue.trim(),
      management: parseList(formState.management),
      products_and_services: parseList(formState.productsAndServices),
      technologies_used: parseList(formState.technologiesUsed),
      is_public: formState.isPublic,
    };

    if (payload.founded_year && !Number.isInteger(payload.founded_year)) {
      setError('Rok założenia musi być liczbą całkowitą.');
      return;
    }

    try {
      await createCompany.mutateAsync(payload);
      toast({ title: 'Dodano firmę', description: 'Wpis został zapisany w bazie danych.' });
      setFormState(buildInitialFormState());
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Nie udało się zapisać firmy';
      setError(message);
    }
  };

  const isSubmitting = createCompany.isPending;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-hero opacity-30"></div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center animate-in-fade">
          <h1 className="text-4xl font-bold tracking-tight">Panel użytkownika</h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Zarządzaj własnymi wpisami i decyduj o tym, czy są widoczne publicznie.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-500">
            <Card className="glass-panel border-0 bg-card/50">
              <CardHeader>
                <CardTitle>Twoje firmy</CardTitle>
                <CardDescription>
                  Poniżej znajdziesz listę firm utworzonych przez konto {user?.email}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingCompanies && <p>Ładowanie danych...</p>}
                {isCompaniesError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {(companiesError instanceof Error ? companiesError.message : 'Nie udało się pobrać listy firm użytkownika')}
                    </AlertDescription>
                  </Alert>
                )}
                {!isLoadingCompanies && !isCompaniesError && myCompanies.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nie dodano jeszcze żadnej firmy. Skorzystaj z formularza po prawej stronie.
                  </p>
                )}
                <div className="space-y-4">
                  {myCompanies.map((company) => (
                    <Card key={company.id} className="border border-border/50 bg-card/60 transition-all hover:bg-card/80">
                      <CardHeader className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg font-bold">{company.company_name}</CardTitle>
                            <CardDescription className="text-primary font-medium">{company.industry}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-right">
                            <Badge variant={company.is_public ? 'default' : 'secondary'}>
                              {company.is_public ? 'Publiczna' : 'Prywatna'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Updated: {company.last_updated ? new Date(company.last_updated).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-foreground/80">
                        <p className="line-clamp-2">{company.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {company.technologies_used.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel h-fit animate-in slide-in-from-right-4 fade-in duration-500 delay-100">
            <CardHeader>
              <CardTitle>Dodaj nową firmę</CardTitle>
              <CardDescription>
                Uzupełnij dane firmy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nazwa firmy</Label>
                    <Input id="companyName" value={formState.companyName} onChange={handleInputChange('companyName')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="krs">KRS / NIP / HRB</Label>
                    <Input id="krs" value={formState.krsNIPorHRB} onChange={handleInputChange('krsNIPorHRB')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" value={formState.status} onChange={handleInputChange('status')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Kraj</Label>
                    <Input id="country" value={formState.country} onChange={handleInputChange('country')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Branża</Label>
                    <Input id="industry" value={formState.industry} onChange={handleInputChange('industry')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Pracownicy</Label>
                    <Input id="employeeCount" value={formState.employeeCount} onChange={handleInputChange('employeeCount')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Rok założenia</Label>
                    <Input id="foundedYear" value={formState.foundedYear} onChange={handleInputChange('foundedYear')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastUpdated">Aktualizacja</Label>
                    <Input id="lastUpdated" type="date" value={formState.lastUpdated} onChange={handleInputChange('lastUpdated')} className="bg-background/50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website">Strona www</Label>
                    <Input id="website" value={formState.website} onChange={handleInputChange('website')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" type="email" value={formState.contactEmail} onChange={handleInputChange('contactEmail')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Telefon</Label>
                    <Input id="phoneNumber" value={formState.phoneNumber} onChange={handleInputChange('phoneNumber')} required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Przychody</Label>
                    <Input id="revenue" value={formState.revenue} onChange={handleInputChange('revenue')} required className="bg-background/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea id="address" value={formState.address} onChange={handleInputChange('address')} required rows={2} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Opis</Label>
                  <Textarea id="description" value={formState.description} onChange={handleInputChange('description')} required rows={4} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="management">Zarząd (po przecinku)</Label>
                  <Textarea id="management" value={formState.management} onChange={handleInputChange('management')} rows={2} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="products">Produkty</Label>
                  <Textarea id="products" value={formState.productsAndServices} onChange={handleInputChange('productsAndServices')} rows={2} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologie</Label>
                  <Textarea id="technologies" value={formState.technologiesUsed} onChange={handleInputChange('technologiesUsed')} rows={2} className="bg-background/50" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-secondary/50">
                  <div>
                    <Label htmlFor="isPublic" className="font-medium">
                      Widoczność publiczna
                    </Label>
                    <p className="text-xs text-muted-foreground">Wpis będzie widoczny dla wszystkich.</p>
                  </div>
                  <Switch id="isPublic" checked={formState.isPublic} onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, isPublic: checked }))} />
                </div>
                <Button type="submit" className="w-full font-bold shadow-soft transition-transform active:scale-95" disabled={isSubmitting}>
                  {isSubmitting ? 'Zapisywanie...' : 'Dodaj firmę'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
