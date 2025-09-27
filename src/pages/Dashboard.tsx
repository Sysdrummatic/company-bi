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
  const { token, isAuthenticated, isLoading, user } = useAuth();
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
  } = useCompanies({ mine: true, token, enabled: isAuthenticated });

  const createCompany = useCreateCompany(token);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleInputChange = (field: keyof typeof formState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError('Musisz być zalogowany, aby dodać firmę.');
      return;
    }

    setError(null);

    const payload: CompanyPayload = {
      companyName: formState.companyName.trim(),
      krsNIPorHRB: formState.krsNIPorHRB.trim(),
      status: formState.status.trim(),
      description: formState.description.trim(),
      country: formState.country.trim(),
      industry: formState.industry.trim(),
      employeeCount: formState.employeeCount.trim(),
      foundedYear: Number(formState.foundedYear),
      address: formState.address.trim(),
      website: formState.website.trim(),
      contactEmail: formState.contactEmail.trim(),
      phoneNumber: formState.phoneNumber.trim(),
      revenue: formState.revenue.trim(),
      management: parseList(formState.management),
      productsAndServices: parseList(formState.productsAndServices),
      technologiesUsed: parseList(formState.technologiesUsed),
      lastUpdated: formState.lastUpdated ? new Date(formState.lastUpdated).toISOString() : new Date().toISOString(),
      isPublic: formState.isPublic,
    };

    if (!Number.isInteger(payload.foundedYear)) {
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
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center text-white">
          <h1 className="text-3xl font-semibold">Panel użytkownika</h1>
          <p className="mt-2 text-white/70">
            Zarządzaj własnymi wpisami i decyduj o tym, czy są widoczne publicznie.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Twoje firmy</CardTitle>
                <CardDescription>
                  Poniżej znajdziesz listę firm utworzonych przez konto {user?.username}. Prywatne wpisy nie pojawią się na stronie
                  głównej, dopóki nie oznaczysz ich jako publiczne.
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
                    Nie dodano jeszcze żadnej firmy. Skorzystaj z formularza po prawej stronie, aby dodać pierwszą pozycję.
                  </p>
                )}
                <div className="space-y-4">
                  {myCompanies.map((company) => (
                    <Card key={company.id} className="border border-white/10 bg-white/5">
                      <CardHeader className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg text-white">{company.companyName}</CardTitle>
                            <CardDescription>{company.industry}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-right">
                            <Badge variant={company.isPublic ? 'default' : 'secondary'} className={company.isPublic ? '' : 'bg-slate-200 text-slate-900'}>
                              {company.isPublic ? 'Publiczna' : 'Prywatna'}
                            </Badge>
                            <span className="text-xs text-white/60">Ostatnia aktualizacja: {new Date(company.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-white/80">
                        <p>{company.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {company.technologiesUsed.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="outline">
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

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Dodaj nową firmę</CardTitle>
              <CardDescription>
                Uzupełnij dane firmy. Listy (zarząd, produkty, technologie) możesz oddzielić przecinkami. Zmieniaj status prywatności
                w zależności od tego, czy wpis ma być widoczny publicznie.
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
                    <Input id="companyName" value={formState.companyName} onChange={handleInputChange('companyName')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="krs">KRS / NIP / HRB</Label>
                    <Input id="krs" value={formState.krsNIPorHRB} onChange={handleInputChange('krsNIPorHRB')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" value={formState.status} onChange={handleInputChange('status')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Kraj</Label>
                    <Input id="country" value={formState.country} onChange={handleInputChange('country')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Branża</Label>
                    <Input id="industry" value={formState.industry} onChange={handleInputChange('industry')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Liczba pracowników</Label>
                    <Input id="employeeCount" value={formState.employeeCount} onChange={handleInputChange('employeeCount')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Rok założenia</Label>
                    <Input id="foundedYear" value={formState.foundedYear} onChange={handleInputChange('foundedYear')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastUpdated">Data aktualizacji</Label>
                    <Input id="lastUpdated" type="date" value={formState.lastUpdated} onChange={handleInputChange('lastUpdated')} />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website">Strona internetowa</Label>
                    <Input id="website" value={formState.website} onChange={handleInputChange('website')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">E-mail kontaktowy</Label>
                    <Input id="contactEmail" type="email" value={formState.contactEmail} onChange={handleInputChange('contactEmail')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Telefon</Label>
                    <Input id="phoneNumber" value={formState.phoneNumber} onChange={handleInputChange('phoneNumber')} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Przychody</Label>
                    <Input id="revenue" value={formState.revenue} onChange={handleInputChange('revenue')} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea id="address" value={formState.address} onChange={handleInputChange('address')} required rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Opis działalności</Label>
                  <Textarea id="description" value={formState.description} onChange={handleInputChange('description')} required rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="management">Zarząd (lista rozdzielona przecinkami)</Label>
                  <Textarea id="management" value={formState.management} onChange={handleInputChange('management')} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="products">Produkty i usługi</Label>
                  <Textarea id="products" value={formState.productsAndServices} onChange={handleInputChange('productsAndServices')} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologie</Label>
                  <Textarea id="technologies" value={formState.technologiesUsed} onChange={handleInputChange('technologiesUsed')} rows={3} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                  <div>
                    <Label htmlFor="isPublic" className="text-sm font-medium text-white">
                      Widoczność publiczna
                    </Label>
                    <p className="text-xs text-white/70">Po wyłączeniu wpis będzie widoczny tylko dla Ciebie po zalogowaniu.</p>
                  </div>
                  <Switch id="isPublic" checked={formState.isPublic} onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, isPublic: checked }))} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Zapisywanie...' : 'Dodaj firmę'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10 border border-dashed border-white/20 bg-white/5">
          <CardHeader>
            <CardTitle>Import danych przez API</CardTitle>
            <CardDescription>
              Możesz także przesłać wiele firm jednocześnie, wysyłając żądanie POST na <code className="rounded bg-slate-900 px-2 py-0.5">/api/companies/import</code> z tablicą obiektów w formacie JSON.
              Wymagane pola pokrywają się z formularzem powyżej.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            <p>
              Użyj nagłówka <code className="rounded bg-slate-900 px-2 py-0.5">Authorization: Bearer {token ? '...token...' : 'TOKEN'}</code>, aby uwierzytelnić żądanie. Dzięki temu prywatne wpisy pozostaną widoczne tylko dla Ciebie.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
