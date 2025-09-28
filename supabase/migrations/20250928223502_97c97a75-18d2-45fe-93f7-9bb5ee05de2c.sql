-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  krs_nip_or_hrb TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  description TEXT,
  country TEXT,
  industry TEXT,
  employee_count TEXT,
  founded_year INTEGER,
  address TEXT,
  website TEXT,
  contact_email TEXT,
  phone_number TEXT,
  revenue TEXT,
  management TEXT[] DEFAULT '{}',
  products_and_services TEXT[] DEFAULT '{}',
  technologies_used TEXT[] DEFAULT '{}',
  last_updated DATE DEFAULT CURRENT_DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies
CREATE POLICY "Public companies are viewable by everyone" 
ON public.companies 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view their own companies" 
ON public.companies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" 
ON public.companies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies" 
ON public.companies 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample company data
INSERT INTO public.companies (
  company_name, krs_nip_or_hrb, status, description, country, industry, 
  employee_count, founded_year, address, website, contact_email, phone_number, 
  revenue, management, products_and_services, technologies_used, last_updated, is_public
) VALUES 
('TechFlow Solutions Sp. z o.o.', 'KRS 0000123456', 'Active', 'Software development and IT consulting services', 'Poland', 'Technology', '50-99 employees', 2018, 'ul. Marszałkowska 126, 00-008 Warsaw, Poland', 'http://www.techflowsolutions.pl', 'contact@techflowsolutions.pl', '+48 22 123 45 67', '$5M - $10M', ARRAY['Jan Kowalski', 'Anna Nowak'], ARRAY['Custom software development', 'IT consulting', 'Mobile app development'], ARRAY['Python', 'JavaScript', 'AWS', 'React'], '2025-09-15', true),
('Alpine Healthcare GmbH', 'HRB 98765', 'Active', 'Medical device manufacturing and healthcare solutions', 'Germany', 'Healthcare', '100-249 employees', 2015, 'Maximilianstraße 35, 80539 Munich, Germany', 'http://www.alpine-healthcare.de', 'info@alpine-healthcare.de', '+49 89 987 65 43', '$10M - $50M', ARRAY['Klaus Müller', 'Lena Schmidt'], ARRAY['Surgical instruments', 'Diagnostic equipment', 'Healthcare software'], ARRAY['C++', 'Embedded Systems', 'Cloud Computing'], '2025-09-14', true),
('InnoLogic Solutions Sp. z o.o.', 'KRS 0000219876', 'Active', 'Advanced logistics and supply chain management', 'Poland', 'Logistics', '25-49 employees', 2020, 'ul. Piękna 68, 00-672 Warsaw, Poland', 'http://www.innologic.pl', 'hello@innologic.pl', '+48 22 765 43 21', '$1M - $5M', ARRAY['Piotr Wiśniewski', 'Magdalena Kowalczyk'], ARRAY['Supply chain optimization', 'Warehouse management systems', 'Transportation planning'], ARRAY['Java', 'PostgreSQL', 'Machine Learning'], '2025-09-13', true),
('Nordic Finance AS', 'ORG 912345678', 'Active', 'Financial services and investment management', 'Norway', 'Finance', '250-499 employees', 2010, 'Karl Johans gate 25, 0159 Oslo, Norway', 'http://www.nordicfinance.no', 'contact@nordicfinance.no', '+47 22 12 34 56', '$50M - $100M', ARRAY['Erik Hansen', 'Astrid Larsen'], ARRAY['Investment management', 'Corporate finance', 'Risk assessment'], ARRAY['R', 'Bloomberg Terminal', 'Python'], '2025-09-12', true),
('GreenTech Innovations Ltd', 'CRN 87654321', 'Active', 'Renewable energy solutions and sustainability consulting', 'UK', 'Energy', '100-249 employees', 2017, '123 Green Street, London, W1K 7AB, UK', 'http://www.greentech-innovations.co.uk', 'info@greentech-innovations.co.uk', '+44 20 7123 4567', '$10M - $50M', ARRAY['James Thompson', 'Sarah Williams'], ARRAY['Solar panel installation', 'Wind energy consulting', 'Energy efficiency audits'], ARRAY['IoT', 'Machine Learning', 'Cloud Computing'], '2025-09-11', true);

-- Add more companies to cover all filter options
INSERT INTO public.companies (
  company_name, krs_nip_or_hrb, status, description, country, industry, 
  employee_count, founded_year, address, website, contact_email, phone_number, 
  revenue, management, products_and_services, technologies_used, last_updated, is_public
) VALUES 
('DataFlow Analytics Inc', 'EIN 123456789', 'Active', 'Big data analytics and business intelligence', 'USA', 'Technology', '500-999 employees', 2014, '456 Tech Ave, San Francisco, CA 94102, USA', 'http://www.dataflow-analytics.com', 'contact@dataflow-analytics.com', '+1 415 555 0123', '$100M+', ARRAY['Michael Chen', 'Lisa Rodriguez'], ARRAY['Data analytics', 'Business intelligence', 'Machine learning consulting'], ARRAY['Python', 'Spark', 'Hadoop', 'AWS'], '2025-09-10', true),
('FrenchCorp SARL', 'SIREN 123456789', 'Active', 'Luxury goods manufacturing', 'France', 'Manufacturing', '1000+ employees', 2005, '789 Rue de la Paix, 75001 Paris, France', 'http://www.frenchcorp.fr', 'contact@frenchcorp.fr', '+33 1 42 12 34 56', '$100M+', ARRAY['Pierre Dubois', 'Marie Leclerc'], ARRAY['Luxury handbags', 'Leather goods', 'Fashion accessories'], ARRAY['CAD', 'ERP Systems'], '2025-09-09', true),
('StartupTech', 'REG 987654321', 'Active', 'Early-stage technology startup', 'Canada', 'Technology', '1-10 employees', 2023, '321 Innovation Dr, Toronto, ON M5V 3A1, Canada', 'http://www.startuptech.ca', 'hello@startuptech.ca', '+1 416 555 0987', 'Under $1M', ARRAY['Alex Kim', 'Jordan Taylor'], ARRAY['Mobile apps', 'Web development'], ARRAY['React Native', 'Node.js', 'MongoDB'], '2025-09-08', true),
('MedDevices Australia Pty', 'ACN 123456789', 'Active', 'Medical device research and development', 'Australia', 'Healthcare', '11-24 employees', 2019, '654 Medical St, Sydney, NSW 2000, Australia', 'http://www.meddevices.com.au', 'info@meddevices.com.au', '+61 2 9876 5432', '$1M - $5M', ARRAY['David Brown', 'Emma Wilson'], ARRAY['Diagnostic tools', 'Surgical equipment'], ARRAY['Embedded C', 'MATLAB'], '2025-09-07', true),
('EduTech Solutions AB', 'ORG 556123456', 'Active', 'Educational technology and e-learning platforms', 'Sweden', 'Education', '25-49 employees', 2016, 'Kungsgatan 12, 111 43 Stockholm, Sweden', 'http://www.edutech.se', 'contact@edutech.se', '+46 8 123 456 78', '$5M - $10M', ARRAY['Lars Andersson', 'Anna Johansson'], ARRAY['E-learning platforms', 'Educational apps', 'Training software'], ARRAY['React', 'Node.js', 'PostgreSQL'], '2025-09-06', true);