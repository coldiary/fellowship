import { contracts, apiAddress } from 'config';
import { Campaign } from 'types/Tips';
import { Contract } from 'utils/contract';

export class Tips extends Contract {
    static instance = new Tips(apiAddress, contracts.tips.address, contracts.tips.name, contracts.tips.abiPath);

    async getCampaign(id: number): Promise<Campaign | undefined> {
        return await this.query('campaigns', [Tips.encodeU64Value(id)], (data) => {
            return Tips.decodeCampaign(data[0].valueOf());
        }).catch(() => undefined);
    }

    async getCampaignsFor(address: string): Promise<Campaign[]> {
        return await this.query('getCampaigns', [Tips.encodeAddress(address)], (data) => {
            const list = data[0].valueOf();
            return list.map(Tips.decodeCampaign);
        }).catch(() => []);
    }

    async createCampaign(metadata_cid: string, token_identifier: string) {
        return await this.call('createCampaign', '0', [
            Tips.encodeString(metadata_cid),
            Tips.encodeTokenIdentifier(token_identifier),
        ], 'Create campaign');
    }

    async updateCampaign(id: number, metadata_cid: string) {
        return await this.call('updateCampaign', '0', [
            Tips.encodeU64Value(id),
            Tips.encodeString(metadata_cid),
        ], 'Update campaign');
    }

    async endCampaign(id: number) {
        return await this.call('endCampaign', '0', [Tips.encodeU64Value(id)], 'End campaign');
    }

    async claimCampaign(id: number) {
        return await this.call('claimCampaign', '0', [Tips.encodeU64Value(id)], 'Claim campaign');
    }

    async tipCampaign(id: number, amount: string) {
        return await this.call('tip', amount, [Tips.encodeU64Value(id)], 'Tip campaign');
    }

    static decodeCampaign = (c: any): Campaign => ({
        id: Tips.decodeNumber(c.id),
        creator_address: Tips.decodeAddress(c.creator_address),
        token_identifier: Tips.decodeString(c.token_identifier),
        metadata_cid: Tips.decodeString(c.metadata_cid),
        status: Tips.decodeEnum(c.status),
        amount: Tips.decodeBigNumber(c.amount),
        claimable: Tips.decodeBigNumber(c.claimable),
        donations: Tips.decodeNumber(c.donations),
        participants: Tips.decodeNumber(c.participants),
    })
}
