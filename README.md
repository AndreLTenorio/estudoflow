<div align="center">

# 📚 EstudoFlow

### Controle pessoal de estudos — registre, acompanhe e evolua.

Um app web para você cronometrar sessões de estudo, organizar conteúdos, definir metas
e visualizar sua evolução com gráficos — tudo salvo na nuvem e privado por conta.

[![Acessar o app](https://img.shields.io/badge/▶_Acessar_o_app-6366f1?style=for-the-badge)](https://estudoflow-two.vercel.app)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat)

</div>

---

## ✨ Sobre o projeto

O **EstudoFlow** nasceu para responder uma pergunta simples: _"quanto eu realmente estudei?"_.
Em vez de anotações soltas, ele transforma cada sessão em dados — com cronômetro, histórico,
metas e relatórios — para que você enxergue seus hábitos e melhore de verdade.

Funciona para **estudos**, **exercícios físicos** e **leituras**, com **multiusuário**: cada
pessoa tem sua própria conta e seus dados são totalmente isolados.

🔗 **Demo ao vivo:** https://estudoflow-two.vercel.app

---

## 🚀 Funcionalidades

### ⏱️ Dashboard & Cronômetro
- Cronômetro com **Iniciar / Pausar / Continuar / Parar** — a sessão vira registro automático
- Campo "O que você está estudando?" com **autocomplete** dos seus conteúdos
- Cards de resumo: **Total do período**, **Média diária**, **Dias ativos** e **Sequência (streak)**
- **Gráfico de evolução** (barras/área) por dia, semana, mês ou ano
- **Distribuição por conteúdo** (gráfico de rosca)
- **Calendário de estudos** estilo heatmap (intensidade por horas no dia)
- Meta principal com **anel de progresso**

### 📒 Conteúdos
- CRUD de conteúdos com **ícone** e **cor** personalizados
- **Categorias livres**: crie, edite (nome, cor, ícone) e exclua categorias à vontade
  (vem com Estudos / Exercícios Físicos / Leituras como ponto de partida)
- Total de horas acumuladas em cada conteúdo

### ✅ Tarefas & Kanban (integrados)
- **Lista de tarefas** com adição rápida (Enter), prioridade, prazo, vínculo a um conteúdo e filtros por status
- **Quadro Kanban** estilo Trello com **colunas/status personalizáveis** (criar, renomear, recolorir, **reordenar** e excluir quantos quiser)
- **Arrastar e soltar** os cards entre colunas (desktop) + setas ◂ ▸ (celular)
- **Tarefas recorrentes** (diária / semanal / mensal) — ao concluir, a próxima ocorrência é gerada
- **Checklist** de subitens por tarefa
- **Tempo estimado e utilizado** — ao concluir, o tempo é **lançado no histórico** e conta nos gráficos/contadores
- Lista e quadro **compartilham os mesmos dados** — criou na lista, aparece no quadro

### ⏲️ Pomodoro
- Ciclos de **Foco / Pausa / Pausa longa** configuráveis, com contador de ciclos
- Vincule um conteúdo: ao concluir o foco, o tempo é **lançado no histórico**

### 🗓️ Cronograma
- **Grade semanal editável**: em cada dia, adicione conteúdos com **horário** e **duração**
- Edite, remova ou acrescente itens livremente; ordena por horário e soma o tempo do dia

### 🃏 Flashcards (repetição espaçada)
- Baralhos e cartas (frente/verso) com algoritmo estilo **Anki/SM-2**
- Modo de estudo: **Errei / Difícil / Bom / Fácil** agenda a próxima revisão
- **Estude quando quiser**: todas as cartas ou só as pendentes
- **Escolha a quantidade**: digite o número ou use **25% / 50% / 75% / 100%**
- **Contador de visualizações** por carta; o verso **preserva a formatação** colada
- **Sequência (streak) de dias** estudando — exige 10 revisões/dia quando há +10 cartas

### 🏆 Conquistas (gamificação)
- **XP e níveis** (tempo + tarefas + sequência), **desafio semanal** e **troféus** que desbloqueiam

### 🕓 Histórico
- Lista filtrável por **categoria** e **conteúdo**
- **Seleção múltipla** para exclusão em lote

### 📊 Relatórios & Certificado
- Filtro por período (diário / semanal / mensal / anual)
- Tendência, ranking de **Top Conteúdos**, distribuição por categoria/conteúdo
- **Relatório em PDF** e **Certificado de Horas** com o seu nome (via impressão)

### 🎯 Metas
- Defina metas de horas com **prazo** e acompanhe a % concluída e dias restantes

### ⚙️ Configurações
- **Perfil** (nome + avatar: **foto enviada** ou emoji)
- **Conta**: e-mail, **trocar senha**, **sair**
- **Sincronização na nuvem**: status, recarregar e **copiar backup** (JSON)
- **Tema Claro / Escuro** (com contraste ajustado para conforto visual)

### 🔐 Autenticação
- **Login / Cadastro** por e-mail e senha
- **Login com Google** (OAuth)
- **Esqueci a senha** → link por e-mail → redefinição
- **Logout** retornando à tela de login
- Tela de login com **painel de apresentação animado** (carrossel de benefícios) e **mockups** do produto
- 100% **responsivo** (desktop e celular)

---

## 🛡️ Segurança

- **Row Level Security (RLS)** no banco: cada usuário só lê/grava a própria linha (`auth.uid()`)
- **Dados isolados por conta** — o que um usuário registra nunca aparece para outro
- **Senhas** com hash (bcrypt) gerenciadas pelo Supabase + **confirmação de e-mail**
- **Requisitos de senha**: mínimo 8 caracteres com maiúsculas, minúsculas, números e símbolos
- **Cabeçalhos HTTP de segurança** (via `vercel.json`):
  `Content-Security-Policy`, `X-Frame-Options` (anti-clickjacking), `X-Content-Type-Options`,
  `Strict-Transport-Security` (HSTS), `Referrer-Policy`, `Permissions-Policy`
- **Limite de tamanho** por usuário no banco (defesa contra abuso)
- A chave **anon** (pública) é protegida por RLS; a chave mestra (**service_role**) nunca é exposta no cliente

---

## 🧱 Tech Stack

| Camada | Tecnologia |
|---|---|
| Frontend | **React 18** + **Vite 6** |
| Estilo | **Tailwind CSS 3** |
| Gráficos | **Recharts** |
| Ícones | **lucide-react** |
| Backend / Auth | **Supabase** (PostgreSQL + Auth + RLS) |
| Hospedagem | **Vercel** (deploy automático via Git) |

---

## 🛠️ Rodando localmente

```bash
# 1. Clonar
git clone https://github.com/AndreLTenorio/estudoflow.git
cd estudoflow

# 2. Instalar dependências
npm install

# 3. Rodar em modo desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** 🎉

### Build de produção

```bash
npm run build     # gera a pasta dist/
npm run preview   # pré-visualiza o build localmente
```

---

## 🔑 Variáveis de ambiente

O app funciona com valores padrão embutidos, mas você pode sobrescrever criando um arquivo
`.env` na raiz:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

> A chave `anon` é pública por design (protegida por RLS). Nunca coloque a `service_role` aqui.

---

## 🗄️ Banco de dados

Tabela única por usuário, com RLS:

```sql
create table public.app_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb,
  updated_at timestamptz default now()
);

alter table public.app_data enable row level security;

-- cada usuário só acessa a própria linha
create policy "own_select" on public.app_data for select to authenticated using (auth.uid() = user_id);
create policy "own_insert" on public.app_data for insert to authenticated with check (auth.uid() = user_id);
create policy "own_update" on public.app_data for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_delete" on public.app_data for delete to authenticated using (auth.uid() = user_id);
```

Todo o estado da aplicação (conteúdos, registros, metas, perfil e tema) é salvo como **JSON**
na coluna `data`, com gravação automática (debounce) a cada alteração.

---

## 📁 Estrutura

```
estudoflow/
├── index.html
├── vercel.json              # cabeçalhos de segurança HTTP
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx             # ponto de entrada
    ├── App.jsx              # "portão" de autenticação (sessão → app | login)
    ├── Auth.jsx             # telas Login / Cadastro / Esqueci a senha + carrossel
    ├── ResetPassword.jsx    # redefinição de senha (via link de e-mail)
    ├── EstudoFlow.jsx       # aplicação principal (dashboard, conteúdos, relatórios...)
    ├── supabaseClient.js    # cliente Supabase
    ├── data.js              # camada de dados (load/save por usuário)
    └── index.css            # Tailwind
```

---

## ☁️ Deploy

Hospedado na **Vercel** com **deploy automático**: cada `git push` na branch `main`
publica uma nova versão em produção.

```bash
git add .
git commit -m "sua mensagem"
git push        # → a Vercel builda e publica sozinha
```

---

## 🗺️ Roadmap (ideias futuras)

- [ ] Grupos de estudo (compartilhar progresso / ranking entre amigos)
- [ ] Integração com Google Calendar (provas e prazos)
- [ ] Markdown completo no verso dos flashcards (negrito, listas, títulos)
- [ ] Lembretes e notificações de estudo
- [ ] Autenticação de dois fatores (MFA)
- [ ] Exportar/importar dados (backup em arquivo)

> ℹ️ Para detalhes técnicos, decisões de arquitetura e "pegadinhas" do projeto,
> veja [`CLAUDE.md`](./CLAUDE.md) e [`docs/CHANGELOG.md`](./docs/CHANGELOG.md).

---

## 👤 Autor

**André Luiz Tenório**
🔗 [github.com/AndreLTenorio](https://github.com/AndreLTenorio)

---

## 📄 Licença

Distribuído sob a licença **MIT** — sinta-se livre para usar e adaptar.

<div align="center">

Feito com 💜 e ☕ · **EstudoFlow**

</div>
