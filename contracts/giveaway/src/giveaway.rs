#![no_std]

elrond_wasm::imports!();

mod types;

use types::GiveawayData;

const PERCENTAGE_TOTAL: u32 = 100;

#[elrond_wasm::contract]
pub trait Giveaway {
    #[storage_mapper("nextId")]
    fn next_id(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("giveaways")]
    fn giveaways(&self, id: &u64) -> SingleValueMapper<GiveawayData<Self::Api>>;

    #[storage_mapper("participants")]
    fn participants(&self, id: &u64) -> SetMapper<ManagedAddress<Self::Api>>;

    #[init]
    fn init(&self) -> SCResult<()> {
        self.next_id().set_if_empty(&1);
        Ok(())
    }

    #[payable("*")]
    #[endpoint(giveaway)]
    fn giveaway(
        &self,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
        delivery_plan: ManagedVec<u8>,
        participants: ManagedVec<ManagedAddress>,
    ) -> SCResult<()> {
        let delivery_total = delivery_plan.iter().fold(0, |acc, val| acc + val);
        require!(delivery_total != 100, "Giveaway delivery invalid, distribution should use exactly all the funds");

        let giveaway_id = self.next_id().get();
        self.next_id().set(&(giveaway_id + 1));

        require!(participants.len() > 0 && participants.len() > delivery_plan.len(), "Not enough participants to execute delivery");

        let winning_addresses = self.get_distinct_random(1, participants.len(), delivery_plan.len());

        for i in (0..delivery_plan.len()).rev() {
            let winning_address_id = winning_addresses[i];
            let winner_address = participants.get(winning_address_id);
            let prize = self.calculate_percentage_of(&paid_quantity, &BigUint::from(delivery_plan.get(i)));

            self.send().direct(
                &winner_address,
                &paid_token,
                0,
                &prize,
                b"You won a giveaway ! Congratulations!",
            );
        }

        Ok(())
    }

    #[payable("*")]
    #[endpoint(createOpenGiveaway)]
    fn create_open_giveaway(
        &self,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
        delivery_plan: ManagedVec<u8>,
        #[var_args] registration_limit_opt: OptionalValue<u64>,
        #[var_args] whitelist_opt: OptionalValue<ManagedVec<ManagedAddress>>,
    ) -> SCResult<u64> {
        let registration_limit = registration_limit_opt.into_option();

        if registration_limit.is_some() {
            require!(registration_limit.unwrap() > self.blockchain().get_block_timestamp(), "Giveaway registrations limit can't be in the past");
        }

        let delivery_total = delivery_plan.iter().fold(0, |acc, val| acc + val);
        require!(delivery_total != 100, "Give away delivery invalid, distribution should use exactly all the funds");

        let giveaway = GiveawayData {
            creator_address: self.blockchain().get_caller(),
            token_identifier: paid_token,
            amount: paid_quantity,
            registration_limit,
            delivery_plan: ManagedVec::from(delivery_plan),
            whitelist: whitelist_opt.into_option(),
            claimed: ManagedVec::new(),
        };

        let giveaway_id = self.next_id().get();
        self.next_id().set(&(giveaway_id + 1));
        self.giveaways(&giveaway_id).set(&giveaway);

        Ok(giveaway_id)
    }

    /// does not check if max - min >= amount, that is the caller's job
    fn get_distinct_random(&self, min: usize, max: usize, amount: usize) -> Vec<usize> {
        let mut rand_numbers: Vec<usize> = (min..=max).collect();
        let total_numbers = rand_numbers.len();
        let mut rand = RandomnessSource::<Self::Api>::new();

        for i in 0..amount {
            let rand_index = rand.next_usize_in_range(0, total_numbers);
            rand_numbers.swap(i, rand_index);
        }

        rand_numbers
    }

    fn calculate_percentage_of(&self, value: &BigUint, percentage: &BigUint) -> BigUint {
        value * percentage / PERCENTAGE_TOTAL
    }


}
