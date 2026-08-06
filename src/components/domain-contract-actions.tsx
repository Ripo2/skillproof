"use client";

import { useState, type FormEvent } from "react";
import {
  BadgePlus,
  BookOpenCheck,
  Fingerprint,
  Link2,
  Save,
  SlidersHorizontal,
} from "lucide-react";
import { appConfig, defaultCharter } from "@/lib/config";
import {
  type ProofStation,
  useContractWorkflow,
} from "@/lib/contract-workflow";
import { deploymentReady } from "@/lib/deployment";
import { TransactionNote } from "@/components/transaction-note";

type DomainContractActionsProps = {
  trackId: string;
  compact?: boolean;
};

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  long?: boolean;
  required?: boolean;
};

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  long,
  required = true,
}: FieldProps) {
  return (
    <label className={long ? "dock-field long" : "dock-field"}>
      <span>{label}</span>
      {long ? (
        <textarea
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </label>
  );
}

export function DomainContractActions({
  trackId,
  compact = false,
}: DomainContractActionsProps) {
  const flow = useContractWorkflow("evidence");
  const [mode, setMode] = useState<"register" | "update">("register");
  const [values, setValues] = useState<Record<string, string>>({
    passportId: "",
    displayName: "",
    profileUrl: "",
    newTrackId: "",
    skillName: "",
    marketRole: "",
    targetLevel: "ADVANCED",
    standardUrl: "",
    claim: "",
    sampleId: "",
    title: "",
    sourceUrl: "",
    medium: "GITHUB",
    capability: "",
    authorship: "",
    protocolName: "SkillProof professional calibration",
    charter: defaultCharter,
  });

  function set(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submitIdentity(event: FormEvent) {
    event.preventDefault();
    try {
      if (mode === "register") {
        await flow.actions.registerPassport(
          values.passportId,
          values.displayName,
          values.profileUrl,
        );
      } else {
        await flow.actions.updatePassport(values.displayName, values.profileUrl);
      }
    } catch {
      // Transaction state renders the actionable error in the dock.
    }
  }

  async function submitTrack(event: FormEvent) {
    event.preventDefault();
    try {
      await flow.actions.openTrack(
        values.newTrackId,
        values.skillName,
        values.marketRole,
        values.targetLevel,
        values.standardUrl,
        values.claim,
      );
    } catch {
      // Transaction state renders the actionable error in the dock.
    }
  }

  async function submitEvidence(event: FormEvent) {
    event.preventDefault();
    try {
      await flow.actions.weaveSample(
        trackId || values.newTrackId,
        values.sampleId,
        values.title,
        values.sourceUrl,
        values.medium,
        values.capability,
        values.authorship,
      );
    } catch {
      // Transaction state renders the actionable error in the dock.
    }
  }

  async function submitProtocol(event: FormEvent) {
    event.preventDefault();
    try {
      await flow.actions.configureProtocol(values.protocolName, values.charter);
    } catch {
      // Transaction state renders the actionable error in the dock.
    }
  }

  const station = flow.selected;

  return (
    <section
      className={`proof-action-dock ${compact ? "compact" : ""}`}
      data-domain-control="proof-braid-action-dock"
    >
      <div className="dock-stations">
        <div className="dock-stations-label">
          <SlidersHorizontal size={16} />
          <span>BUILD STATION</span>
        </div>
        <div className="dock-station-buttons">
          {flow.methods.map((method) => (
            <button
              key={method.name}
              type="button"
              className={station === method.name ? "active" : ""}
              onClick={() => flow.choose(method.name as ProofStation)}
            >
              <span>{method.index}</span>
              {method.label}
            </button>
          ))}
        </div>
        {!deploymentReady && (
          <span className="preview-flag">INTERFACE PREVIEW / NO CHAIN WRITE</span>
        )}
      </div>

      {station === "identity" && (
        <form className="dock-form identity-composer" onSubmit={submitIdentity}>
          <div className="composer-lead">
            <Fingerprint size={23} />
            <div>
              <strong>Professional identity seal</strong>
              <small>One wallet can hold one non-transferable passport.</small>
            </div>
            <div className="mini-segment">
              <button
                type="button"
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
              >
                Register
              </button>
              <button
                type="button"
                className={mode === "update" ? "active" : ""}
                onClick={() => setMode("update")}
              >
                Update
              </button>
            </div>
          </div>
          {mode === "register" && (
            <Field
              label="Passport handle"
              name="passportId"
              value={values.passportId}
              onChange={(value) => set("passportId", value)}
              placeholder="maya-product"
            />
          )}
          <Field
            label="Professional name"
            name="displayName"
            value={values.displayName}
            onChange={(value) => set("displayName", value)}
            placeholder="Maya Chen"
          />
          <Field
            label="Public profile"
            name="profileUrl"
            type="url"
            value={values.profileUrl}
            onChange={(value) => set("profileUrl", value)}
            placeholder="https://..."
          />
          <button className="dock-submit" type="submit">
            <Save size={16} />
            {mode === "register" ? "Seal passport" : "Save identity"}
          </button>
        </form>
      )}

      {station === "track" && (
        <form className="dock-form track-composer" onSubmit={submitTrack}>
          <div className="composer-lead">
            <BadgePlus size={23} />
            <div>
              <strong>Open a skill track</strong>
              <small>Define one professional claim against one public standard.</small>
            </div>
          </div>
          <Field
            label="Track ID"
            name="newTrackId"
            value={values.newTrackId}
            onChange={(value) => set("newTrackId", value)}
            placeholder="product-systems"
          />
          <Field
            label="Skill"
            name="skillName"
            value={values.skillName}
            onChange={(value) => set("skillName", value)}
            placeholder="Product systems design"
          />
          <Field
            label="Market role"
            name="marketRole"
            value={values.marketRole}
            onChange={(value) => set("marketRole", value)}
            placeholder="Senior product designer"
          />
          <label className="dock-field">
            <span>Target level</span>
            <select
              value={values.targetLevel}
              onChange={(event) => set("targetLevel", event.target.value)}
            >
              {appConfig.levels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
          <Field
            label="Market standard"
            name="standardUrl"
            type="url"
            value={values.standardUrl}
            onChange={(value) => set("standardUrl", value)}
            placeholder="https://..."
          />
          <Field
            label="Claim statement"
            name="claim"
            value={values.claim}
            onChange={(value) => set("claim", value)}
            placeholder="Describe the capability you are proving."
            long
          />
          <button className="dock-submit" type="submit">
            <BookOpenCheck size={16} />
            Open track
          </button>
        </form>
      )}

      {station === "evidence" && (
        <form className="dock-form evidence-composer" onSubmit={submitEvidence}>
          <div className="composer-lead evidence-ticket-mark">
            <Link2 size={23} />
            <div>
              <strong>Weave a work sample</strong>
              <small>Attach attributable public work to one capability strand.</small>
            </div>
            <span>{trackId || "NO ACTIVE TRACK"}</span>
          </div>
          <Field
            label="Sample ID"
            name="sampleId"
            value={values.sampleId}
            onChange={(value) => set("sampleId", value)}
            placeholder="checkout-logic"
          />
          <Field
            label="Work title"
            name="title"
            value={values.title}
            onChange={(value) => set("title", value)}
            placeholder="Checkout recovery system"
          />
          <Field
            label="Public proof URL"
            name="sourceUrl"
            type="url"
            value={values.sourceUrl}
            onChange={(value) => set("sourceUrl", value)}
            placeholder="https://..."
          />
          <label className="dock-field">
            <span>Medium</span>
            <select
              value={values.medium}
              onChange={(event) => set("medium", event.target.value)}
            >
              {appConfig.media.map((medium) => (
                <option key={medium}>{medium}</option>
              ))}
            </select>
          </label>
          <Field
            label="Capability strand"
            name="capability"
            value={values.capability}
            onChange={(value) => set("capability", value)}
            placeholder="interaction-design"
          />
          <Field
            label="Authorship note"
            name="authorship"
            value={values.authorship}
            onChange={(value) => set("authorship", value)}
            placeholder="State exactly what you made and where it appears."
            long
          />
          <button className="dock-submit" type="submit" disabled={!trackId}>
            <Link2 size={16} />
            Weave into track
          </button>
        </form>
      )}

      {station === "protocol" && (
        <form className="dock-form protocol-composer" onSubmit={submitProtocol}>
          <div className="composer-lead">
            <BookOpenCheck size={23} />
            <div>
              <strong>Curator scoring charter</strong>
              <small>This protocol-level action is restricted to the deployer.</small>
            </div>
          </div>
          <Field
            label="Protocol name"
            name="protocolName"
            value={values.protocolName}
            onChange={(value) => set("protocolName", value)}
          />
          <Field
            label="Validator charter"
            name="charter"
            value={values.charter}
            onChange={(value) => set("charter", value)}
            long
          />
          <button className="dock-submit" type="submit">
            <Save size={16} />
            Set scoring charter
          </button>
        </form>
      )}

      <TransactionNote state={flow.transaction.state} />
    </section>
  );
}
