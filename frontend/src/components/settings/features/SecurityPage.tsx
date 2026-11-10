import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { message } from "antd";
import { useChangePassword } from "@/hooks/CustomerHook/useChangePassword";

const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),

  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

export const SecurityPage = () => {
  const changePasswordMutation = useChangePassword();

  return (
    <section className="border-t border-slate-200 p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Password & Security
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your password to keep your account secure.
        </p>
      </div>

      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          changePasswordMutation.mutate(
            {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            },
            {
              onSuccess: () => {
                message.success("Password changed successfully.");
                resetForm();
              },
              onError: (error: any) => {
                message.error(
                  error.response?.data?.message || "Unable to change password.",
                );
              },
            },
          );
        }}
      >
        {() => (
          <Form className="max-w-lg space-y-5">
            {[
              {
                name: "currentPassword",
                label: "Current password",
                autoComplete: "current-password",
              },
              {
                name: "newPassword",
                label: "New password",
                autoComplete: "new-password",
              },
              {
                name: "confirmPassword",
                label: "Confirm new password",
                autoComplete: "new-password",
              },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {field.label}
                </label>

                <Field
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete={field.autoComplete}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

                <ErrorMessage
                  name={field.name}
                  component="p"
                  className="mt-1 break-words text-sm text-red-500"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changePasswordMutation.isPending
                ? "Updating..."
                : "Update password"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};
