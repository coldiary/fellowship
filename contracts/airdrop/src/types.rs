use elrond_wasm::{
    api::ManagedTypeApi,
    types::{BigUint, ManagedAddress, Vec, TokenIdentifier},
};

elrond_wasm::derive_imports!();

#[derive(NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct AirdropData<M: ManagedTypeApi> {
    pub token_identifier: TokenIdentifier<M>,
    pub delivery_plan: ManagedVec<(BigUint<M>, ManagedAddress<M>), M>,
    pub claimed: ManagedVec<ManagedAddress<M>, M>
}
