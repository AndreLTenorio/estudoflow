# Changelog — EstudoFlow

Histórico legível das entregas. Para contexto técnico/arquitetura, veja `../CLAUDE.md`.

## 2026-06-06 — Construção inicial completa

O projeto foi criado do zero (a partir de um componente `.tsx`) e evoluiu para um
SaaS de estudos multiusuário, no ar em https://estudoflow-two.vercel.app.

### Infraestrutura
- Projeto **Vite + React + Tailwind** rodável; build e deploy validados.
- **Supabase**: tabela `app_data` (1 linha JSON por usuário) com **RLS** (dados isolados por conta).
- **GitHub** (`AndreLTenorio/estudoflow`) + **Vercel** com **deploy automático** a cada push.
- **Cabeçalhos de segurança** HTTP (CSP, X-Frame-Options, HSTS, etc.) via `vercel.json`;
  constraint de tamanho (~2MB) no `data`.

### Autenticação
- Login/cadastro por **e-mail+senha** e **Google OAuth**.
- **Esqueci a senha** (link por e-mail), **redefinir** e **trocar senha**, **logout**.
- Política de senha (mín. 8 + complexidade); confirmação de e-mail ON.
- Tela de login com **carrossel** de apresentação + mockups do produto.

### Módulos
- **Dashboard** (cronômetro, cards de resumo, gráficos, calendário heatmap, meta principal).
- **Conteúdos** com **categorias editáveis** (criar/editar/excluir; cor + ícone).
- **Tarefas + Quadro Kanban** integrados: colunas/status personalizáveis (criar, renomear,
  recolorir, **reordenar arrastando**, excluir); tarefas com prioridade, prazo, **recorrência**,
  **checklist**, **tempo estimado/utilizado** (lança no histórico ao concluir) e **arquivar**.
- **Pomodoro** (foco/pausa configuráveis; lança o tempo de foco no histórico).
- **Cronograma** = grade semanal **editável com horário e duração** por item.
- **Flashcards** (SM-2): estudar **todas ou só pendentes**, escolher **quantidade**
  (nº ou 25/50/75/100%), **contador de visualizações**, verso preserva formatação,
  **sequência de dias** (exige 10 revisões/dia se houver +10 cartas).
- **Conquistas** (XP, níveis, troféus, desafio semanal, streak de flashcards).
- **Histórico**, **Relatórios** (PDF + certificado de horas), **Metas**, **Sobre** (com
  recepção de 1º acesso), **Configurações** (perfil, **avatar com foto**, tema, backup, reset).

### Polimento
- Tema claro/escuro com contraste revisado; **barras de rolagem** finas/tema-aware no hover;
  formatação preservada no verso dos flashcards.

### Idas e vindas
- **Gerador por IA** (texto → flashcards/resumo) foi adicionado (Edge Function `ai-generate`,
  BYOK) e depois **removido** do app a pedido do usuário (função ficou órfã no Supabase).
- Dois incidentes de **tela branca** diagnosticados e corrigidos:
  1. **TDZ** — estado usado no array de deps do `useEffect` de salvar estava declarado depois.
  2. **`pmSkip` não declarado** — função usada na JSX do Pomodoro sem definição.
  (Lição: tela branca = erro de runtime; conferir o Console. Build não pega esses casos.)
