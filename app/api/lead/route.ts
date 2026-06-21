/**
 * POST /api/lead
 *
 * Receives lead submissions from every form on the site (currently just
 * /contact). Re-validates with Zod, checks honeypot, and (for now) logs a
 * PII-redacted line + returns success.
 *
 * BrokerDesk POST is intentionally NOT wired here yet — pending customer
 * decision on the lead-intake key. To wire it later: fetch BrokerDesk's
 * /api/v1/public/intake/leads with the CRM_LEAD_API_KEY header and the
 * payload shape confirmed via probe.
 */

import {NextResponse, type NextRequest} from 'next/server';
import {LeadServerSchema} from '@/lib/validation/lead';
import {randomUUID} from 'node:crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      {error: 'badRequest', message: 'Request body must be JSON'},
      {status: 400},
    );
  }

  const parsed = LeadServerSchema.safeParse(json);
  if (!parsed.success) {
    // Don't leak field-level errors in production — the client already
    // validated, so any failure here is either malicious or a bug.
    return NextResponse.json(
      {error: 'validation', message: 'Invalid payload'},
      {status: 400},
    );
  }

  const data = parsed.data;

  // Honeypot — bots fill this field; humans never see it
  if (data.website && data.website.length > 0) {
    // Pretend success so the bot doesn't retry
    return NextResponse.json({ok: true, leadId: 'noop'}, {status: 200});
  }

  const leadId = randomUUID();

  // PII-redacted log line — matches the privacy boundary defined in the plan
  console.info('[lead] received', {
    leadId,
    source: data.source,
    interest: data.interest,
    locale: data.locale,
    submittedAt: data.submittedAt,
    hasPhone: !!data.phone,
    hasMessage: !!data.message,
  });

  // TODO(Phase 1.10): when CRM_LEAD_API_KEY is set, POST to BrokerDesk:
  //
  //   await fetch(`${CRM_BASE_URL}/api/v1/public/intake/leads`, {
  //     method: 'POST',
  //     headers: {'x-api-key': CRM_LEAD_API_KEY, 'Content-Type': 'application/json'},
  //     body: JSON.stringify(adaptLeadForBrokerDesk(data, leadId)),
  //   });
  //
  // Also: fire Resend auto-reply + office notification.

  return NextResponse.json({ok: true, leadId}, {status: 200});
}
