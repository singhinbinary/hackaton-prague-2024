export enum NAME {
  PROFILES = 'Profiles',
  ASSETS = 'Assets',
  TRANSACTIONS = 'Transactions',
}

export const iconsList: { [key: string]: string } = {
  Profiles: '🥝',
  Assets: '🥥',
  Transactions: '🍍',
};

export interface Profile {
  id: string;
  name: string;
  profileImages: [{ url: string }];
}

export interface Transaction {
  hash: string;
  profile: { id: string };
  to: string;
}

export interface Args {
  name: string;
}
