# CriptoGraph

Dashboard simples de criptomoedas desenvolvido com React, focado em aprendizado de frontend, consumo de API e gerenciamento de estado global.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-green)

---

# Objetivo do Projeto

O objetivo do projeto é praticar conceitos importantes de React através de uma aplicação de mercado cripto.

A aplicação permite:

- listar criptomoedas;
- pesquisar moedas;
- selecionar moedas;
- visualizar informações detalhadas;
- visualizar gráfico;
- praticar Context API;
- consumir API externa;
- trabalhar renderização dinâmica no React.

Projeto desenvolvido em estrutura simples, estilo estágio/júnior.

---

# Stack Tecnológica

- `React`
- `Vite`
- `Context API`
- `Recharts`
- `CSS`

---

# Funcionalidades

## Mercado Cripto

- listagem de criptomoedas;
- busca por nome;
- cards interativos;
- seleção de moeda;
- atualização automática da interface.

## Gráfico

- gráfico com `Recharts`;
- atualização automática ao clicar em uma moeda;
- gráfico responsivo;
- tooltip;
- area chart.

## Informações da Moeda

- nome;
- símbolo;
- preço;
- market cap;
- variação 24h.

---

# Estrutura do Projeto

```bash
src/
│
├── components/
│   ├── CardCrypto/
│   ├── Graph/
│   ├── Header/
│   ├── InfoCrypto/
│   └── OptionCrypto/
│
├── context/
│   └── CryptoContext.jsx
│
├── pages/
│   └── dashboard/
│
├── App.jsx
└── main.jsx
```

---

# Fluxo da Aplicação

```text
Aplicação inicia
↓
CryptoProvider envolve App
↓
useEffect busca API
↓
Dados são salvos no Context
↓
Cards renderizam moedas
↓
Usuário seleciona uma moeda
↓
Graph e InfoCrypto atualizam automaticamente
```

---

# Explicação Técnica Completa

---

# main.jsx

Arquivo responsável por iniciar a aplicação React.

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <CryptoProvider>
    <App />
  </CryptoProvider>
);
```

## O que acontece aqui

O React renderiza o componente principal da aplicação:

```jsx
<App />
```

Mas antes disso, ele é envolvido pelo:

```jsx
<CryptoProvider>
```

Isso significa que todos os componentes da aplicação terão acesso ao contexto global.

---

# App.jsx

Componente principal da aplicação.

Responsável apenas por renderizar a página principal:

```jsx
<Dashboard />
```

---

# Dashboard.jsx

Página principal da aplicação.

Responsável por organizar os componentes da tela.

Estrutura:

```jsx
<Header />
<OptionCrypto />
<Graph />
<InfoCrypto />
```

## Componentes renderizados

### Header

Cabeçalho da aplicação.

### OptionCrypto

Busca e cards das moedas.

### Graph

Gráfico da moeda selecionada.

### InfoCrypto

Informações detalhadas da moeda.

---

# CryptoContext.jsx

Arquivo mais importante do projeto.

Responsável por:

- buscar API;
- armazenar estados globais;
- compartilhar dados entre componentes.

---

# createContext

```jsx
export const CryptoContext = createContext();
```

Cria um contexto global no React.

Esse contexto poderá ser acessado por qualquer componente da aplicação.

---

# CryptoProvider

```jsx
export function CryptoProvider({ children })
```

Esse componente envolve toda aplicação.

Tudo que estiver dentro dele terá acesso aos estados globais.

---

# useState

O projeto utiliza vários estados.

---

## Lista de criptomoedas

```jsx
const [cryptoList, setCryptoList] = useState([]);
```

Armazena todas as moedas vindas da API.

---

## Loading

```jsx
const [loading, setLoading] = useState(false);
```

Controla carregamento da aplicação.

---

## Error

```jsx
const [error, setError] = useState(null);
```

Controla erros da API.

---

## Busca

```jsx
const [searchTerm, setSearchTerm] = useState("");
```

Armazena o valor digitado no input.

---

## Moeda selecionada

```jsx
const [selectedCrypto, setSelectedCrypto] = useState(null);
```

Armazena a moeda clicada pelo usuário.

---

# useEffect

Responsável pela busca da API.

```jsx
useEffect(() => {
  async function fetchCryptos() {

  }

  fetchCryptos();
}, []);
```

---

# Por que usar useEffect?

Porque buscar API é um efeito colateral.

Fluxo:

```text
React renderiza
↓
useEffect executa
↓
API é buscada
↓
Estado atualiza
↓
Tela renderiza novamente
```

---

# fetch API

Busca os dados da CoinGecko.

```jsx
const response = await fetch(API_URL);
```

---

# response.json()

Converte a resposta para JSON.

```jsx
const data = await response.json();
```

---

# Salvando os dados

```jsx
setCryptoList(data);
```

Agora os dados ficam disponíveis para toda aplicação.

---

# Context.Provider

```jsx
<CryptoContext.Provider
  value={{
    cryptoList,
    selectedCrypto,
    setSelectedCrypto,
    searchTerm,
    setSearchTerm,
    loading,
    error,
  }}
>
```

Tudo que estiver dentro de `value` poderá ser acessado pelos componentes.

---

# useContext

Os componentes acessam o contexto usando:

```jsx
const { cryptoList } = useContext(CryptoContext);
```

Isso evita passar props manualmente entre vários componentes.

---

# Header.jsx

Componente responsável pelo topo da aplicação.

Exibe:

- nome do sistema;
- cabeçalho visual.

Componente simples e estático.

---

# OptionCrypto.jsx

Responsável por:

- input de busca;
- renderização dos cards.

---

# Input Controlado

```jsx
<input
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

---

# Como funciona

Fluxo:

```text
Usuário digita
↓
onChange dispara
↓
setSearchTerm atualiza estado
↓
React renderiza novamente
```

---

# Filtro das moedas

```jsx
const filteredCryptoList = cryptoList.filter((coin) =>
  coin.name.toLowerCase().includes(searchTerm.toLowerCase())
);
```

---

# Como o filter funciona

O React percorre o array inteiro.

Se o nome da moeda incluir o texto digitado:

```jsx
includes()
```

ela aparece na tela.

---

# CardCrypto.jsx

Responsável pelos cards das criptomoedas.

---

# map()

```jsx
filteredCryptoList.map((crypto) => (
```

Percorre o array de moedas.

Para cada moeda:

- cria um card;
- renderiza informações.

---

# key

```jsx
key={crypto.id}
```

Ajuda o React identificar elementos únicos dentro de listas.

Muito importante para performance.

---

# Seleção da moeda

```jsx
onClick={() => setSelectedCrypto(crypto)}
```

Quando o usuário clica:

- a moeda é salva no contexto;
- outros componentes atualizam automaticamente.

---

# Atualização automática do React

Quando:

```jsx
setSelectedCrypto()
```

executa:

```text
Estado muda
↓
React renderiza novamente
↓
Graph atualiza
↓
InfoCrypto atualiza
```

---

# Classe dinâmica

```jsx
className={`cardContainer ${
  selectedCrypto?.id === crypto.id
    ? "activeCard"
    : ""
}`}
```

Se a moeda atual for a selecionada:

```jsx
activeCard
```

é adicionada automaticamente.

---

# Optional Chaining

```jsx
selectedCrypto?.id
```

Evita erro caso:

```jsx
selectedCrypto === null
```

---

# Graph.jsx

Responsável pelo gráfico da aplicação.

Biblioteca utilizada:

```bash
Recharts
```

---

# Estrutura do gráfico

```jsx
<ResponsiveContainer>
  <AreaChart>
```

---

# ResponsiveContainer

Faz o gráfico ocupar automaticamente o tamanho disponível.

---

# AreaChart

Componente principal do gráfico.

---

# Dados do gráfico

```jsx
const chartData = [
  { date: "Seg", price: 20 },
];
```

Array de objetos usado para renderizar o gráfico.

---

# XAxis

```jsx
<XAxis dataKey="date" />
```

Eixo horizontal.

---

# YAxis

```jsx
<YAxis />
```

Eixo vertical.

---

# Tooltip

```jsx
<Tooltip />
```

Mostra informações ao passar o mouse.

---

# Area

```jsx
<Area
  dataKey="price"
/>
```

Linha/área principal do gráfico.

---

# Atualização dinâmica do gráfico

Quando:

```jsx
selectedCrypto
```

muda:

```text
Graph renderiza novamente
↓
Título muda
↓
Dados mudam
↓
Gráfico muda
```

---

# InfoCrypto.jsx

Responsável pelas informações detalhadas da moeda.

---

# Renderização Condicional

```jsx
if (!selectedCrypto)
```

Se nenhuma moeda estiver selecionada:

```jsx
Selecione uma criptomoeda
```

é exibido na tela.

---

# Informações renderizadas

```jsx
selectedCrypto.name
selectedCrypto.symbol
selectedCrypto.current_price
selectedCrypto.market_cap
selectedCrypto.price_change_percentage_24h
```

---

# Renderização dinâmica no React

Sempre que o estado muda:

```text
React executa componente novamente
↓
JSX é reconstruído
↓
Tela atualiza
```

---

# Hooks utilizados no projeto

- `useState`
- `useEffect`
- `useContext`

---

# Conceitos React utilizados

- componentização;
- estados;
- contexto global;
- renderização condicional;
- listas com map;
- eventos;
- consumo de API;
- renderização dinâmica.

---

# API Consumida

API utilizada:

```text
https://api.coingecko.com/api/v3/coins/markets
```

---

# Dados utilizados da API

```jsx
crypto.id
crypto.name
crypto.symbol
crypto.current_price
crypto.market_cap
crypto.price_change_percentage_24h
```

---

# Executar Localmente

```bash
npm install
npm run dev
```

Aplicação:

```text
http://localhost:5173
```

---

# Estrutura relevante

- `src/context/CryptoContext.jsx`
- `src/components/OptionCrypto/`
- `src/components/CardCrypto/`
- `src/components/Graph/`
- `src/components/InfoCrypto/`
- `src/components/Header/`
- `src/pages/dashboard/`

---

# Conceitos aprendidos no projeto

## React

- hooks;
- contexto;
- estados;
- renderização;
- componentes.

## JavaScript

- async/await;
- fetch;
- arrays;
- map;
- filter;
- objetos.

## Frontend

- consumo de API;
- gerenciamento de estado;
- UI dinâmica;
- arquitetura React.

---

# Melhorias Futuras

- paginação;
- favoritos;
- dark mode;
- integração com API histórica real;
- React Query;
- testes;
- TypeScript;
- deploy.