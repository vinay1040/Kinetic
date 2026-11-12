
import { Pencil, UserRound } from "lucide-react";

interface PersonalInformationProps {
  onClick: () => void;
}

export const PersonalInformation = ({
  onClick,
}: PersonalInformationProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-5 border-b border-slate-200 px-2 py-3 text-left transition hover:bg-slate-50"
    >
      <UserRound className="mt-1 shrink-0" size={25} />

      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">Personal Information</h2>
        <p className="mt-2 text-sm text-slate-500">
          Display name and email. Edit your profile information.
        </p>
      </div>

      <Pencil className="shrink-0" size={20} />
    </button>
  );
};
