import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import useSmartContractInfo from './useSmartContractInfo';

export default function useIsContractOwner(contractAddress: string) {
  const { address } = useGetAccountInfo();
  const info = useSmartContractInfo(contractAddress);
  return address && info && address === info.ownerAddress;
}
