# EstudoFlow

Tracker pessoal de estudos (Dashboard, cronômetro, histórico, relatórios/certificado, metas).
React + Vite + Tailwind + Recharts + lucide-react. Persistência via Supabase (REST).

## Rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Supabase

As credenciais (URL + anon key) e a tabela `estudoflow` estão configuradas direto em
`src/EstudoFlow.jsx` (topo do arquivo). Se a conexão falhar, o app usa dados de exemplo
locais e mostra o badge "Offline" — continua funcionando, só não persiste.

Tabela esperada no Supabase:

```sql
create table estudoflow (
  id text primary key,
  data jsonb,
  updated_at timestamptz
);
```
