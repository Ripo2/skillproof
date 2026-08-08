import { Check, LoaderCircle, TriangleAlert, WalletCards } from "lucide-react";
import type { TxState } from "@/lib/types";

export function TransactionNote({ state }: { state: TxState }) {
  if (state.stage === "idle") return null;
  const pending = ["wallet", "submitted", "finalizing"].includes(state.stage);
  return (
    <div className={`transaction-note ${state.stage}`} role="status">
      {pending ? (
        <LoaderCircle className="spin" size={16} />
      ) : state.stage === "finalized" ? (
        <Check size={16} />
      ) : state.stage === "failed" ? (
        <TriangleAlert size={16} />
      ) : (
        <WalletCards size={16} />
      )}
      <span>
        <strong>{state.action || "Passport action"}</strong>
        <small>
          {state.error ||
            (state.stage === "wallet"
              ? "Confirm in your wallet."
              : state.stage === "submitted"
                ? "Submitted to GenLayer."
                : state.stage === "finalizing"
                  ? "Waiting for validator consensus."
                  : "Finalized by majority agreement.")}
        </small>
      </span>
    </div>
  );
}
