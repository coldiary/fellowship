#![no_std]

elrond_wasm::imports!();

mod types;

use types::CampaignData;
use types::Status;

#[elrond_wasm::contract]
pub trait Kickstart {
    #[storage_mapper("nextId")]
    fn next_id(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("campaigns")]
    fn campaigns(&self, id: &u64) -> SingleValueMapper<CampaignData<Self::Api>>;

    #[storage_mapper("deposits")]
    fn deposits(&self, id: &u64, donor: &ManagedAddress) -> SingleValueMapper<BigUint>;

    #[init]
    fn init(&self) -> SCResult<()> {
        self.next_id().set_if_empty(&1);
        Ok(())
    }

    #[endpoint(createCampaign)]
    fn create_campaign(
        &self,
        metadata_uri: ManagedBuffer,
        token_identifier: TokenIdentifier,
        goal: BigUint,
        deadline: u64,
    ) -> SCResult<u64> {
        require!(token_identifier.is_egld() || token_identifier.is_valid_esdt_identifier(), "Invalid token identifier provided");
        require!(goal > 0, "Invalid amount provided for campaign's goal");
        require!(deadline > self.get_current_time(), "Campaign's deadline can't be in the past");

        let campaign = CampaignData {
            creator_address: self.blockchain().get_caller(),
            token_identifier,
            metadata_uri,
            goal,
            deadline,
            amount: BigUint::zero(),
            donors: 0,
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
        opt_metadata_uri: Option<ManagedBuffer>,
        opt_goal: Option<BigUint>,
        opt_deadline: Option<u64>,
    ) -> SCResult<()> {
        let caller = self.blockchain().get_caller();

        require!(!self.campaigns(&campaign_id).is_empty(), "This campaign does not exist");

        let mut campaign = self.campaigns(&campaign_id).get();
        require!(caller == campaign.creator_address, "Only the creator of the campaign can update it");

        match opt_metadata_uri {
            Option::Some(metadata_uri) => {
                campaign.metadata_uri = metadata_uri;
            },
            Option::None => {},
        }

        match opt_goal {
            Option::Some(goal) => {
                require!(goal > 0, "Invalid amount provided for campaign's goal");
                campaign.goal = goal;
            },
            Option::None => {},
        }

        match opt_deadline {
            Option::Some(deadline) => {
                require!(deadline > self.get_current_time(), "Campaign's deadline can't be in the past");
                campaign.deadline = deadline;
            },
            Option::None => {},
        }

        self.campaigns(&campaign_id).set(&campaign);

        Ok(())
    }

    #[endpoint(claim)]
    fn claim(
        &self,
        campaign_id: u64,
    ) -> SCResult<()> {
        require!(!self.campaigns(&campaign_id).is_empty(), "This campaign does not exist");

        let campaign = self.campaigns(&campaign_id).get();

        match self.get_campaign_status(&campaign) {
            Status::FundingPeriod => sc_error!("Cannot claim before deadline"),
            Status::Successful => {
                let caller = self.blockchain().get_caller();
                require!(caller == campaign.creator_address, "Only campaign's creator can claim successful funding");

                let token_identifier = &campaign.token_identifier;
                let balance = &campaign.amount;

                self.send().direct(&caller, &token_identifier, 0, &balance, &[]);

                Ok(())
            },
            Status::Failed => {
                let caller = self.blockchain().get_caller();
                let deposit = self.deposits(&campaign_id, &caller).get();

                if deposit > 0 {
                    let token_identifier = &campaign.token_identifier;

                    self.deposits(&campaign_id, &caller).clear();
                    self.send().direct(&caller, &token_identifier, 0, &deposit, &[]);
                }

                Ok(())
            },
        }
    }

    #[payable("*")]
    #[endpoint(fund)]
    fn fund(
        &self,
        campaign_id: u64,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
    ) -> SCResult<()> {
        require!(!self.campaigns(&campaign_id).is_empty(), "This campaign does not exist");

        let mut campaign = self.campaigns(&campaign_id).get();

        require!(self.get_campaign_status(&campaign) == Status::FundingPeriod, "This campaign has ended");
        require!(campaign.token_identifier == paid_token, "Invalid token provided as payment");
        require!(paid_quantity > 0, "Invalid amount provided as payment");

        let caller = self.blockchain().get_caller();

        if (self.deposits(&campaign_id, &caller).is_empty()) {
            campaign.donors += 1;
        }

        self.deposits(&campaign_id, &caller).update(|deposit| *deposit += &paid_quantity);

        campaign.amount = &campaign.amount + &paid_quantity;

        self.campaigns(&campaign_id).set(&campaign);

        Ok(())
    }

    // private

    fn get_current_time(&self) -> u64 {
        self.blockchain().get_block_timestamp()
    }

    fn get_campaign_status(&self, campaign: &CampaignData<Self::Api>) -> Status {
        if self.get_current_time() < campaign.deadline {
            Status::FundingPeriod
        } else if campaign.amount >= campaign.goal {
            Status::Successful
        } else {
            Status::Failed
        }
    }
}
