import { AddressForm } from "@/components/auth/address-form";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Personal Information */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p>{user?.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Address</h2>

        <AddressForm />
      </div>
    </div>
  );
};

export default Profile;
