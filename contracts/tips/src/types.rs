use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, ManagedBuffer, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, ManagedVecItem, TopDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum Status {
    Active,
    Ended,
}

#[derive(NestedEncode, NestedDecode, ManagedVecItem, TopEncode, TopDecode, TypeAbi)]
pub struct CampaignData<M: ManagedTypeApi> {
    pub id: u64,
    pub creator_address: ManagedAddress<M>,
    pub token_identifier: TokenIdentifier<M>,
    pub metadata_cid: ManagedBuffer<M>,
    pub status: Status,
    pub amount: BigUint<M>,
    pub claimable: BigUint<M>,
    pub donations: u64,
    pub participants: u64,
}
