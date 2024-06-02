import { appendFileSync } from 'fs';
import { Args, NAME } from './interface';
import fs from 'fs';

export async function getCommandArgument(): Promise<Args> {
  const arg = process.argv[2];

  switch (arg) {
    case 'profiles':
      return { name: NAME.PROFILES };
    case 'assets':
      return { name: NAME.ASSETS };
    case 'txs':
      return { name: NAME.TRANSACTIONS };
    default:
      throw new Error(
        "Unrecognised command argument. Available options are 'profiles', 'assets' or 'txs' ",
      );
  }
}

export const writeToJson = (name: string, responseJson: any) => {
  fs.writeFile(
    `./api/data/graphql-${name}.json`,
    JSON.stringify(responseJson),
    () => {
      console.log(`Saved to JSON file \`graphql-${name}.json\` 🫡`);
    },
  );
};

export const writeDataToCsv = (name: string, entity: any) => {
  switch (name) {
    case NAME.PROFILES:
      const url = entity.profileImages[0].url;
      writeProfileToCsv(entity.id, entity.name, url);
    case NAME.TRANSACTIONS:
      const from = entity.profile.id;
      writeTransactionToCsv(entity.hash, from, entity.to);
  }
};

const writeProfileToCsv = (id: string, name: string, url: string) => {
  const csv = `${id},${name},${url}\n`; // Construct a CSV row
  try {
    appendFileSync('./api/data/profiles.csv', csv); // Append the CSV row to the file
  } catch (error) {
    console.log('❌Converting profiles to csv', error);
    throw error;
  }
};

const writeTransactionToCsv = (hash: string, from: string, to: string) => {
  const csv = `${hash},${from},${to}\n`; // Construct a CSV row
  try {
    appendFileSync('./api/data/transactions.csv', csv); // Append the CSV row to the file
  } catch (error) {
    console.log('❌Converting transactions to csv', error);
    throw error;
  }
};

export const generateQuery = (name: string, offset: number) => {
  switch (name) {
    case NAME.PROFILES:
      return `query MyQuery($nullId: ID = "", $nullString: String = "") {\n  profiles(\n    where: {id_not: $nullId, name_not: $nullString, profileImages_: {url_not: $nullString}}\n    skip: ${offset}\n  first: 1000\n) {\n    id\n    name\n    profileImages(first: 1) {\n      url\n    }\n  }\n}`;
    case NAME.TRANSACTIONS:
      return `query MyQuery($null: Bytes = "") {\n  transactions(\n    where: {hash_not: $null, profile_: {id_not: "null"}, to_not: $null, to_not_contains: "0x2300000A84D25dF63081feAa37ba6b62C4c89a30"}\n  skip: ${offset}\n  first: 1000\n) {\n    hash\n    profile {\n      id\n    }\n    to\n  }\n}`;
  }
};
