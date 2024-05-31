import { GRAPH_URL, QUERY_PROFILES } from '../constant';
import fs from 'fs';

const getData = async (query: string) => {
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
        './graphql-profile.json',
        JSON.stringify(responseJson),
        () => {
          console.log('Save to JSON file `graphql-profile.json` 🫡');
        },
      );
    } catch (error) {
      console.log('ERROR DURING GRAPH_URL REQUEST', error);
      throw error;
    }
  };

  setTimeout(() => runQuery(), 3000);
};

getData(QUERY_PROFILES)
  .then(() => {
    console.log('🤔 Contacting Graph Node...');
    console.log('🥝 Querying Profiles', GRAPH_URL);
  })
  .catch((error) => {
    console.log('❌', error);
  });
