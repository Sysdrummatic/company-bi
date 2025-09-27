import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Nie udało się zalogować';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Zaloguj się</CardTitle>
          <CardDescription>Uzyskaj dostęp do prywatnych danych i zarządzaj własnymi firmami.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Login</Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Twoja nazwa użytkownika"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Wprowadź hasło"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Nie masz jeszcze konta?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Zarejestruj się
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
