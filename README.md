# Test Lovable project

## Published site

**URL**: [Company BI](https://companybi.lovable.app/)

## About project

The simple one page project of a company browser. Based on Google's course materials I tried to build the simple web page with Lovable. The current project's database is stored in a JSON file. The test went very smooth because the creation process took about 30 mins from start to publishing.

---

## Project info

**URL**: [Lovable project](https://lovable.dev/projects/6916cf2d-a59a-4fe4-99c9-21093a597173)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6916cf2d-a59a-4fe4-99c9-21093a597173) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Seed the SQLite database from the bundled JSON dataset.
npm run db:seed

# Step 5: Start the API server (exposes http://localhost:4000 by default).
npm run server

# Step 6: Start the Vite development server with auto-reloading and an instant preview.
npm run dev
```

> The frontend expects the API to be reachable at `http://localhost:4000`. You can change this by setting a `VITE_API_BASE_URL`
> environment variable before running the Vite dev server or building the app.

## Authentication and working with private data

- Strona główna jest dostępna publicznie i prezentuje wyłącznie firmy oznaczone jako publiczne.
- Zarejestrowani użytkownicy mogą logować się, dodawać nowe firmy i decydować, czy dane mają być widoczne publicznie.
- Po zalogowaniu panel użytkownika jest dostępny pod adresem [`/dashboard`](http://localhost:5173/dashboard) i pozwala na dodawanie wpisów przez formularz.

### Rejestracja i logowanie przez API

```sh
# Rejestracja nowego użytkownika
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"twoj_login","password":"twoje_haslo"}'

# Logowanie i pobranie tokenu sesji
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"twoj_login","password":"twoje_haslo"}'
```

Każda odpowiedź zwraca token (pole `token`), który należy przekazywać w nagłówku `Authorization: Bearer TOKEN` przy wywoływaniu chronionych endpointów.

### Dodawanie firm z wykorzystaniem API

```sh
curl -X POST http://localhost:4000/api/companies \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN' \
  -d '{
        "companyName": "Moja Firma",
        "krsNIPorHRB": "1234567890",
        "status": "Active",
        "description": "Opis działalności",
        "country": "Poland",
        "industry": "Technology",
        "employeeCount": "51-200",
        "foundedYear": 2020,
        "address": "ul. Przykładowa 1, 00-000 Warszawa",
        "website": "https://example.com",
        "contactEmail": "contact@example.com",
        "phoneNumber": "+48 123 456 789",
        "revenue": "5M PLN",
        "management": ["Jan Kowalski", "Anna Nowak"],
        "productsAndServices": ["Produkt A", "Usługa B"],
        "technologiesUsed": ["React", "Node.js"],
        "lastUpdated": "2024-01-01T00:00:00.000Z",
        "isPublic": true
      }'
```

### Import wielu firm w jednym żądaniu

```sh
curl -X POST http://localhost:4000/api/companies/import \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN' \
  -d '{"companies": [ { ... }, { ... } ]}'
```

Endpoint `/api/companies?mine=true` zwraca pełną listę firm utworzonych przez zalogowanego użytkownika – zarówno publicznych, jak i prywatnych.

> ⚠️ Polecenie `npm run db:seed` usuwa wszystkie dotychczasowe wpisy firm (łącznie z prywatnymi) i czyści aktywne sesje. Użytkownicy pozostają zapisani, ale będą musieli zalogować się ponownie.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
