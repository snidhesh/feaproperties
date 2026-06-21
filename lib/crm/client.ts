/**
 * BrokerDesk API client.
 *
 * Server-only. Reads env vars at module load. Uses Next.js fetch + ISR cache
 * tag so individual revalidations can be triggered later via a webhook
 * (Phase 2 — `/api/revalidate-properties`).
 */

import 'server-only';
import {BrokerDeskListResponseSchema, type BrokerDeskListing} from './types';

const BASE = process.env.CRM_BASE_URL?.replace(/\/$/, '');
const KEY = process.env.CRM_API_KEY;
const AUTH_HEADER = process.env.CRM_AUTH_HEADER ?? 'x-api-key';
const AUTH_PREFIX = process.env.CRM_AUTH_PREFIX ?? '';
const PROPERTIES_PATH =
  process.env.CRM_PROPERTIES_PATH ?? '/api/v1/public/listings';

const REVALIDATE_SECONDS = 600; // 10 min — matches the plan's ISR target
const CACHE_TAG = 'crm:properties';

function authValue(): string {
  if (!KEY) throw new Error('CRM_API_KEY missing in environment');
  return AUTH_PREFIX ? `${AUTH_PREFIX} ${KEY}` : KEY;
}

function authHeaders(): Record<string, string> {
  return {
    [AUTH_HEADER]: authValue(),
    Accept: 'application/json',
  };
}

export class CrmFetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'CrmFetchError';
  }
}

export async function fetchAllListings(): Promise<BrokerDeskListing[]> {
  if (!BASE) {
    throw new Error('CRM_BASE_URL missing in environment');
  }
  const url = `${BASE}${PROPERTIES_PATH}`;
  const res = await fetch(url, {
    headers: authHeaders(),
    next: {revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG]},
  });

  if (!res.ok) {
    throw new CrmFetchError(
      `BrokerDesk listings fetch failed (${res.status} ${res.statusText})`,
      res.status,
    );
  }

  const json: unknown = await res.json();
  const parsed = BrokerDeskListResponseSchema.safeParse(json);
  if (!parsed.success) {
    // Don't throw on individual schema mismatches — log + return what we can.
    // Phase 0 sample is tiny (4 listings); production inventory may surface
    // edge cases. Adapter is responsible for tolerating absent optional fields.
    console.error(
      '[crm] response failed Zod validation:',
      parsed.error.format(),
    );
    return [];
  }
  return parsed.data.data;
}
