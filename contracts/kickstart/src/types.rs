use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, ManagedBuffer, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum Status {
    FundingPeriod,
    Successful,
    Failed,
}

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct CampaignData<M: ManagedTypeApi> {
    pub creator_address: ManagedAddress<M>,
    pub token_identifier: TokenIdentifier<M>,
    pub metadata_cid: ManagedBuffer<M>,
    pub goal: BigUint<M>,
    pub deadline: u64,
    pub amount: BigUint<M>,
    pub donors: u64,
}
