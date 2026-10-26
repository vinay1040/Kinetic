import { AuthApi } from "./authApi";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressRequest {
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export const getAddresses = async () : Promise<Address[]> => {
    const response = await AuthApi.get<Address[]>("/Address");
    return response.data
};

export const addAdress = async (request:AddressRequest) : Promise<Address> => {
    const response = await AuthApi.post("/Address",request);
    return response.data;
};

export const updateAddress = async (addressId:string,request:AddressRequest): Promise<Address> => {
    const response = await AuthApi.put(`/Address/${encodeURIComponent(addressId)}`,request);
    return response.data;
};

export const deleteAddress = async (addressId:string): Promise<void> => {
    await AuthApi.delete(`/Address/${encodeURIComponent(addressId)}`);
}