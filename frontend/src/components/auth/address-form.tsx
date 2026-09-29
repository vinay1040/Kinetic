import { Button, Form, Input } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";

const validationSchema = Yup.object({
  street: Yup.string()
    .min(3, "Street address must be at least 3 characters")
    .required("Street address is required"),

  city: Yup.string()
    .required("City is required"),

  state: Yup.string()
    .required("State is required"),

  zipCode: Yup.string()
    .matches(/^[0-9]{6}$/, "ZIP code must be 6 digits")
    .required("ZIP code is required"),
});

export function AddressForm() {
  const { user, updateProfile } = useAuth();

  const formik = useFormik({
    initialValues: {
      street: user?.address?.street ?? "",
      city: user?.address?.city ?? "",
      state: user?.address?.state ?? "",
      zipCode: user?.address?.zipCode ?? "",
    },

    enableReinitialize: true,

    validationSchema,

    onSubmit: (values) => {
      updateProfile({
        address: values,
      });
    },
  });

  return (
    <Form layout="vertical" onFinish={formik.handleSubmit}>
      <Form.Item
        label="Street Address"
        validateStatus={
          formik.touched.street && formik.errors.street
            ? "error"
            : ""
        }
        help={
          formik.touched.street && formik.errors.street
            ? formik.errors.street
            : null
        }
      >
        <Input
          name="street"
          value={formik.values.street}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="123 Main Street"
        />
      </Form.Item>

      <div className="grid gap-4 sm:grid-cols-2">
        <Form.Item
          label="City"
          validateStatus={
            formik.touched.city && formik.errors.city
              ? "error"
              : ""
          }
          help={
            formik.touched.city && formik.errors.city
              ? formik.errors.city
              : null
          }
        >
          <Input
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Delhi"
          />
        </Form.Item>

        <Form.Item
          label="State"
          validateStatus={
            formik.touched.state && formik.errors.state
              ? "error"
              : ""
          }
          help={
            formik.touched.state && formik.errors.state
              ? formik.errors.state
              : null
          }
        >
          <Input
            name="state"
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Delhi"
          />
        </Form.Item>
      </div>

      <Form.Item
        label="ZIP Code"
        validateStatus={
          formik.touched.zipCode && formik.errors.zipCode
            ? "error"
            : ""
        }
        help={
          formik.touched.zipCode && formik.errors.zipCode
            ? formik.errors.zipCode
            : null
        }
      >
        <Input
          name="zipCode"
          value={formik.values.zipCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="110001"
          maxLength={6}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Save Address
      </Button>
    </Form>
  );
}