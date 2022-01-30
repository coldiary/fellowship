#![no_std]

elrond_wasm::imports!();

mod types;

use types::CampaignData;
use types::Status;

#[elrond_wasm::contract]
pub trait Tips {
    #[storage_mapper("nextId")]
    fn next_id(&self) -> SingleValueMapper<u64>;

    #[view]
    #[storage_mapper("campaigns")]
    fn campaigns(&self, id: &u64) -> SingleValueMapper<CampaignData<Self::Api>>;

    #[init]
    fn init(&self) -> SCResult<()> {
        self.next_id().set_if_empty(&1);
        Ok(())
    }

    #[view(getAllCampaigns)]
    fn get_all_campaigns(
        &self,
    ) -> Vec<(u64, CampaignData<Self::Api>)> {
        let mut all = Vec::new();
        let count = self.next_id().get();

        for n in 1..count {
            if !self.campaigns(&n).is_empty() {
                let campaign = self.campaigns(&n).get();
                all.push((n, campaign));
            }
        }

        all
    }

    #[endpoint(createCampaign)]
    fn create_campaign(
        &self,
        metadata_cid: ManagedBuffer,
        token_identifier: TokenIdentifier,
    ) -> SCResult<u64> {
        require!(token_identifier.is_egld() || token_identifier.is_valid_esdt_identifier(), "Invalid token identifier provided");

        let campaign = CampaignData {
            creator_address: self.blockchain().get_caller(),
            token_identifier,
            metadata_cid,
            amount: BigUint::zero(),
            claimable: BigUint::zero(),
            status: Status::Active,
        };

        let campaign_id = self.next_id().get();
        self.next_id().set(&(campaign_id + 1));
        self.campaigns(&campaign_id).set(&campaign);

        Ok(campaign_id)
    }

    #[endpoint(updateCampaign)]
    fn update_campaign(
        &self,
        campaign_id: u64,
        metadata_cid: ManagedBuffer,
    ) -> SCResult<()> {
        let caller = self.blockchain().get_caller();

        require!(!self.campaigns(&campaign_id).is_empty(), "This campaign does not exist");

        let mut campaign = self.campaigns(&campaign_id).get();
        require!(campaign.status == Status::Active, "This campaign has ended");
        require!(caller == campaign.creator_address, "Only the creator of the campaign can update it");

        campaign.metadata_cid = metadata_cid;
        self.campaigns(&campaign_id).set(&campaign);

        Ok(())
    }

    #[endpoint(endCampaign)]
    fn end_campaign(
        &self,
        campaign_id: u64,
    ) -> SCResult<()> {
        let caller = self.blockchain().get_caller();

        require!(!self.campaigns(&campaign_id).is_empty(), "This campaign does not exist");

        let mut campaign = self.campaigns(&campaign_id).get();
        require!(campaign.status == Status::Active, "This campaign has ended");
        require!(caller == campaign.creator_address, "Only the creator of the campaign can close it");

        let token_identifier = &campaign.token_identifier;
        let token_amount = &campaign.claimable;
        self.send().direct(&caller, &token_identifier, 0, &token_amount, &[]);

        campaign.claimable = BigUint::zero();
        campaign.status = Status::Ended;

        self.campaigns(&campaign_id).set(&campaign);

        Ok(())
    }

    #[endpoint(claimCampaign)]
    fn claim(
        &self,
        campaign_id: u64,
    ) -> SCResult<()> {
        let caller = self.blockchain().get_caller();

        require!(!self.campaigns(&campaign_id).is_empty(), "This campaign does not exist");

        let mut campaign = self.campaigns(&campaign_id).get();
        require!(campaign.status == Status::Active, "This campaign has ended");
        require!(caller == campaign.creator_address, "Only the creator of the campaign can claim funds");

        let token_identifier = &campaign.token_identifier;
        let token_amount = &campaign.claimable;
        self.send().direct(&caller, &token_identifier, 0, &token_amount, &[]);

        campaign.claimable = BigUint::zero();

        self.campaigns(&campaign_id).set(&campaign);

        Ok(())
    }

    #[payable("*")]
    #[endpoint(tip)]
    fn tip(
        &self,
        campaign_id: u64,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
    ) -> SCResult<()> {
        require!(!self.campaigns(&campaign_id).is_empty(), "This campaign does not exist");

        let mut campaign = self.campaigns(&campaign_id).get();

        require!(campaign.status == Status::Active, "This campaign has ended");
        require!(campaign.token_identifier == paid_token, "Invalid token provided as payment");
        require!(paid_quantity > 0, "Invalid amount provided as payment");

        campaign.amount = &campaign.amount + &paid_quantity;
        campaign.claimable = &campaign.claimable + &paid_quantity;

        self.campaigns(&campaign_id).set(&campaign);

        Ok(())
    }
}
