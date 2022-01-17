use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, Vec, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct GiveawayData<M: ManagedTypeApi> {
    pub token_identifier: TokenIdentifier<M>,
    pub amount: BigUint<M>,
    pub registration_limit: BigUint<M>,
    pub whitelist: Vec<ManagedAddress<M>>,
    pub claimed: Vec<ManagedAddress<M>>
}
