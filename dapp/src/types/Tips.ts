export enum CampaignStatus {
    Active = 'Active',
    Ended = 'Ended',
}

export interface Campaign {
    id: number;
    creator_address: string;
    token_identifier: string;
    metadata_cid: string;
    amount: string;
    claimable: string;
    status: string;
}

export interface CampaignMetadata {
    title: string;
    description: string;
    illustration: string;
    tags?: string[];
}
