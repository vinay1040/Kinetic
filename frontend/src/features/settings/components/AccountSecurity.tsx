import { LockKeyhole, ShieldCheck } from "lucide-react";
interface AccountSecurityInterface {
  onClick: () => void;
}
export const AccountSecurity = ({ onClick }: AccountSecurityInterface) => {
  return (
    <div >
      <button onClick={onClick} className="flex w-full items-start gap-5 border-b border-slate-200 px-2 py-3 text-left transition hover:bg-slate-50">
        <ShieldCheck className="mt-1 shrink-0" size={25} />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">Security</h2>
          <p className="mt-2 text-sm text-slate-500">
            Change your password, review active sessions, and manage account
            security when the backend supports these operations.
          </p>
        </div>

        <LockKeyhole className="shrink-0" size={20} />
      </button>
    </div>
  );
};
