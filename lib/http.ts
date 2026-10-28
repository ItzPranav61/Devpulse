import { NextResponse } from 'next/server';
import { GitHubError } from './github';

export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...CORS, ...headers } });
}

export function errorResponse(e: unknown) {
  if (e instanceof GitHubError) return json({ error: e.message }, e.status);
  console.error(e);
  return json({ error: 'Internal server error' }, 500);
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
}

export const preflight = () => new NextResponse(null, { status: 204, headers: CORS });

export const appUrl = () => (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
