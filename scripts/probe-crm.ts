/**
 * Phase 0 — CRM Discovery probe.
 *
 * Hits FEA's CRM properties endpoint with the API key, dumps the raw response
 * into probe-output/ (gitignored), and prints an inferred field-shape summary
 * so we can fill the CRM Capability Matrix without guessing.
 *
 * Also performs a single test POST to the lead endpoint with a clearly-marked
 * dummy payload to confirm: endpoint reachable, required fields, response shape.
 *
 * Throwaway script. Once Phase 0 closes, the normalized types live in
 * scripts/types.draft.ts → promoted to lib/crm/types.ts in Phase 1.4.
 */

import 'dotenv/config';
import {writeFileSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.CRM_BASE_URL?.replace(/\/$/, '');
const KEY = process.env.CRM_API_KEY;
const AUTH_HEADER = process.env.CRM_AUTH_HEADER ?? 'Authorization';
const AUTH_PREFIX = process.env.CRM_AUTH_PREFIX ?? 'Bearer';
const PROPERTIES_PATH = process.env.CRM_PROPERTIES_PATH ?? '/properties';
const LEAD_PATH = process.env.CRM_LEAD_PATH ?? '/leads';

if (!BASE || !KEY) {
  console.error('❌ Missing CRM_BASE_URL or CRM_API_KEY.');
  console.error('   Copy .env.example → .env and fill in the values.');
  process.exit(1);
}

// BrokerDesk: lead-intake uses a SEPARATE key generated under Integrations → Lead Intake API
const LEAD_KEY = process.env.CRM_LEAD_API_KEY || KEY;

const OUT_DIR = join(process.cwd(), 'probe-output');
mkdirSync(OUT_DIR, {recursive: true});

const buildAuthValue = (k: string) =>
  AUTH_PREFIX.length > 0 ? `${AUTH_PREFIX} ${k}` : k;

const readHeaders: Record<string, string> = {
  [AUTH_HEADER]: buildAuthValue(KEY),
  Accept: 'application/json',
};
const leadHeaders: Record<string, string> = {
  [AUTH_HEADER]: buildAuthValue(LEAD_KEY),
  Accept: 'application/json',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function describe(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Array<empty>';
    return `Array<${describe(value[0])}> (len=${value.length})`;
  }
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'string (ISO date?)';
    if (/^https?:\/\//.test(value)) return 'string (URL)';
    return 'string';
  }
  return typeof value;
}

function summariseShape(obj: unknown, label: string, depth = 0): void {
  const indent = '  '.repeat(depth);
  if (typeof obj !== 'object' || obj === null) {
    console.log(`${indent}${label}: ${describe(obj)}`);
    return;
  }
  console.log(`${indent}${label}:`);
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      console.log(`${indent}  (empty array)`);
      return;
    }
    summariseShape(obj[0], '[0]', depth + 1);
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (
      v !== null &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      depth < 2
    ) {
      summariseShape(v, k, depth + 1);
    } else {
      console.log(`${indent}  ${k}: ${describe(v)}`);
    }
  }
}

function pickFirstItem(parsed: unknown): {item: unknown; container: string} | null {
  if (Array.isArray(parsed) && parsed.length > 0) {
    return {item: parsed[0], container: 'root[]'};
  }
  if (parsed !== null && typeof parsed === 'object') {
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (Array.isArray(v) && v.length > 0) {
        return {item: v[0], container: `root.${k}[]`};
      }
    }
  }
  return null;
}

async function parseBody(res: Response): Promise<{text: string; json: unknown}> {
  const text = await res.text();
  let json: unknown = text;
  try {
    json = JSON.parse(text);
  } catch {
    /* not JSON */
  }
  return {text, json};
}

// ─────────────────────────────────────────────────────────────────────────────
// Probes
// ─────────────────────────────────────────────────────────────────────────────

async function probeProperties() {
  const url = `${BASE}${PROPERTIES_PATH}`;
  console.log(`\n▶ GET ${url}`);
  let res: Response;
  try {
    res = await fetch(url, {headers: readHeaders});
  } catch (err) {
    console.error(`  ❌ Network error: ${(err as Error).message}`);
    return;
  }

  console.log(`  status: ${res.status} ${res.statusText}`);
  console.log(`  content-type: ${res.headers.get('content-type')}`);

  const {json} = await parseBody(res);
  const outFile = join(OUT_DIR, 'properties.raw.json');
  writeFileSync(outFile, JSON.stringify(json, null, 2));
  console.log(`  ✓ raw response saved → probe-output/properties.raw.json`);

  const first = pickFirstItem(json);
  if (first) {
    console.log(`\n  ── inferred shape (${first.container}) ──`);
    summariseShape(first.item, 'item');
  } else {
    console.log('  ⚠ No array of items found in response; review the raw file.');
  }
}

async function probeLead() {
  const url = `${BASE}${LEAD_PATH}`;
  console.log(`\n▶ POST ${url} (dummy payload)`);

  const samplePayload = {
    name: 'CRM Probe (please ignore)',
    email: 'probe@feaproperties.invalid',
    phone: '+971501234567',
    message:
      'Automated discovery probe from FEA website rebuild. Safe to delete.',
    source: 'website-probe',
    submittedAt: new Date().toISOString(),
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        ...leadHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(samplePayload),
    });
  } catch (err) {
    console.error(`  ❌ Network error: ${(err as Error).message}`);
    return;
  }

  console.log(`  status: ${res.status} ${res.statusText}`);
  const {json} = await parseBody(res);

  const outFile = join(OUT_DIR, 'lead-post.response.json');
  writeFileSync(
    outFile,
    JSON.stringify(
      {request: samplePayload, status: res.status, response: json},
      null,
      2
    )
  );
  console.log(`  ✓ request + response saved → probe-output/lead-post.response.json`);

  if (res.status >= 200 && res.status < 300) {
    console.log(`  ✓ Lead endpoint accepts POST and returned ${res.status}.`);
  } else if (res.status === 422 || res.status === 400) {
    console.log(
      `  ⚠ Validation error (${res.status}) — likely a field mismatch. Inspect the response to learn the required schema.`
    );
  } else if (res.status === 401 || res.status === 403) {
    console.log(
      `  ❌ Auth failed (${res.status}). Check CRM_AUTH_HEADER / CRM_AUTH_PREFIX / CRM_API_KEY.`
    );
  } else if (res.status === 404) {
    console.log(
      `  ❌ Endpoint not found. Set CRM_LEAD_PATH in .env to the correct path.`
    );
  } else {
    console.log(`  ⚠ Unexpected status ${res.status} — inspect the response.`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry
// ─────────────────────────────────────────────────────────────────────────────

(async () => {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' FEA CRM Probe — Phase 0 discovery');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`base       : ${BASE}`);
  console.log(`auth       : ${AUTH_HEADER}: ${AUTH_PREFIX ? AUTH_PREFIX + ' ' : ''}<key>`);
  console.log(`props      : ${PROPERTIES_PATH}  (using CRM_API_KEY)`);
  console.log(
    `leads      : ${LEAD_PATH}  (using ${LEAD_KEY === KEY ? 'CRM_API_KEY — likely wrong for BrokerDesk' : 'CRM_LEAD_API_KEY'})`
  );

  await probeProperties();
  await probeLead();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(' Probe complete. Review files in probe-output/ then');
  console.log(' fill the CRM Capability Matrix in the plan file.');
  console.log('═══════════════════════════════════════════════════════════════\n');
})().catch((err) => {
  console.error('Probe failed:', err);
  process.exit(1);
});
