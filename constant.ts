export const GRAPH_URL =
  "https://graph.mainnet.lukso.dev/subgraphs/name/lukso/lsps";

export const QUERY_PROFILES =
  "query MyQuery {\n  profiles {\n    id\n    name\n    profileImages {\n      url\n    }\n    receivedAssets {\n      id\n    }\n    lsp12IssuedAssets {\n      id\n    }\n  }\n}";

export const QUERY_ASSETS =
  "query MyQuery {\n  assets {\n    id\n    lsp4TokenName\n    lsp4TokenSymbol\n    holders {\n      profile {\n        id\n      }\n    }\n  }\n}";

export const QUERY_TRANSACTIONS =
  'query MyQuery($null: Bytes = "") {\n  transactions(\n    where: {hash_not: $null, profile_: {id_not: "null"}, to_not: $null}\n  ) {\n    hash\n    profile {\n      id\n    }\n    to\n  }\n}';
