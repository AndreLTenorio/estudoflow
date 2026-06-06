# EstudoFlow — Contexto do Projeto (leia antes de mexer)

> Este arquivo é o "cérebro" do projeto. Se a conversa foi compactada ou é uma sessão
> nova, **leia tudo aqui antes de editar**. Mantenha-o atualizado ao fim de cada mudança
> relevante.

## O que é
App web (SPA) de **controle pessoal de estudos**. React + Vite + Tailwind + Recharts +
lucide-react. Backend **Supabase** (Postgres + Auth + RLS). Deploy na **Vercel** (deploy
automático a cada push na `main`).

- **Produção:** https://estudoflow-two.vercel.app
- **Repo:** https://github.com/AndreLTenorio/estudoflow
- **Dono:** André Luiz Tenório (`aluiztenorio@gmail.com`)

## Como rodar
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
npm run preview    # serve o build (porta 4173)
```

## Arquitetura (essencial)
- **Tudo do usuário é um único JSON** salvo na linha dele da tabela `app_data` (Supabase),
  com gravação automática (debounce 1,2s) a cada alteração de estado.
- Arquivos:
  - `src/main.jsx` → monta `App`.
  - `src/App.jsx` → **portão de auth**: sessão indefinida → Splash; `PASSWORD_RECOVERY` →
    `ResetPassword`; sem sessão → `Auth`; com sessão → `EstudoFlow`.
  - `src/Auth.jsx` → Login/Cadastro/Esqueci a senha + carrossel de apresentação.
  - `src/ResetPassword.jsx` → define nova senha (via link de e-mail).
  - `src/EstudoFlow.jsx` → **o app inteiro** (~1700 linhas; todos os módulos, modais, lógica).
  - `src/supabaseClient.js` → cliente Supabase (URL + anon key, com fallback hardcoded).
  - `src/data.js` → `loadUserData(userId)` / `saveUserData(userId, payload)` na tabela `app_data`.
  - `vercel.json` → cabeçalhos de segurança HTTP (CSP, X-Frame-Options, HSTS, etc.).

### Chaves do JSON salvo (estado persistido)
`subjects, records, goals, tasks, columns, schedule, decks, cards, fcDays, fcStats, cats,
pomo, profile, dark`
- `profile` = `{ name, emoji, avatar? }` (avatar = dataURL de foto redimensionada, opcional).
- `columns` = colunas do Kanban `[{id,label,color}]` (a ÚLTIMA coluna = "concluído").
- `cats` = categorias de conteúdo `[{id,label,color,icon}]` (icon = nome de ícone lucide).
- `schedule` = `{ [dia]: [{id,subjectId,start,dur}] }` (dias "Seg".."Dom").
- `pomo` = `{ focus, short, long, untilLong }` (minutos/ciclos).
- `fcDays` = datas (YYYY-MM-DD) em que estudou flashcards; `fcStats` = `{date,reviews}` do dia.
- `cards` (flashcards) usam SM-2: `{ease,interval,reps,due,lapses,views}`.
- localStorage: **nada sensível** (a IA foi removida; não há mais chave de API).

## Supabase
- Projeto: **`nbxizbbhvcukmhsbprvc`** (compartilhado com o app "Velô", org ALTOA Labs).
- Tabela **`app_data`**: `user_id uuid PK → auth.users(id) on delete cascade`, `data jsonb`,
  `updated_at`. **RLS** liga cada operação a `auth.uid() = user_id` (dados isolados por conta).
  Constraint de tamanho ~2MB no `data`.
- **Auth**: e-mail/senha + **Google OAuth** (configurado). Confirmação de e-mail **ON**.
  Política de senha: mín. 8 + maiúscula/minúscula/número/símbolo. Site URL + Redirect URLs
  apontando para a Vercel + localhost (já configurados no painel).
- **Edge Function `ai-generate`**: existe mas está **ÓRFÃ** (a IA foi removida do app).
  Pode ser deletada no painel quando quiser; não é chamada por ninguém.
- "Leaked password protection" é só plano Pro → fica OFF (free).

## Módulos (em `EstudoFlow.jsx`, navegação por `pg`)
Dashboard · Conteúdos · Tarefas · Quadro (Kanban) · Pomodoro · Cronograma · Flashcards ·
Conquistas · Histórico · Relatórios · Configurações · Sobre.
- **Novos usuários** (sem dados) caem no **Sobre** no 1º acesso; recorrentes vão pro Dashboard.
- **Tarefas/Quadro** compartilham os mesmos dados; colunas/status personalizáveis (criar,
  renomear, recolorir, reordenar por arrastar, excluir). Tarefas têm prioridade, prazo,
  recorrência, checklist, tempo estimado/utilizado (ao concluir, lança no histórico) e arquivar.
- **Pomodoro** lança o tempo de foco no histórico (se vinculado a um conteúdo).
- **Cronograma** = grade editável por dia com horário + duração por item.
- **Flashcards** = baralhos + cartas (SM-2). Estudar "todas" ou "só pendentes", escolher
  quantidade (nº ou 25/50/75/100%); contador de views por carta; sequência de dias (streak)
  que exige 10 revisões/dia se houver +10 cartas no total.
- **Conquistas** = XP/nível/troféus/desafio semanal (derivado dos dados) + streak de flashcards.

## ⚠️ Pegadinhas que JÁ causaram tela branca (NÃO repetir)
1. **TDZ no array de deps do `useEffect` de salvar.** Qualquer estado citado no array de
   dependências do efeito de save (linha do `saveUserData(...)`) **precisa ser declarado ANTES**
   do efeito. Por isso há um bloco "Estados usados no efeito de salvar" logo após `columns`,
   no topo do componente. Ao adicionar novo estado persistido: declare-o lá em cima.
2. **Função usada na JSX mas não declarada** (ex.: `pmSkip`) → `ReferenceError` → tela branca.
   O build (vite/esbuild) **NÃO pega** isso; só estoura em runtime.
3. **Tela branca = erro de runtime.** Abrir o Console (F12), achar o texto vermelho. Para
   reproduzir sem a conta real: criar usuário de teste via REST `/auth/v1/signup`, confirmar
   via SQL (`update auth.users set email_confirmed_at=now()`), e usar o Claude Preview
   (`.claude/launch.json` com `npm --prefix C:\estudoflow run preview`). **Apagar o usuário de
   teste depois** (`delete from auth.users where email=...`).
4. Render de ícone dinâmico: usar `const Ic = gI(nomeIcone)` e `<Ic/>` (não `<obj.icon/>` com
   nome string).

## Fluxo de trabalho validado
codegen mental → editar `EstudoFlow.jsx` → `npm run build` (pega sintaxe) → **validar em
runtime no Claude Preview clicando nos módulos** → commit → push (Vercel publica sozinha).
Mensagens de commit em PT-BR, descritivas, com `Co-Authored-By`.

## Convenções de UI
- Tema claro/escuro via estado `dk` + classe `dark` no `<html>` (para scrollbars).
- Tokens: `cd` (card), `tx` (texto), `mu` (texto secundário), `ip` (input). Theme-aware.
- Modais via componente `Mdl` (controlado por `mt`). **Atenção:** o conteúdo dos modais é
  avaliado a cada render (mesmo fechado) — referências quebradas ali derrubam a página.
- Barras de rolagem finas, tema-aware, aparecem no hover (em `index.css`).

## Pendências / ideias futuras
- Grupos de estudo (precisa backend + RLS de compartilhamento).
- Integração Google Calendar (precisa Calendar API + escopo OAuth).
- Markdown de verdade no verso dos flashcards (hoje preserva quebras de linha via `whitespace-pre-wrap`).
- Deletar a Edge Function `ai-generate` (órfã).

## Log de sessões
- **2026-06-06:** projeto criado do zero a partir de um `.tsx` artifact; Supabase novo +
  persistência por usuário (RLS); deploy Vercel + GitHub; auth (e-mail/senha + Google,
  reset/troca de senha, logout); tela de login com carrossel + mockups; contraste claro/escuro;
  cabeçalhos de segurança + limite de tamanho; módulo Sobre (+ 1º acesso); Tarefas + Kanban
  (colunas dinâmicas, drag-and-drop de colunas, recorrência, checklist, tempo, arquivar);
  Pomodoro; Cronograma (depois reescrito como grade editável com horários); Conquistas;
  Flashcards (SM-2, estudo flexível por quantidade/escopo, contador de views, streak com regra
  de 10 cartas); IA (gerador) adicionada e **depois removida** a pedido; categorias de conteúdo
  editáveis; avatar com foto. Dois incidentes de tela branca resolvidos (TDZ e `pmSkip`).
  Barras de rolagem tema-aware.
