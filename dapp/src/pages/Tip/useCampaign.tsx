import { useEffect, useMemo } from 'react';
import { transactionServices } from '@elrondnetwork/dapp-core';
import useSWR from 'swr';

import { fetchObjectFromIPFS, getIPFSUri } from 'api/ipfs';
import { Tips } from 'api/tips';
import placeholderPath from 'assets/img/placeholder.png';
import { Campaign, CampaignMetadata } from 'types/Tips';

type UseCampaignOptions = { campaign: Campaign; } | { id?: number; }

export function useCampaign(options: UseCampaignOptions) {
    const { hasPendingTransactions } = transactionServices.useGetPendingTransactions();

    const shouldFetchCampaign = () => {
        if ('id' in options && options.id) return `campaign-${options.id}`;
        if ('campaign' in options) return `campaign-${options.campaign.id}`;
        return null;
    };

    const { data: campaign, mutate } = useSWR(shouldFetchCampaign, async (): Promise<Campaign | undefined> => {
        if ('campaign' in options) return options.campaign;
        if ('id' in options && options.id) return await Tips.instance.getCampaign(+options.id);
        return undefined;
    });

    const { data: metadata } = useSWR(campaign?.metadata_cid ?? null, async (): Promise<CampaignMetadata | undefined> => {
        if (campaign?.metadata_cid) return await fetchObjectFromIPFS(campaign.metadata_cid);
        return undefined;
    });

    const illustrationUrl = useMemo(() => {
        return metadata ? `${getIPFSUri(metadata.illustration)}?content-type=image/jpeg` : placeholderPath;
    }, [metadata]);

    useEffect(() => {
        mutate();
    }, [hasPendingTransactions, options]);

    return [campaign, metadata, illustrationUrl] as const;
}
