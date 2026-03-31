# CriptoGraph

Aplicacao web para monitoramento de criptomoedas com foco em experiencia de uso, performance de consultas e qualidade de engenharia frontend.
Acesse: https://vercel.com/nevesbytes-projects

## Resumo

O projeto consome a API da CoinGecko para listar ativos, exibir indicadores de mercado e renderizar historico de preco em grafico.

Esta versao inclui melhorias de engenharia importantes:

- seletor de periodo (`24h`, `7d`, `30d`, `1y`);
- cache em memoria para historicos ja consultados;
- busca por nome/simbolo com debounce;
- testes automatizados com `Vitest` + `React Testing Library`;
- pipeline de CI com `lint`, `build` e `test`.

## Stack Tecnica

- `React 19`
- `Vite 7`
- `Recharts`
- `Context API`
- `Vitest`
- `React Testing Library`
- `ESLint 9`
- `GitHub Actions`

## Funcionalidades

- listagem de criptomoedas por market cap;
- selecao de ativo para analise;
- grafico de variacao de preco por periodo;
- exibicao de preco atual, market cap, volume 24h e variacao diaria;
- busca com debounce por nome ou simbolo;
- cache local de historico por chave `coinId + periodo`.

## Arquitetura

### Gerenciamento de estado

O estado global fica em `CryptoContext`, concentrando:

- lista de ativos;
- ativo selecionado;
- historico de preco;
- periodo selecionado;
- termo de busca;
- estados de loading e erro;
- cache em memoria (`Map`) para historicos.

### Fluxo de dados

1. A aplicacao busca os ativos no mount.
2. Define automaticamente o primeiro ativo como selecionado.
3. Sempre que `selectedCrypto` ou `selectedPeriod` mudam, tenta carregar historico:
   - se existir no cache, reutiliza;
   - se nao existir, consulta API e grava no cache.
4. A busca filtra a lista com debounce para reduzir re-renders e processamento.

## Estrutura de Pastas

- `src/context/CryptoContext.jsx`: estado global e regra de negocio
- `src/hooks/useDebouncedValue.js`: hook reutilizavel de debounce
- `src/components/OptionCrypto/`: busca, periodo e navegacao horizontal
- `src/components/CardCrypto/`: cards de ativos
- `src/components/Graph/`: grafico historico
- `src/components/InfoCrypto/`: indicadores do ativo
- `src/context/__tests__/CryptoContext.test.jsx`: teste de cache/fluxo do contexto
- `src/components/OptionCrypto/__tests__/OptionCrypto.test.jsx`: teste de interacao da UI
- `.github/workflows/ci.yml`: pipeline CI

## Endpoints Consumidos

Base URL: `https://api.coingecko.com`

- Lista de ativos:
  - `GET /api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`
- Historico por periodo:
  - `GET /api/v3/coins/{id}/market_chart?vs_currency=usd&days={period}`

## Qualidade e Testes

### Suite de testes

- `OptionCrypto.test.jsx`
  - valida busca e troca de periodo
- `CryptoContext.test.jsx`
  - valida uso do cache para evitar chamadas repetidas

### Scripts

```bash
npm run dev
npm run lint
npm run build
npm run test
npm run test:watch
npm run preview
```

## CI

Pipeline configurada em `.github/workflows/ci.yml` para `push` e `pull_request`:

1. checkout do repositorio;
2. setup do Node;
3. `npm ci`;
4. `npm run lint`;
5. `npm run build`;
6. `npm run test`.

## Como Executar Localmente

```bash
npm install
npm run dev
```

Aplicacao local: `http://localhost:5173`
