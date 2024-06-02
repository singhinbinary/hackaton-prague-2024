export const GRAPH_URL =
  'https://graph.mainnet.lukso.dev/subgraphs/name/lukso/lsps';

export const QUERY_TRANSACTIONS =
  'query MyQuery($null: Bytes = "") {\n  transactions(\n    where: {hash_not: $null, profile_: {id_not: "null"}, to_not: $null}\n  ) {\n    hash\n    profile {\n      id\n    }\n    to\n  }\n}';
