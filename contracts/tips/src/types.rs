use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, ManagedBuffer, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, PartialEq, Clone, Copy)]
pub enum Status {
    Active,
    Ended,
}

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct CampaignData<M: ManagedTypeApi> {
    pub creator_address: ManagedAddress<M>,
    pub token_identifier: TokenIdentifier<M>,
    pub metadata_uri: ManagedBuffer<M>,
    pub amount: BigUint<M>,
    pub claimable: BigUint<M>,
    pub status: Status,
}
