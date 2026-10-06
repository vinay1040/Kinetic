import { useAuth } from "@/context/AuthContext";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd";
import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router";
import * as Yup from "yup";

type LoginType = "user" | "admin";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const authenticatedUser = await login(values.email, values.password);

        if (!authenticatedUser) {
          message.error("Invalid email or password");
          return;
        }

        message.success("Login successful!");

        if (authenticatedUser.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;

          const errorMessage =
            typeof responseData === "string"
              ? responseData
              : (responseData?.message ??
                responseData?.tittle ??
                "Invalid email or password.");
          message.error(errorMessage);
        } else {
          message.error(
            "Unable to log in. Please try again."
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={`flex flex-col gap-6 ${className ?? ""}`} {...props}>
      <Card className="rounded-xl" styles={{ body: { padding: 24 } }}>
        <div className="mb-6 text-center">
          <Typography.Title level={4} className="!mb-1">
            Welcome back
          </Typography.Title>
          <Typography.Text type="secondary">
            Login with your Apple or Google account
          </Typography.Text>
        </div>
        <Form layout="vertical" onFinish={() => formik.submitForm()}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Button type="default" htmlType="button" block>
                Login with Apple
              </Button>
              <Button type="default" htmlType="button" block>
                Login with Google
              </Button>
            </div>
            <Divider className="!my-0">Or continue with</Divider>
            <Form.Item
              label="Email"
              className="!mb-0"
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
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="m@example.com"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              className="!mb-0"
              validateStatus={
                formik.touched.password && formik.errors.password ? "error" : ""
              }
              help={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : null
              }
            >
              <Input.Password
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your password"
              />
            </Form.Item>
            <div>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={formik.isSubmitting}
              >
                Login
              </Button>
              <Typography.Paragraph
                type="secondary"
                className="!mb-0 !mt-2 text-center"
              >
                Don&apos;t have an account? <Link to="/signUp">Sign up</Link>
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
