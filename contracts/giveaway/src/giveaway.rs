#![no_std]

elrond_wasm::imports!();

mod types;

use types::GiveawayData;
use types::Status;

const PERCENTAGE_TOTAL: u32 = 100;
const MAX_WINNERS: usize = 100;

#[elrond_wasm::contract]
pub trait Giveaway {
    #[storage_mapper("nextId")]
    fn next_id(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("giveaways")]
    fn giveaways(&self, id: &u64) -> SingleValueMapper<GiveawayData<Self::Api>>;

    #[storage_mapper("whitelists")]
    fn whitelists(&self, id: &u64) -> SetMapper<ManagedAddress>;

    #[storage_mapper("participants")]
    fn participants(&self, id: &u64) -> SingleValueMapper<ManagedVec<ManagedAddress>>;

    #[storage_mapper("userGiveaways")]
    fn user_giveaways(&self, address: &ManagedAddress) -> SetMapper<u64>;

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

        require!(delivery_total == 100, "Giveaway delivery invalid, distribution should use exactly all the funds");
        require!(participants.len() > 0 && participants.len() > delivery_plan.len(), "Not enough participants to execute delivery");

        self.distribute_prizes(&paid_quantity, &paid_token, &participants, &delivery_plan);

        Ok(())
    }

    #[allow(clippy::too_many_arguments)]
    #[payable("*")]
    #[endpoint(createGiveaway)]
    fn create_giveaway(
        &self,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
        delivery_plan: ManagedVec<u8>,
        #[var_args] registration_limit_opt: OptionalValue<u64>,
        #[var_args] registration_deadline_opt: OptionalValue<u64>,
        #[var_args] whitelist_opt: OptionalValue<ManagedVec<ManagedAddress>>,
    ) -> SCResult<u64> {
        let registration_limit = registration_limit_opt.into_option();
        let registration_deadline = registration_deadline_opt.into_option();

        if registration_deadline.is_some() {
            require!(registration_deadline.unwrap() > self.blockchain().get_block_timestamp(), "Giveaway registrations limit can't be in the past");
        }

        require!(delivery_plan.len() < MAX_WINNERS, "Giveaway delivery invalid, distribution should not exceed {} winners", MAX_WINNERS);
        let delivery_total = delivery_plan.iter().fold(0, |acc, val| acc + val);
        require!(delivery_total == 100, "Giveaway delivery invalid, distribution should use exactly all the funds");

        let wl_opt = whitelist_opt.into_option();

        let giveaway_id = self.next_id().get();
        self.next_id().set(&(giveaway_id + 1));

        let giveaway = GiveawayData {
            id: giveaway_id,
            creator_address: self.blockchain().get_caller(),
            token_identifier: paid_token,
            amount: paid_quantity,
            status: Status::Open,
            registration_limit,
            registration_deadline,
            delivery_plan: ManagedVec::from(delivery_plan),
            has_whitelist: wl_opt.is_some(),
        };

        self.giveaways(&giveaway_id).set(&giveaway);
        self.participants(&giveaway_id).set(ManagedVec::new());

        if giveaway.has_whitelist {
            let whitelist = wl_opt.unwrap();
            self.whitelists(&giveaway_id).extend(whitelist.into_iter());
        }

        Ok(giveaway_id)
    }

    #[endpoint(register)]
    fn register(
        &self,
        id: u64
    ) -> SCResult<()> {
        require!(!self.giveaways(&id).is_empty(), "This giveaway does not exist");

        let giveaway = self.giveaways(&id).get();

        require!(giveaway.status == Status::Open, "Giveaway is closed");

        if giveaway.registration_deadline.is_some() {
            let ts = self.blockchain().get_block_timestamp();
            let deadline = giveaway.registration_deadline.unwrap();
            require!(deadline > ts, "Registration for this giveaway are closed");
        }

        let caller = self.blockchain().get_caller();

        if giveaway.has_whitelist {
            require!(self.whitelists(&id).contains(&caller), "Not whitelisted");
        }

        let participants = self.participants(&id).get();

        if giveaway.registration_limit.is_some() {
            let limit = giveaway.registration_limit.unwrap();
            require!(BigUint::from(participants.len()) < limit, "Max registration reached for this giveaway");
        }

        require!(self.user_giveaways(&caller).insert(id), "Already registered to this giveaway");
        self.participants(&id).update(|p| p.push(caller));

        Ok(())
    }

    #[endpoint(drawWinners)]
    fn draw_winners(
        &self,
        id: u64
    ) -> SCResult<()> {
        require!(!self.giveaways(&id).is_empty(), "This giveaway does not exist");
        require!(!self.participants(&id).is_empty(), "No participants to this giveaway");

        let mut giveaway = self.giveaways(&id).get();

        require!(giveaway.status == Status::Open, "Giveaway is closed");

        let participants = self.participants(&id).get();

        require!(participants.len() > 0 && participants.len() >= giveaway.delivery_plan.len(), "Not enough participants to execute delivery");

        self.distribute_prizes(&giveaway.amount, &giveaway.token_identifier, &participants, &giveaway.delivery_plan);

        giveaway.status = Status::Closed;
        self.giveaways(&id).set(giveaway);

        Ok(())
    }

    fn distribute_prizes(
        &self,
        prize_pool_amount: &BigUint,
        prize_pool_token: &TokenIdentifier,
        participants: &ManagedVec<ManagedAddress>,
        prize_distribution: &ManagedVec<u8>,
    ) {
        // if there are less tickets than the distributed prize pool,
        // the 1st place gets the leftover, maybe could split between the remaining
        // but this is a rare case anyway and it's not worth the overhead
        let total_winning_tickets = prize_distribution.len();
        let total_prize = prize_pool_amount.clone();
        let mut prize_left = prize_pool_amount.clone();
        let winning_tickets = self.get_distinct_random(0, participants.len() - 1, total_winning_tickets);

        // distribute to the first place last. Laws of probability say that order doesn't matter.
        // this is done to mitigate the effects of BigUint division leading to "spare" prize money being left out at times
        // 1st place will get the spare money instead.
        for i in (1..total_winning_tickets).rev() {
            let winner_address = participants.get(winning_tickets[i]);
            let prize = self.calculate_percentage_of(&total_prize, &BigUint::from(prize_distribution.get(i)));

            self.send().direct(&winner_address, &prize_pool_token, 0, &prize, b"You won the lottery! Congratulations!");
            prize_left -= prize;
        }

        // send leftover to first place
        let first_place_winner = participants.get(winning_tickets[0]);
        self.send().direct(&first_place_winner, &prize_pool_token, 0, &prize_left, b"You won the lottery, 1st place! Congratulations!");
    }

    // fn distribute_prize(&self,
    //     prize_pool_amount: &BigUint,
    //     prize_pool_token: &TokenIdentifier,
    //     participants: &ManagedVec<ManagedAddress>,
    //     delivery_plan: &ManagedVec<u8>,
    // ) {
    //     let winning_addresses = self.get_distinct_random(1, participants.len(), delivery_plan.len());

    //     for i in (0..delivery_plan.len()).rev() {
    //         let winning_address_id = winning_addresses[i];
    //         let winner_address = participants.get(winning_address_id);
    //         let prize = self.calculate_percentage_of(&prize_pool_amount, &BigUint::from(delivery_plan.get(i)));

    //         self.send().direct(&winner_address, &prize_pool_token, 0, &prize, b"You won a giveaway ! Congratulations!");
    //     }
    // }

    // Normally, we recommend managed types, like ManagedVec > Vec, ManagedBuffer > BoxedBytes, etc.
    // But in this case, ManagedVec would need too many API calls for this algorithm
    /// does not check if max - min >= amount, that is the caller's job
    fn get_distinct_random(
        &self,
        min: usize,
        max: usize,
        amount: usize,
    ) -> ArrayVec<usize, MAX_WINNERS> {
        let mut rand_numbers = ArrayVec::new();

        for num in min..=max {
            rand_numbers.push(num);
        }

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
