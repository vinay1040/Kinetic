import { useState } from "react";

import { ProfileForm } from "@/components/auth/profile-form";
import { PersonalInformation } from "./features/personalInformation";
import { SavedAddresses } from "./features/SavedAddress";
import { AccountSecurity } from "./features/AccountSecurity";
import { SavedAddressesPanel } from "./features/AddressFeature/SavedAddressPanel";

export const SettingPage = () => {
  const [activeSection, setActiveSection] = useState<
    "profile" | "addresses" | null
  >(null);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="mt-1 text-slate-500">
          Manage your profile, delivery addresses, and account security.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {activeSection === null ? (
          <>
            <PersonalInformation onClick={() => setActiveSection("profile")} />
            <SavedAddresses onClick={() => setActiveSection("addresses")} />
            <AccountSecurity />
          </>
        ) : (
          <div className="p-6">
            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="mb-5 text-sm text-slate-500 hover:text-slate-900"
            >
              ← Back to settings
            </button>

            {activeSection === "profile" && (
              <>
                <h2 className="mb-5 text-lg font-semibold">
                  Edit Personal Information
                </h2>
                <ProfileForm onCancel={() => setActiveSection(null)} />
              </>
            )}

            {activeSection === "addresses" && <SavedAddressesPanel />}
          </div>
        )}
      </div>
    </div>
  );
};
