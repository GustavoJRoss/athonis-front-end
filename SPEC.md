# ATHONIS — Spec de Execução (Implementação)

> Este documento é a spec operacional para construir o ATHONIS a partir de um projeto Next.js zerado.
> Baseado no documento de produto/UX original (ver seção 12 para referência completa dos requisitos de produto).
> Execute as fases **em ordem**. Cada fase depende da anterior. Não pule para módulos de domínio antes de fechar a fundação (tokens → primitives → components → shell → auth).

---

## 0. Como usar esta spec

Este arquivo foi desenhado para ser executado com Claude Code, fase por fase.

**Fluxo recomendado por fase:**
1. Abra a sessão e peça: `Leia SPEC.md, fase N, e monte um plano de implementação` (plan mode ligado).
2. Revise o plano.
3. Rode com `/goal` usando os critérios de aceite da fase como condição, por exemplo:
   ```
   /goal completar a Fase 2 (Primitives) do SPEC.md: todos os componentes listados existem,
   `npm run build` passa sem erros e `npm run lint` está limpo. Pare após 25 turnos se não convergir.
   ```
4. Ao fechar uma fase, marque os checkboxes abaixo antes de avançar.

Não avance de fase com o build quebrado ou com lint sujo — cada fase é a fundação da próxima.

---

## 1. Stack e decisões técnicas (fixas para todo o projeto)

| Camada | Escolha |
|---|---|
| Framework | Next.js (App Router) |
| Linguagem | TypeScript (strict mode) |
| Estilo | Tailwind CSS |
| Camada headless/acessibilidade | Ark UI (https://ark-ui.com/) — comportamento apenas, **nunca** estilo visual |
| Server state | TanStack Query |
| Formulários | React Hook Form |
| Validação | Zod |
| Auth | JWT (login, sessão, rotas protegidas) |
| Ícones | uma única biblioteca consistente (definir na Fase 0 e não trocar depois) |

Princípio inegociável: **Ark UI = comportamento. ATHONIS Design System = aparência.** Nenhum componente deve herdar classes visuais de biblioteca externa.

Estrutura de pastas alvo (criar já na Fase 0):

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/login/
│   └── (app)/{dashboard,orders,routes,customers,drivers,vehicles,analytics}/
├── components/
│   ├── ui/{button,input,select,dialog,...}
│   ├── layout/
│   ├── charts/
│   ├── tables/
│   └── domain/
├── features/{auth,orders,routes,customers,drivers,vehicles,analytics}/
├── lib/{auth,api,validation,utils}/
├── hooks/
├── types/
├── constants/
└── styles/
```

---

## Fase 0 — Bootstrap do projeto

**Objetivo:** projeto Next.js rodando, com toolchain e estrutura de pastas prontas, sem nenhuma feature ainda.

Tasks:
- [ ] Criar projeto Next.js (App Router, TypeScript strict, Tailwind)
- [ ] Instalar e configurar: Ark UI, TanStack Query, React Hook Form, Zod, biblioteca de ícones
- [ ] Configurar ESLint + formatação consistente (Prettier ou equivalente)
- [ ] Criar a estrutura de pastas descrita acima (mesmo que vazia, com `.gitkeep` ou arquivos placeholder)
- [ ] Configurar QueryClientProvider e providers globais em `app/layout.tsx`

Critérios de aceite:
- `npm run dev` sobe sem erro
- `npm run build` passa sem erro
- `npm run lint` sem warnings/erros
- Estrutura de pastas da seção 1 existe

---

## Fase 1 — Design Tokens

**Objetivo:** todo valor visual (cor, espaçamento, radius, tipografia) vem de token, zero hardcode.

Tasks:
- [ ] Tokens de cor semânticos: `background`, `foreground`, `surface`, `surface-muted`, `surface-hover`, `surface-active`, `border`, `border-subtle`, `primary`, `primary-hover`, `primary-active`, `secondary`, `success`, `warning`, `danger`, `info`, `muted`
- [ ] Escala tipográfica: Display, Heading 1–4, Body Large, Body, Body Small, Caption, Label
- [ ] Escala de spacing consistente (sem valores arbitrários no restante do projeto)
- [ ] Tokens de radius: `radius-sm`, `radius-md`, `radius-lg`, `radius-xl`, `radius-full`
- [ ] Política de shadow: reservada só para dropdown/popover/dialog/menu/elementos flutuantes; documentar isso em comentário no arquivo de tokens
- [ ] Documentar os tokens (arquivo `styles/tokens.md` ou similar) para consulta durante as próximas fases

Critérios de aceite:
- Nenhuma cor, espaçamento ou radius hardcoded existe no repo fora do arquivo de tokens (grep não encontra hex/rgb soltos em componentes)
- Tokens expostos como classes utilitárias Tailwind (ex: `bg-primary`, `text-muted`, `border-default`)

---

## Fase 2 — Primitives

**Objetivo:** blocos de layout puros, sem lógica de domínio, que tudo depois vai compor.

Tasks:
- [ ] `Box`, `Stack`, `Inline`, `Grid`, `Container`, `Separator`, `Text`, `Heading`, `Icon`

Critérios de aceite:
- Cada primitive aceita apenas tokens (nenhuma prop de estilo arbitrário tipo `style={{}}`)
- Build e lint passam

---

## Fase 3 — Componentes Primary

**Objetivo:** componentes de interação base do Design System, usando Ark UI para comportamento.

Tasks:
- [ ] `Button` — variantes (Primary, Secondary, Tertiary, Ghost, Destructive) × tamanhos (Small, Medium, Large) × estados (Default, Hover, Active, Focus, Disabled, Loading)
- [ ] `Input` — label, description, placeholder, error, disabled, loading, prefix, suffix, clear, validação
- [ ] `Select` — busca, múltipla seleção, loading, empty state, disabled, error (Ark UI behavioral layer)
- [ ] `Checkbox` — estados completos e acessíveis
- [ ] `Radio` — estados completos e acessíveis
- [ ] `Switch` — On, Off, Disabled, Loading
- [ ] `Textarea` — mesmo sistema visual do Input
- [ ] `DatePicker`
- [ ] `Dialog` — header, title, description, content, footer, close, loading
- [ ] `Drawer`
- [ ] `Popover`
- [ ] `Tooltip`

Critérios de aceite:
- Cada componente tem uma página/rota de demonstração isolada (ex: `app/(dev)/components/page.tsx`) mostrando todas as variantes e estados, para revisão visual antes de seguir
- Navegação por teclado e estados de foco funcionam em todos
- Build e lint passam

---

## Fase 4 — Componentes Secondary

**Objetivo:** composições que serão realmente usadas nas telas de domínio.

Tasks:
- [ ] `DataTable` — sorting, filtering, pagination, row selection, bulk actions, column visibility, empty/loading/error state, responsivo, ações por linha, status/badges, menu contextual
- [ ] `SearchInput`
- [ ] `FilterBar`, `FilterChip`
- [ ] `StatusBadge`
- [ ] `MetricCard`
- [ ] `EmptyState`, `ErrorState`, `LoadingState`
- [ ] `Pagination`
- [ ] `Breadcrumb`
- [ ] `Tabs`
- [ ] `DropdownMenu`, `CommandMenu` (command palette)
- [ ] `Notification`/`Toast`
- [ ] `Avatar`, `UserMenu`
- [ ] `PageHeader`, `SectionHeader`
- [ ] `ConfirmDialog`
- [ ] `FormField`, `FormSection`

Critérios de aceite:
- `DataTable` funciona com dados mockados (ver Fase 9 para mocks reais) cobrindo os 3 estados: com dados, empty, error
- Todos os componentes secondary são compostos a partir de primitives + primary (nenhum reimplementa comportamento do zero)
- Build e lint passam

---

## Fase 5 — Application Shell

**Objetivo:** casca da aplicação logada (sidebar + topbar + área de conteúdo), sem nenhuma tela de domínio ainda.

Tasks:
- [ ] Layout: Topbar fixa + Sidebar + Main Content
- [ ] Sidebar: itens (Dashboard, Pedidos, Rotas, Clientes, Motoristas, Veículos, Indicadores, Configurações), estado expandido/collapsed, navegação ativa, ícones, tooltips no estado collapsed
- [ ] Topbar: breadcrumb, busca global, notificações, avatar/menu da conta
- [ ] Mobile: sidebar vira drawer

Critérios de aceite:
- Shell renderiza em `/(app)/*` com navegação funcional entre as rotas placeholder de cada módulo
- Responsivo: sidebar colapsa para drawer em viewport mobile
- Build e lint passam

---

## Fase 6 — Autenticação

**Objetivo:** login funcional com JWT e proteção real de rotas.

Tasks:
- [ ] Tela de login (usa Input, Button, form com RHF + Zod)
- [ ] Fluxo: login → validação → JWT → sessão → protected routes
- [ ] Logout
- [ ] Persistência de sessão e expiração de token
- [ ] Tratamento de token inválido/expirado com redirecionamento
- [ ] Loading state durante autenticação
- [ ] Estados: credenciais inválidas, sessão expirada, usuário não autorizado, erro de autenticação
- [ ] Separação clara em `lib/auth/`: authentication, authorization, session, user

Critérios de aceite:
- Rotas dentro de `(app)/` são inacessíveis sem sessão válida (redirect para login)
- Token expirado força novo login
- Build e lint passam

---

## Fase 7 — Módulos de domínio

Execute cada módulo como uma sub-tarefa própria (pode rodar um `/goal` por módulo). Todos seguem o mesmo padrão: Page Header + busca + filtros + `DataTable` + paginação + criação/edição + detalhes.

### 7.1 Dashboard
- [ ] Indicadores: pedidos hoje, entregas concluídas, entregas pendentes, entregas atrasadas, rotas ativas, motoristas ativos, taxa de entrega
- [ ] Gráficos: evolução de pedidos, status das entregas, performance das rotas, distribuição de entregas — usando o mesmo Design System (nenhuma lib de chart "solta" visualmente)

### 7.2 Pedidos
- [ ] Campos: Pedido, Cliente, Origem, Destino, Data, Janela de entrega, Motorista, Rota, Status
- [ ] Status: Pendente, Planejado, Em rota, Entregue, Atrasado, Cancelado
- [ ] Listagem, criação, edição, detalhes (página ou modal)

### 7.3 Clientes
- [ ] Campos: Nome, Documento, Telefone, Email, Endereço, Qtd. de pedidos, Último pedido, Status
- [ ] Listagem, busca, filtros, criação, edição, detalhes

### 7.4 Motoristas
- [ ] Campos: Nome, Documento, Telefone, CNH, Veículo, Status, Entregas, Performance
- [ ] Status: Disponível, Em rota, Indisponível
- [ ] Listagem, cadastro, edição, detalhes

### 7.5 Veículos
- [ ] Campos: Placa, Modelo, Marca, Tipo, Capacidade, Motorista, Status
- [ ] Status: Disponível, Em uso, Manutenção, Inativo

### 7.6 Rotas
- [ ] Layout split: lista de rotas à esquerda + mapa à direita
- [ ] Detalhes da rota: pedidos associados, motorista, veículo, status
- [ ] Status: planejada, ativa, concluída, atrasada, cancelada

### 7.7 Mapa
- [ ] Camada visual com dados mockados, mas com contrato de dados pronto para trocar por API real (origem, destino, pedidos, motoristas, rotas, pontos de parada)

### 7.8 Indicadores/Analytics
- [ ] Indicadores: taxa de entrega, tempo médio, pedidos por período, entregas por motorista, performance por rota, atrasos, volume de pedidos
- [ ] Filtros: período, motorista, veículo, região, status
- [ ] Gráficos com legenda, tooltip, empty/loading/error state, responsivos

Critérios de aceite (por módulo):
- CRUD básico funcional contra dados mockados
- Os 3 estados (loading, empty, error) implementados e visualmente consistentes com `EmptyState`/`ErrorState`/`LoadingState`
- Build e lint passam

---

## Fase 8 — Landing Page

**Objetivo:** página pública com a mesma identidade visual da aplicação logada.

Tasks:
- [ ] Hero (headline + subheadline + CTA duplo: "Começar agora" / "Conhecer a plataforma")
- [ ] Social proof
- [ ] Seção de problema
- [ ] Seção de solução
- [ ] Features (pedidos, rotas inteligentes, monitoramento, indicadores, motoristas, veículos)
- [ ] Product preview (representação visual do dashboard)
- [ ] CTA final
- [ ] Footer (Produto, Empresa, Recursos, Suporte, Termos, Privacidade)

Critérios de aceite:
- Usa os mesmos tokens/componentes do Design System (zero estilo "solto")
- Responsiva
- Build e lint passam

---

## Fase 9 — Polimento transversal

**Objetivo:** cobrir tudo que atravessa os módulos e normalmente é deixado pra depois — não deixe pra depois.

Tasks:
- [ ] Todo módulo cobre: Loading, Empty, Error, Success, Disabled, Unauthorized, No Results
- [ ] Sistema de notificações global (Success, Info, Warning, Error) com toasts
- [ ] Command Menu com ações rápidas: criar pedido, criar rota, adicionar cliente/motorista/veículo, pesquisar pedido
- [ ] Mock data realista (sem "John Doe"/"Test Company"/Lorem Ipsum) cobrindo pedidos, clientes, motoristas, veículos, rotas, indicadores — coerente entre si (ex: motorista de um pedido existe na lista de motoristas)
- [ ] Responsividade revisada em todos os módulos (mobile: filtros em drawer, tabelas adaptadas)
- [ ] Acessibilidade revisada: navegação por teclado, focus states, aria labels, contraste, disabled states em todos os componentes interativos
- [ ] Revisão de performance: Server Components por padrão, Client Components só onde necessário, code splitting, memoização pontual

Critérios de aceite:
- Nenhum módulo quebra ao remover os dados mockados (todos mostram Empty/Error corretamente)
- `npm run build` e `npm run lint` limpos
- Checklist da seção 10 (Definition of Done) 100% marcada

---

## 10. Definition of Done (projeto completo)

- [ ] Landing page
- [ ] Login + JWT + rotas protegidas
- [ ] Application Shell (Sidebar + Topbar)
- [ ] Design Tokens
- [ ] Primitives, Primary e Secondary components
- [ ] Dashboard
- [ ] Pedidos, Clientes, Motoristas, Veículos, Rotas, Mapa, Indicadores
- [ ] Loading, Empty, Error states em todos os módulos
- [ ] Toasts, Dialogs, Drawers
- [ ] Responsividade
- [ ] Acessibilidade
- [ ] Arquitetura de pastas conforme seção 1
- [ ] Mock data realista
- [ ] Nenhum módulo quebra o Design System com estilo específico

---

## 11. Regras que valem para todas as fases

- Nunca usar estilo visual direto do Ark UI — só comportamento/acessibilidade.
- Nenhum valor de cor/spacing/radius hardcoded fora dos tokens.
- Um novo padrão visual recorrente vira componente do Design System antes de ser usado numa segunda tela — não duplicar.
- Evitar: componentes gigantes, lógica duplicada, estilos hardcoded, dependências desnecessárias, abstrações prematuras, soluções específicas para uma única tela.
- Nunca dois botões `Primary` competindo na mesma região.
