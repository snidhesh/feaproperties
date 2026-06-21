/**
 * Lead form validation — shared between client (React Hook Form via resolver)
 * and server (/api/lead POST handler). Two-tier check matches the plan:
 *   1. Client-side: instant feedback as the user fills the form
 *   2. Server-side: re-validate before any external POST (BrokerDesk intake
 *      is still on hold per current direction — server route logs + returns
 *      success; swap stub for actual fetch once the lead-intake key lands)
 */

import {z} from 'zod';

// E.164-ish phone — country code + 7-15 digits. We accept spaces/dashes during
// typing and strip them server-side before validation.
const PHONE_REGEX = /^\+?\d{7,15}$/;

export const ContactFormSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'firstNameMin')
      .max(60, 'firstNameMax'),
    lastName: z
      .string()
      .trim()
      .min(2, 'lastNameMin')
      .max(60, 'lastNameMax'),
    email: z.string().trim().email('emailInvalid').max(120, 'emailMax'),
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s-]/g, ''))
      .refine((v) => v === '' || PHONE_REGEX.test(v), 'phoneInvalid')
      .optional()
      .or(z.literal('')),
    interest: z.enum([
      'buying',
      'selling',
      'renting',
      'offplan',
      'management',
      'general',
    ]),
    message: z.string().trim().max(2000, 'messageMax').optional().or(z.literal('')),
    consent: z.boolean().refine((v) => v === true, {message: 'consentRequired'}),
    // Honeypot — bots fill this; humans don't see it
    website: z.string().max(0, 'spam').optional().or(z.literal('')),
  });

export type ContactFormValues = z.infer<typeof ContactFormSchema>;

// Server-side payload — includes context the client cannot be trusted to set
export const LeadServerSchema = ContactFormSchema.extend({
  source: z.enum([
    'contact-page',
    'property-inquiry',
    'consultation',
    'footer',
    'newsletter',
  ]),
  locale: z.enum(['en', 'ar']),
  pageUrl: z.string().url().max(500),
  submittedAt: z.string().datetime(),
});

export type LeadServerPayload = z.infer<typeof LeadServerSchema>;
