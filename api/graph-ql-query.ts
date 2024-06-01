import {
  GRAPH_URL,
  QUERY_TRANSACTIONS,
  QUERY_ASSETS,
  QUERY_PROFILES,
} from '../constant';
import fs from 'fs';

type Args = { query: string; name: string };

async function getCommandArgument(): Promise<Args> {
  const arg = process.argv[2];

  switch (arg) {
    case 'profiles':
      return { query: QUERY_PROFILES, name: 'Profiles' };
    case 'assets':
      return { query: QUERY_ASSETS, name: 'Assets' };
    case 'txs':
      return { query: QUERY_TRANSACTIONS, name: 'Transactions' };
    default:
      throw new Error(
        "Unrecognised command argument. Available options are 'profiles', 'assets' or 'txs' ",
      );
  }
}

const getData = async (query: string, name: string) => {
  const runQuery = async () => {
    try {
      const headers = {
        'content-type': 'application/json',
      };
      const requestBody = {
        extension: {},
        operationName: 'MyQuery',
        query: query,
      };
      const options = {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      };
      const response = await fetch(GRAPH_URL, options);
      const responseJson = await response.json();

      console.log('RESPONSE FROM GRAPH_URL REQUEST', responseJson?.data);

      fs.writeFile(
        `./graphql-${name}.json`,
        JSON.stringify(responseJson),
        () => {
          console.log(`Saved to JSON file \`graphql-${name}.json\` 🫡`);
        },
      );

      return responseJson;
    } catch (error) {
      console.log('ERROR DURING GRAPH_URL REQUEST', error);
      throw error;
    }
  };

  setTimeout(() => runQuery(), 2000);
};

getCommandArgument().then((cmdArgs: Args) => {
  const { query, name } = cmdArgs;

  // for debugging purpose, to recognise in the terminal what we are querying
  const iconsList: { [key: string]: string } = {
    Profiles: '🥝',
    Assets: '🥥',
    Transactions: '🍍',
  };

  const icon = iconsList[name];

  console.log('🤔 Contacting Graph Node...');
  console.log(`${icon} Querying ${name}`, GRAPH_URL);

  getData(query, name)
    .then(() => {
      console.log('Hang tight!');
    })
    .catch((error) => {
      console.log('❌', error);
    });
});
