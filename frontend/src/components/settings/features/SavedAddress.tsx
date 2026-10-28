
import { ChevronRight, MapPin } from "lucide-react";

interface SavedAddressesProps {
  onClick: () => void;
}

export const SavedAddresses = ({ onClick }: SavedAddressesProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-5 border-b border-slate-200 px-2 py-3 text-left transition hover:bg-slate-50"
    >
      <MapPin className="mt-1 shrink-0" size={25} />

      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">Saved Addresses</h2>
        <p className="mt-2 text-sm text-slate-500">
          Show address cards, default address status, and Add, Edit, and Delete actions.
        </p>
      </div>

      <ChevronRight className="shrink-0" size={22} />
    </button>
  );
};
