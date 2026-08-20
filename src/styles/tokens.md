# ATHONIS Design Tokens

Fonte da verdade: [`tokens.css`](./tokens.css). Este documento explica **como usar** cada
token nas próximas fases — não redefine valores aqui para evitar duas fontes de verdade.

## Regra geral

Nenhum componente usa cor/spacing/radius/shadow hardcoded (`#fff`, `rgb(...)`, `p-[13px]`,
`shadow-[...]`). Sempre a utilitária Tailwind gerada a partir de um token abaixo. Se um valor
visual novo é necessário, ele vira token primeiro, componente depois.

## Cor

Todo token de cor é exposto como `bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*` e aceita
modificador de opacidade (`bg-primary/10`, `text-danger/60`, etc.) — use isso para variações
"tint" (ex: fundo sutil de badge) em vez de criar um novo token.

| Token | Uso |
|---|---|
| `background` / `foreground` | Fundo e texto base da página |
| `surface` | Fundo de card, painel, linha de tabela |
| `surface-muted` | Fundo de seção secundária dentro de um card (ex: sidebar de filtros) |
| `surface-hover` / `surface-active` | Estado de hover/active de itens interativos sobre `surface` |
| `border` | Borda padrão de card, input, tabela |
| `border-subtle` | Divisórias internas de baixo contraste (separators) |
| `primary` / `primary-hover` / `primary-active` / `primary-foreground` | Ação principal (Button Primary, links de destaque, item ativo da sidebar) |
| `secondary` / `secondary-hover` / `secondary-active` / `secondary-foreground` | Ação secundária (Button Secondary, chips) |
| `success` / `warning` / `danger` / `info` (+ `-foreground`) | Estado semântico: badges de status, alerts, validação de formulário |
| `muted` | Texto de apoio (descrição, placeholder, metadado) |

**Regra dos dois botões Primary:** nunca renderizar dois `Button` variant="primary" competindo
na mesma região (ver seção 11 do SPEC.md) — a segunda ação da região usa `secondary`, `tertiary`
ou `ghost`.

## Tipografia

Escala exposta via `text-*` (define `font-size` + `line-height` juntos; para peso, o token já
inclui `font-weight` nos headings/label — Body/Caption usam o peso padrão do texto):

`text-display`, `text-heading-1` … `text-heading-4`, `text-body-lg`, `text-body`,
`text-body-sm`, `text-caption`, `text-label`.

Mapeamento de uso: Display → hero de landing page; Heading 1–2 → título de página/seção;
Heading 3–4 → título de card/bloco; Body Large → intro/lead text; Body → texto padrão;
Body Small → texto denso de tabela; Caption → metadado/timestamp; Label → rótulo de campo de
formulário e de badge.

## Spacing

Usa a escala padrão do Tailwind (`p-1`…`p-96`, `gap-*`, etc.), que já é baseada em um único
`--spacing` token múltiplo de 0.25rem. Não usar spacing arbitrário (`p-[13px]`) — se a escala
padrão não cobre o caso, é sinal de que o layout precisa ser revisto, não que o token precisa
de exceção.

## Radius

`rounded-sm` (inputs pequenos, chips), `rounded-md` (botão, input, card pequeno), `rounded-lg`
(card padrão, dialog), `rounded-xl` (superfícies grandes/hero), `rounded-full` (avatar, badge
pill, switch).

## Shadow — política restritiva

`shadow-float` e `shadow-overlay` são os **únicos** shadows do sistema, e só podem aparecer em:
Dropdown, Popover, Dialog, Drawer, Menu, Tooltip e outros elementos flutuantes (overlay sobre o
conteúdo). `shadow-float` para popover/dropdown/menu/tooltip; `shadow-overlay` para
dialog/drawer (elevação maior). Card, botão, input, tabela e qualquer elemento estático de
layout **não** usam shadow — elevação visual vem de `border` + `surface`.

## Dark mode

Os tokens reagem a `prefers-color-scheme: dark` automaticamente (ver `tokens.css`) — nenhum
componente precisa de lógica condicional de tema, só usar os tokens semânticos normalmente.
