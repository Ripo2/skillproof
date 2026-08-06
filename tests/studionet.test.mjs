import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const deployment = JSON.parse(
  fs.readFileSync(path.resolve("deployment.json"), "utf8"),
);
const deployed = /^0x[0-9a-fA-F]{40}$/.test(deployment.contractAddress || "");
const client = createClient({ chain: studionet });

async function read(functionName, args = []) {
  assert.ok(deployed);
  return client.readContract({
    address: deployment.contractAddress,
    functionName,
    args,
    jsonSafeReturn: true,
  });
}

test(
  "deployed protocol exposes SkillProof configuration",
  { skip: !deployed },
  async () => {
    const protocol = await read("get_protocol_config");
    assert.equal(protocol.configured, true);
    assert.ok(protocol.scoring_charter.length >= 80);
  },
);

test(
  "deployed bootstrap exposes bounded professional records",
  { skip: !deployed },
  async () => {
    const bootstrap = await read("get_frontend_bootstrap");
    assert.ok(Array.isArray(bootstrap.recent_tracks));
    assert.ok(bootstrap.recent_tracks.length <= 8);
    assert.equal(typeof bootstrap.counts.passports, "number");
  },
);

test("dedicated wallet wrote a professional passport", async () => {
  const passport = await read("get_passport", ["skillproof-studionet"]);
  assert.equal(passport.passport_id, "skillproof-studionet");
  assert.equal(
    passport.owner.toLowerCase(),
    deployment.walletAddress.toLowerCase(),
  );
  assert.equal(passport.active, true);
});
