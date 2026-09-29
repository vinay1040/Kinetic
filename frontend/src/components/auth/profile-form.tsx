import { Button, Form, Input } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "name must atleast 2 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("email is required"),
});

export const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const formik = useFormik({
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },

    enableReinitialize: true,

    validationSchema,

    onSubmit: (values) => {
      updateProfile({
        name: values.name,
        email: values.email,
      });
    },
  });
  return (
    <Form layout="vertical" onFinish={formik.handleSubmit}>
      <Form.Item
        label="Name"
        validateStatus={
          formik.touched.name && formik.errors.name ? "error" : ""
        }
        help={
          formik.touched.name && formik.errors.name ? formik.errors.name : null
        }
      >
        <Input
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="John Doe"
        />
      </Form.Item>

      <Form.Item
        label="Email"
        validateStatus={
          formik.touched.email && formik.errors.email ? "error" : ""
        }
        help={
          formik.touched.email && formik.errors.email
            ? formik.errors.email
            : null
        }
      >
        <Input
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="john@example.com"
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Update Profile
      </Button>
    </Form>
  );
};
