import { algodClient, STABLECOIN_ID } from '../utils/Utils';
import algosdk, { modelsv2 } from 'algosdk';
import { UserAccount } from '../../redux/reducers/user';
import { ApplicationLocalState, TealKeyValue } from 'algosdk/dist/types/src/client/v2/algod/models/types';
import { extractAppState } from '../../utils/Utils';

export async function getAccountInformation(address: string): Promise<UserAccount> {
  const account: modelsv2.Account = await algodClient.accountInformation(address).do();

  const algoBalance = algosdk.microalgosToAlgos(account.amount as number);

  const assets: Map<number, number | bigint> = new Map();
  if (account.assets) {
    account.assets.forEach(asset => {
      assets.set(asset['asset-id'], asset.amount);
    })
  }

  const apps: Map<number, Map<string, number | bigint | string>> = new Map();

  const appLocalStates: ApplicationLocalState[] | undefined = account['apps-local-state'];
  if (appLocalStates) {
    // For each opted into app of account
    appLocalStates.forEach(appLocalState => {
      const statePairs: TealKeyValue[] | undefined = appLocalState['key-value']
      apps.set(appLocalState.id as number, extractAppState(statePairs));
    })
  }

  return {
    address,
    algoBalance,
    assets,
    apps
  }
}

/**
 * Get asset balance for account
 */
export function getAssetBalance(account: UserAccount, assetId: number): number | bigint {
  const assets: Map<number, number | bigint> = account.assets;
  return assets.has(assetId) ? assets.get(assetId)! : 0;
}

/**
 * Get stablecoin balance for account
 */
export function getStablecoinBalance(account: UserAccount): number | bigint {
  const assets: Map<number, number | bigint> = account.assets;
  return assets.has(STABLECOIN_ID) ? assets.get(STABLECOIN_ID)! : 0;
}