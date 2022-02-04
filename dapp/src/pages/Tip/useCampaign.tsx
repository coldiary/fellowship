import { useEffect, useState } from 'react';

import { fetchObjectFromIPFS, getIPFSUri } from 'api/ipfs';
import { getCampaign } from 'api/tips';
import placeholderPath from 'assets/img/placeholder.png';
import { Campaign, CampaignMetadata } from 'types/Tips';

type UseCampaignOptions = { campaign: Campaign; } | { id?: number; }

export function useCampaign(options: UseCampaignOptions) {
    const [campaign, setCampaign] = useState<Campaign | undefined>('campaign' in options ? options.campaign : undefined);
    const [metadata, setMetadata] = useState<CampaignMetadata | undefined>(undefined);
    const [illustrationUrl, setIllustrationUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!campaign) {
            (async () => {
                if ('id' in options && options.id !== undefined) {
                    setCampaign(await getCampaign(+options.id));
                }
            })().catch(console.error);
        } else {
            (async () => {
                const fetched = await fetchObjectFromIPFS(campaign.metadata_cid);
                setMetadata(fetched);
                setIllustrationUrl(`${getIPFSUri(fetched.illustration)}?content-type=image/jpeg` );
            })().catch(() => {
                setIllustrationUrl(placeholderPath);
            });
        }
    }, [campaign]);

    return [campaign, metadata, illustrationUrl] as const;
}
