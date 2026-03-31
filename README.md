# CriptoGraph

Dashboard de mercado cripto com foco em experiencia de produto, performance e engenharia frontend profissional.

![Coverage](https://img.shields.io/badge/coverage-61.8%25-yellow)
![CI](https://img.shields.io/badge/CI-lint%20%7C%20coverage%20%7C%20build-blue)

## O que foi implementado

Este projeto agora inclui todas as evolucoes pedidas:

- alertas de preco por ativo;
- favoritos/watchlist com persistencia em `localStorage`;
- comparacao de ate 3 moedas no mesmo grafico;
- metricas avancadas no grafico:
  - media movel 7;
  - media movel 21;
  - volatilidade;
  - max drawdown;
- tema claro/escuro com persistencia;
- paginacao server-side (`page` + `per_page`);
- camada de dados com `React Query`;
- tratamento robusto de erro com `retry` na UI;
- melhorias de acessibilidade (labels, foco visivel, teclas de selecao, aria);
- PWA instalavel (manifest + service worker);
- testes com `Vitest + React Testing Library`;
- cobertura de testes com gate de qualidade na CI.

## Stack Tecnica

- `React 19`
- `Vite 7`
- `@tanstack/react-query`
- `Recharts`
- `Vitest` + `React Testing Library`
- `@vitest/coverage-v8`
- `ESLint 9`
- `vite-plugin-pwa`
- `GitHub Actions`

## Funcionalidades de Produto

### Mercado e navegacao

- busca por nome/simbolo com debounce;
- filtro de periodo (`24h`, `7d`, `30d`, `1y`);
- paginação de resultados com controle de itens por pagina;
- filtro de somente favoritos.

### Watchlist e alertas

- favoritar/desfavoritar moedas;
- definir alvo de preco por ativo;
- painel de alertas acionados com dismiss;
- contador de alertas no header.

### Grafico analitico

- grafico realista com area + glow + tooltip customizada;
- linha principal da moeda selecionada;
- linhas comparativas de outras moedas;
- medias moveis 7 e 21;
- indicador de tendencia (alta/queda);
- volatilidade e max drawdown exibidos na UI.

## Arquitetura

### Estado global e dados

`CryptoContext` centraliza estado de dominio e interacao com queries:

- selecao de ativo e periodo;
- favoritos e comparacoes;
- paginacao;
- alertas;
- tema;
- estado de loading/erro/retry.

`React Query` gerencia:

- cache em memoria de mercado e historicos;
- stale time e retries;
- deduplicacao de requests;
- refetch controlado.

## Endpoints Consumidos (CoinGecko)

Base URL: `https://api.coingecko.com`

- Lista de ativos:
  - `GET /api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false&per_page={perPage}&page={page}`
- Historico por ativo:
  - `GET /api/v3/coins/{id}/market_chart?vs_currency=usd&days={period}`

## PWA

Configurado com `vite-plugin-pwa`:

- `manifest.webmanifest` gerado no build;
- `service worker` gerado automaticamente;
- app instalavel em navegadores compatíveis.

## Testes e Cobertura

Suites atuais:

- `CryptoContext.test.jsx`
- `OptionCrypto.test.jsx`
- `Graph.test.jsx`
- `InfoCrypto.test.jsx`

Comando de cobertura:

```bash
npm run test:coverage
```

Thresholds globais (gate de qualidade):

- `lines >= 60`
- `statements >= 60`
- `branches >= 55`
- `functions >= 40`

## CI

Pipeline em `.github/workflows/ci.yml` executa em `push` e `pull_request`:

1. `npm ci`
2. `npm run lint`
3. `npm run test:coverage`
4. `npm run build`
5. upload do artefato de cobertura

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run build
npm run preview
npm run quality
```

## Executar localmente

```bash
npm install
npm run dev
```

App local: `http://localhost:5173`

## Estrutura relevante

- `src/context/CryptoContext.jsx`
- `src/hooks/useDebouncedValue.js`
- `src/components/OptionCrypto/`
- `src/components/CardCrypto/`
- `src/components/Graph/`
- `src/components/InfoCrypto/`
- `src/components/Header/`
- `src/pages/dashbord/`
- `.github/workflows/ci.yml`
- `vite.config.js`

## Proximos passos recomendados

- adicionar testes para `Dashboard` e `CardCrypto`;
- quebrar bundle com code splitting (hoje o build aponta chunk grande);
- integrar provider de notificacao real (email/push/webhook) para alertas.
