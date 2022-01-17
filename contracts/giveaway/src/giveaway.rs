#![no_std]

elrond_wasm::imports!();

mod types;

use types::GiveawayData;

#[elrond_wasm::contract]
pub trait Giveaway {
    #[storage_mapper("nextId")]
    fn next_id(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("giveaways")]
    fn giveaways(&self, id: &u64) -> SingleValueMapper<GiveawayData<Self::Api>>;

    #[init]
    fn init(&self) -> SCResult<()> {
        self.next_id().set_if_empty(&1);
        Ok(())
    }

    #[payable("*")]
    #[endpoint(createOpenGiveaway)]
    fn create_open_giveaway(
        &self,
        registration_limit: BigUint,
        deadline: u64,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
    ) -> SCResult<u64> {
        require!(deadline > self.blockchain().get_block_timestamp(), "Giveaway registrations deadline can't be in the past");

        let delivery_total = delivery_plan.iter().fold(BigUint::zero(), |acc, val| acc + &val.0);
        require!(delivery_total <= paid_quantity, "Paid amount isn't enough for the drop delivery plan ot execute");

        let campaign = CampaignData {
            creator_address: self.blockchain().get_caller(),
            token_identifier,
            metadata_uri,
            goal,
            deadline,
            amount: BigUint::zero(),
            claimable: BigUint::zero(),
            status: Status::Active,
        };

        let giveaway_id = self.next_id().get();
        self.next_id().set(&(giveaway_id + 1));
        self.giveaways(&giveaway_id).set(&giveaway);

        Ok(giveaway_id)

        Ok(())
    }


}
