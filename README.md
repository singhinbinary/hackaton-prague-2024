# 🌐 Universal Graph - ETHPrague 2024

![Cover image hackathon EthPrague 2024](./docs/ogp.png)

## Presentation

A Social graph for smart accounts. It highlights interactions through user friendly experience and engagement between EOAs, smart accounts (account abstraction) and smart contracts. The main objective is on chain activity analysis and monitoring.

It works as follow:

1. data from The Graph (indexed via a subgraph) is retrieved via graphql in JSON.
2. The JSON data is then processed in CSV and injected in a Neo4j database.
3. The Neo4j instance performs query to generate data that can be consumed to generate a network visualisation (nodes, edges, weight, relationships).
4. The dApp connects to the Neo4j instance using [`neo4j-driver`](https://www.npmjs.com/package/neo4j-driver) package.
5. The data retrieved is then consumed and displayed visually on the interface as a network using **D3.js**.

### Built with

- [The Graph](./api/)
- [Neo4j](https://neo4j.com/)
- [Next.js](https://nextjs.org/)
- [d3.js](https://d3js.org)
- [LSPs standards](https://docs.lukso.tech/standards/introduction)

## Getting Started

First, run the development server:

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## The Graph data

You can run the following commands to query the Graph Node and retrieve some data. This data will be saved in a JSON file.

```bash
npm run graph:profile

# or

npm run graph:assets

# or

npm run graph:txs
```
