
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";

import {
  type Address,
  type AddressRequest,
} from "@/services/AddressService";
import { useAddress } from "@/hooks/AddressHook/useAddress";
import { useAddAddress } from "@/hooks/AddressHook/useAddAddress";
import { useUpdateAddress } from "@/hooks/AddressHook/useUpdateAddress";
import { useAddressDelete } from "@/hooks/AddressHook/useAddressDelete";
import { AddressForm } from "@/components/auth/address-form";

const { Text } = Typography;

export const SavedAddressesPanel = () => {
  const [form] = Form.useForm<AddressRequest>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const {
    data: addresses = [],
    isPending,
    isError,
    error,
    refetch,
  } = useAddress();

  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useAddressDelete();

  const isSaving = addAddress.isPending || updateAddress.isPending;

  const openAddModal = () => {
    setEditingAddress(null);
    form.resetFields();
    form.setFieldsValue({
      label: "Home",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    form.setFieldsValue({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    form.resetFields();
  };

  const handleSave = async (values: AddressRequest) => {
    try {
      const request: AddressRequest = {
        ...values,
        label: values.label.trim(),
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        addressLine1: values.addressLine1.trim(),
        addressLine2: values.addressLine2?.trim() ?? "",
        city: values.city.trim(),
        state: values.state.trim(),
        postalCode: values.postalCode.trim(),
        country: values.country.trim(),
        isDefault: Boolean(values.isDefault),
      };

      if (editingAddress) {
        await updateAddress.mutateAsync({
          addressId: editingAddress.id,
          request,
        });
        message.success("Address updated successfully");
      } else {
        await addAddress.mutateAsync(request);
        message.success("Address added successfully");
      }

      closeModal();
    } catch {
      message.error("Unable to save the address. Please try again.");
    }
  };

  const handleDelete = async (addressId: string) => {
    try {
      await deleteAddress.mutateAsync(addressId);
      message.success("Address deleted successfully");
    } catch {
      message.error("Unable to delete the address. Please try again.");
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Saved Addresses
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your delivery addresses.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={openAddModal}
        >
          Add address
        </Button>
      </div>

      {isPending ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : isError ? (
        <Alert
          type="error"
          showIcon
          message="Could not load your addresses"
          description={
            error instanceof Error
              ? error.message
              : "Please try again."
          }
          action={
            <Button size="small" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      ) : addresses.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="You haven't saved any addresses yet."
          >
            <Button type="primary" onClick={openAddModal}>
              Add your first address
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card
              key={address.id}
              title={
                <Space wrap>
                  <MapPin size={17} />
                  <span>{address.label}</span>
                  {address.isDefault && (
                    <Tag color="green">Default</Tag>
                  )}
                </Space>
              }
              extra={
                <Space>
                  <Button
                    type="text"
                    aria-label={`Edit ${address.label} address`}
                    icon={<Pencil size={16} />}
                    onClick={() => openEditModal(address)}
                  />
                  <Popconfirm
                    title="Delete this address?"
                    description="This action cannot be undone."
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => void handleDelete(address.id)}
                  >
                    <Button
                      type="text"
                      danger
                      aria-label={`Delete ${address.label} address`}
                      icon={<Trash2 size={16} />}
                      loading={
                        deleteAddress.isPending &&
                        deleteAddress.variables === address.id
                      }
                    />
                  </Popconfirm>
                </Space>
              }
            >
              <div className="space-y-1">
                <Text strong>{address.fullName}</Text>
                <p>{address.phone}</p>
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingAddress ? "Edit address" : "Add address"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <AddressForm></AddressForm>
      </Modal>
    </section>
  );
};
