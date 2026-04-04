# Planning Poker Web

Frontend do sistema de Planning Poker em tempo real, construido com React 19, TypeScript e Ant Design.

## Requisitos

- [Node.js](https://nodejs.org/) 18+
- Backend rodando (ver [planningpoker-api](../planningpoker-api/README.md))

## Como rodar

```bash
npm install
npm run dev
```

O app inicia em `http://localhost:5173` por padrao.

## Configuracao

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SIGNALR_URL=http://localhost:5170/planningHub
```

| Variavel | Descricao |
|----------|-----------|
| `VITE_SIGNALR_URL` | URL completa do hub SignalR do backend |

## Scripts

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (Vite) |
| `npm run build` | Build de producao (TypeScript + Vite) |
| `npm run preview` | Preview do build de producao |
| `npm run lint` | Lint com ESLint |

## Arquitetura

```
src/
  context/
    ConnectionContext.tsx   # Conexao SignalR, status, reconnect com backoff
    RoomContext.tsx         # STATE_SYNC listener, snapshot, playerId, reconnect
  types/
    room.ts                # RoomSnapshot, PlayerSnapshot
  pages/
    Home.tsx               # Roteamento: lobby ou sala
  components/
    panels/
      CreateRoom.tsx       # Formulario de criacao de sala
      EnterRoom.tsx        # Formulario de entrada/observacao
      Room.tsx             # Tela principal: deriva estado do snapshot
    ui/
      cards/
        ActionCard.tsx     # Card de votacao (a11y: keyboard nav, ARIA)
        UserCard.tsx       # Card do jogador (flip 3D, status visual)
      room/
        Header.tsx         # Nome da sala, status de conexao, acoes
        UserGroup.tsx      # Grid de cards dos participantes
        VotingDeck.tsx     # Deck de opcoes de voto
        ControlButtons.tsx # Revelar/Resetar (owner, com tooltips)
        VoteSummary.tsx    # Estatisticas: media, mediana, moda
      gif/
        FlipCard.tsx       # Animacao de boas-vindas
        Fireworks.tsx      # Celebracao quando todos votam igual
      support/
        SupportButton.tsx  # Botao de apoio (PIX)
  constants/
    estimationOptions.ts   # Definicao dos decks de votacao
  App.tsx                  # Providers e rotas
  main.tsx                 # Ponto de entrada
```

## Principios de design

### UI = function(snapshot)

O frontend e uma **camada de renderizacao pura**. Todo estado e derivado do `RoomSnapshot` recebido do backend via `STATE_SYNC`:

```ts
flipped     = snapshot.phase === "REVEALED"
isLeader    = snapshot.ownerId === playerId
isWatching  = !snapshot.players.some(p => p.id === playerId)
allVoted    = snapshot.players.every(p => p.hasVoted)
```

Nenhuma regra de negocio no frontend. Nenhuma fonte de verdade duplicada.

### Reconexao resiliente

- Backoff exponencial com jitter: `0, 1s, 2s, 5s, 10s, 15s, 30s` + random 0-1s
- `playerId` e `roomId` persistidos em localStorage
- Reconexao automatica via `Reconnect` hub method
- Feedback visual: badge "Online" / "Reconectando..." / "Desconectado"

### Feedback ao usuario

- Toasts de erro para falhas de conexao e acoes
- Loading state nos botoes durante operacoes
- Modal de confirmacao ao sair da sala
- Tooltips nos botoes desabilitados explicando o motivo

### Acessibilidade (a11y)

- Cards de voto: `role="button"`, `tabIndex`, `aria-pressed`, navegacao por teclado (Enter/Space)
- Cards de jogador: `role="article"`, `aria-label` com status
- Status de conexao: `aria-live="polite"` para screen readers
- Grupo de participantes: `role="region"`

## Tecnologias

| Tecnologia | Versao | Uso |
|------------|--------|-----|
| React | 19.1 | UI framework |
| TypeScript | 5.8 | Tipagem |
| Vite | 6.3 | Build tool e dev server |
| Ant Design | 5.25 | Componentes UI |
| @microsoft/signalr | 8.0 | Comunicacao real-time |
| React Router | 7.5 | Roteamento |

## Deploy

### Vercel

O projeto inclui `vercel.json` com rewrites para SPA. Configure a variavel de ambiente `VITE_SIGNALR_URL` no painel do Vercel.

### Hosting estatico

```bash
npm run build
```

Sirva o conteudo da pasta `dist/`. Configure o servidor para redirecionar todas as rotas para `index.html` (SPA fallback).
