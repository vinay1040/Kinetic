import { Button, Card, Form, Input, message, Typography } from "antd";
import { Link, useNavigate } from "react-router";
import { ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register(
          values.name.trim(),
          values.email.trim(),
          values.password,
        );
        message.success("Account created successfully");
        navigate("/login");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          const errorMessage =
            typeof responseData === "string"
              ? responseData
              : (responseData?.messaage ??
                responseData.tittle ??
                (error.response?.status === 409
                  ? "This email is already registred."
                  : "Registration failed. Please try again."));
          message.error(errorMessage);
        } else {
          message.error("Unable o create your account. Please try again");
        }
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema,
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  return (
    <div className={`flex flex-col gap-6 ${className ?? ""}`} {...props}>
      <Card className="rounded-xl" styles={{ body: { padding: 24 } }}>
        <div className="mb-6 text-center">
          <Typography.Title level={4} className="!mb-1">
            Create your account
          </Typography.Title>
          <Typography.Text type="secondary">
            Enter your email below to create your account
          </Typography.Text>
        </div>
        <Form layout="vertical" onFinish={formik.submitForm}>
          <div className="flex flex-col gap-4">
            <Form.Item
              label="Full Name"
              className="!mb-0"
              validateStatus={
                formik.touched.name && formik.errors.name ? "error" : ""
              }
              help={formik.touched.name && formik.errors.name}
            >
              {" "}
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
            </Form.Item>
            <Form.Item
              label="Email"
              className="!mb-0"
              validateStatus={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
              help={formik.touched.email && formik.errors.email}
            >
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Password"
                className="!mb-0"
                validateStatus={
                  formik.touched.password && formik.errors.password
                    ? "error"
                    : ""
                }
                help={formik.touched.password && formik.errors.password}
              >
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                className="!mb-0"
                validateStatus={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "error"
                    : ""
                }
                help={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              >
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
            </div>
            <Typography.Paragraph type="secondary" className="!mb-0 text-xs">
              Must be at least 8 characters long.
            </Typography.Paragraph>
            <div>
              <Button type="primary" htmlType="submit" block>
                Create Account
              </Button>
              <Typography.Paragraph
                type="secondary"
                className="!mb-0 !mt-2 text-center"
              >
                Already have an account? <Link to="/login">Sign in</Link>
              </Typography.Paragraph>
            </div>
          </div>
        </Form>
      </Card>
      <Typography.Paragraph type="secondary" className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </Typography.Paragraph>
    </div>
  );
}
