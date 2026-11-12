import { Button, Checkbox, Form, Input } from "antd";
import type { AddressFormProps } from "../types/address.types";

export const AddAddressCard = ({
  form,
  initialAddress,
  isSaving,
  onSubmit,
  onCancel,
}: AddressFormProps) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
    >
      <Form.Item
        name="label"
        label="Address label"
        rules={[{ required: true, whitespace: true, message: "Enter a label" }]}
      >
        <Input placeholder="Home, Work, etc." />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Full name"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "Enter the recipient's name",
          },
        ]}
      >
        <Input autoComplete="name" placeholder="Recipient name" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone number"
        rules={[
          { required: true, whitespace: true, message: "Enter a phone number" },
        ]}
      >
        <Input autoComplete="tel" placeholder="Phone number" />
      </Form.Item>

      <Form.Item
        name="addressLine1"
        label="Address line 1"
        rules={[
          { required: true, whitespace: true, message: "Enter your address" },
        ]}
      >
        <Input placeholder="House number, street, area" />
      </Form.Item>

      <Form.Item name="addressLine2" label="Address line 2">
        <Input placeholder="Apartment, landmark (optional)" />
      </Form.Item>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Form.Item
          name="city"
          label="City"
          rules={[
            { required: true, whitespace: true, message: "Enter a city" },
          ]}
        >
          <Input autoComplete="address-level2" />
        </Form.Item>

        <Form.Item
          name="state"
          label="State"
          rules={[
            { required: true, whitespace: true, message: "Enter a state" },
          ]}
        >
          <Input autoComplete="address-level1" />
        </Form.Item>

        <Form.Item
          name="postalCode"
          label="Postal code"
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Enter a postal code",
            },
          ]}
        >
          <Input autoComplete="postal-code" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[
            { required: true, whitespace: true, message: "Enter a country" },
          ]}
        >
          <Input autoComplete="country-name" />
        </Form.Item>
      </div>

      <Form.Item name="isDefault" valuePropName="checked">
        <Checkbox>Set as default address</Checkbox>
      </Form.Item>

      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>

        <Button type="primary" htmlType="submit" loading={isSaving}>
          {initialAddress ? "Save changes" : "Add address"}
        </Button>
      </div>
    </Form>
  );
};
