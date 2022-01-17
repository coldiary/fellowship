#![no_std]

elrond_wasm::imports!();

mod types;

use types::AirdropData;

#[elrond_wasm::contract]
pub trait Airdrop {
    #[storage_mapper("nextId")]
    fn next_id(&self) -> SingleValueMapper<u64>;

    #[storage_mapper("airdrops")]
    fn airdrops(&self, id: &u64) -> SingleValueMapper<AirdropData<Self::Api>>;

    #[init]
    fn init(&self) -> SCResult<()> {
        self.next_id().set_if_empty(&1);
        Ok(())
    }

    #[payable("*")]
    #[endpoint(airdrop)]
    fn airdrop(
        &self,
        delivery_plan: Vec<(BigUint, ManagedAddress)>,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
    ) -> SCResult<()> {
        let delivery_total = delivery_plan.iter().fold(BigUint::zero(), |acc, val| acc + &val.0);
        require!(delivery_total <= paid_quantity, "Paid amount isn't enough for the drop delivery plan ot execute");

        for target in delivery_plan {
            self.send().direct(&target.1, &paid_token, 0, &target.0, &[]);
        }

        Ok(())
    }

    #[payable("*")]
    #[endpoint(createAirdrop)]
    fn create_airdrop(
        &self,
        delivery_plan: Vec<(BigUint, ManagedAddress)>,
        #[payment] paid_quantity: BigUint,
        #[payment_token] paid_token: TokenIdentifier,
    ) -> SCResult<u64> {
        let delivery_total = delivery_plan.iter().fold(BigUint::zero(), |acc, val| acc + &val.0);
        require!(delivery_total <= paid_quantity, "Paid amount isn't enough for the drop delivery plan ot execute");

        let airdrop = AirdropData {
            token_identifier: paid_token,
            delivery_plan,
            claimed: Vec::new(),
        };

        let airdrop_id = self.next_id().get();
        self.next_id().set(&(airdrop_id + 1));
        self.airdrops(&airdrop_id).set(&airdrop);

        Ok(airdrop_id)
    }

    #[endpoint(claim)]
    fn claim(
        &self,
        airdrop_id: u64,
    ) -> SCResult<()> {
        let caller = self.blockchain().get_caller();

        require!(!self.airdrops(&airdrop_id).is_empty(), "This airdrop does not exist");

        let mut airdrop = self.airdrops(&airdrop_id).get();

        let maybe_claim = airdrop.delivery_plan.iter().find(|&val| val.1 == caller);

        match maybe_claim {
            Option::None => sc_error!("No airdrop for this address"),
            Option::Some(claimable) => {
                let already_claim = airdrop.claimed.contains(&caller);
                require!(!already_claim, "This address already claimed for this airdrop");

                let token_identifier = &airdrop.token_identifier;
                let token_amount = &claimable.0;
                self.send().direct(&caller, &token_identifier, 0, &token_amount, &[]);

                airdrop.claimed.push(caller);

                self.airdrops(&airdrop_id).set(&airdrop);

                Ok(())
            }
        }
    }


}
