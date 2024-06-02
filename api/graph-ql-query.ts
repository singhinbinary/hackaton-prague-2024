import { GRAPH_URL } from '../constant';
import { NAME, iconsList } from './interface';
import {
  generateQuery,
  getCommandArgument,
  writeDataToCsv,
  writeToJson,
} from './utils';

const getData = async (query: string, name: string) => {
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

    writeToJson(name, responseJson);

    return responseJson.data;
  } catch (error) {
    console.log('ERROR DURING GRAPH_URL REQUEST', error);
    throw error;
  }
};

const processData = (name: string, data: any) => {
  let dataToProcess: any;
  switch (name) {
    case NAME.PROFILES:
      dataToProcess = data.profiles;
    case NAME.TRANSACTIONS:
      dataToProcess = data.transactions;
  }

  dataToProcess.forEach((entity: any) => {
    writeDataToCsv(name, entity);
  });
};

const main = async () => {
  const { name } = await getCommandArgument();

  const icon = iconsList[name];

  console.log('🤔 Contacting Graph Node...');
  console.log(`${icon} Querying ${name}`, GRAPH_URL);

  for (let counter = 0; counter < 10; counter++) {
    const offset = counter * 1000;
    const query = generateQuery(name, offset);

    console.log('📝Query', query);

    if (!query) {
      throw new Error('❌No query');
    }

    const data = await getData(query, name);

    if (!data) {
      throw new Error('❌No data');
    }

    processData(name, data);
  }
};

main()
  .then(() => console.log('✅'))
  .catch((e) => console.log('⚠️', e));
