import type { FormInstance } from "antd";
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


export interface AddressFormProps {
  form: FormInstance<AddressRequest>;
  initialAddress?: Address | null;
  isSaving: boolean;
  onSubmit: (values: AddressRequest) => void;
  onCancel: () => void;
}