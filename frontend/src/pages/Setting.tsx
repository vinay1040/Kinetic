import { ProfileForm } from "@/components/auth/profile-form";
import { AddressForm } from "@/components/auth/address-form";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>

        <p className="mt-1 text-gray-500">
          Manage your personal information and delivery address.
        </p>
      </div>

      {/* Personal Information */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold">
          Personal Information
        </h2>

        <ProfileForm />
      </div>

      {/* Delivery Address */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold">
          Delivery Address
        </h2>

        <AddressForm />
      </div>
    </div>
  );
};

export default Settings;