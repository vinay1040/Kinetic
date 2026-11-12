import { apiClient } from "@/lib/api/apiClient";
import type { Address, AddressRequest } from "../types/address.types";


export const getAddresses = async () : Promise<Address[]> => {
    const response = await apiClient.get<Address[]>("/Address");
    return response.data
};

export const addAdress = async (request:AddressRequest) : Promise<Address> => {
    const response = await apiClient.post("/Address",request);
    return response.data;
};

export const updateAddress = async (addressId:string,request:AddressRequest): Promise<Address> => {
    const response = await apiClient.put(`/Address/${encodeURIComponent(addressId)}`,request);
    return response.data;
};

export const deleteAddress = async (addressId:string): Promise<void> => {
    await apiClient.delete(`/Address/${encodeURIComponent(addressId)}`);
}