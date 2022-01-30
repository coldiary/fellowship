export enum TipsCampaignStatus {
    Active = 0,
    Ended,
}

export interface TipsCampaignData {
    id: number;
    creator_address: string;
    token_identifier: string;
    metadata_cid: string;
    amount: string;
    claimable: string;
    status: TipsCampaignStatus;
}
