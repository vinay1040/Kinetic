import { Button, Form, Input, message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "name must atleast 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("email is required"),
});

interface ProfileFormProp {
  onCancel: () => void;
}

export const ProfileForm = ({ onCancel }: ProfileFormProp) => {
  const { user, updateProfile } = useAuth();
  const formik = useFormik({
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },

    enableReinitialize: true,

    validationSchema,

    onSubmit: async (values) => {
      try {
        await updateProfile({
          name: values.name.trim(),
          email: values.email.trim(),
        });
        message.success("Profile Updated successfully");
        onCancel();
      } catch {
        message.error("Unable to update your profile.Please Try again");
      }
    },
  });
  return (
    <Form layout="vertical" onFinish={formik.handleSubmit}>
      <Form.Item
        label="Full name"
        validateStatus={
          formik.touched.name && formik.errors.name ? "error" : ""
        }
        help={formik.touched.name && formik.errors.name}
      >
        <Input
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your full name"
          autoComplete="name"
        />
      </Form.Item>

      <Form.Item
        label="Email address"
        validateStatus={
          formik.touched.email && formik.errors.email ? "error" : ""
        }
        help={formik.touched.email && formik.errors.email}
      >
        <Input
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Form.Item>

      <div className="flex flex-wrap justify-end gap-3">
        <Button onClick={onCancel} disabled={formik.isSubmitting}>
          Cancel
        </Button>

        <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
          Save changes
        </Button>
      </div>
    </Form>
  );
};
