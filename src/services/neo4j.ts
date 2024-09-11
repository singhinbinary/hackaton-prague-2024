import neo4j from 'neo4j-driver';

const URI = process.env.NEXT_PUBLIC_NEO4J_URI;
const USER = process.env.NEXT_PUBLIC_NEO4J_USER;
const PASSWORD = process.env.NEXT_PUBLIC_NEO4J_PASSWORD;

export async function queryNeo4jDatabase(limit: number) {
  if ([URI, USER, PASSWORD].includes(undefined)) {
    console.log([URI, USER, PASSWORD]);
    throw new Error('Missing some NEO4J Environnement variable');
  }

  const driver = neo4j.driver(
    URI as string,
    neo4j.auth.basic(USER as string, PASSWORD as string),
  );
  const session = driver.session();

  const serverInfo = await driver.getServerInfo();
  console.log('Connection established');
  console.log(serverInfo);

  // TODO: add an extra similar query to just fetch the result for a specific UP or address 🥝
  const result = await session.run(
    `MATCH p=()-[:TX_BWT_PROFILES]->() RETURN p LIMIT ${limit};`,
  );

  session.close();

  return result;
}
