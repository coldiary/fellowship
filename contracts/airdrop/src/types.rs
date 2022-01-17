use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, Vec, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct AirdropData<M: ManagedTypeApi> {
    pub token_identifier: TokenIdentifier<M>,
    pub delivery_plan: Vec<(BigUint<M>, ManagedAddress<M>)>,
    pub claimed: Vec<ManagedAddress<M>>
}
