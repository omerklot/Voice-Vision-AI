import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendLeadEmail } from '@/lib/email';

/* ─── In-memory rate limiter ─────────────────────────────────────── */
// Note: resets on serverless cold starts — for production use Upstash/Redis.
const _rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW = 60_000; // 1 minute
const RATE_MAX = 5;         // 5 requests per IP per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = _rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    _rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_MAX) return true;
  entry.count++;
  return false;
}

/* ─── Server-side validation schema ─────────────────────────────── */
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  jobTitle: z.string().min(2),
  phone: z.string().optional(),
  productInterest: z.enum([
    'AI Vision & OCR',
    'Conversational Voice Agents',
    'Both',
    'Not sure yet',
  ]),
  message: z.string().optional(),
});

/* ─── POST /api/contact ──────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  // Rate limit check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  try {
    // Parse body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: result.error.issues },
        { status: 400 }
      );
    }

    // Send email
    const emailResult = await sendLeadEmail(result.data);
    if (!emailResult.success) {
      console.error('[api/contact] Email failed:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send your request. Please try again or email us directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/contact] Unhandled error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
