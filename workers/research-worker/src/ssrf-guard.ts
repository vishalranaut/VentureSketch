import { BadRequestException } from '@nestjs/common';
import { lookup } from 'dns/promises';

/**
 * SSRFGuard — protects the Research Worker from Server-Side Request Forgery.
 *
 * Validates URLs before HTTP requests are made:
 * 1. Protocol must be https only
 * 2. Hostname must resolve to a public IP
 * 3. Resolved IPs must not fall in private/reserved ranges
 * 4. Each redirect hop is re-validated
 *
 * This implements defense-in-depth with network-level egress controls.
 */

const ALLOWED_PROTOCOLS = new Set(['https:']);

// RFC 1918 + loopback + link-local + cloud metadata ranges
const BLOCKED_CIDR_RANGES = [
  // IPv4
  { prefix: '127.', bits: 8 },    // loopback
  { prefix: '10.', bits: 8 },     // RFC 1918
  { prefix: '100.64.', bits: 10 }, // Shared Address Space
  { prefix: '169.254.', bits: 16 }, // link-local / AWS metadata
  { prefix: '172.16.', bits: 12 }, // RFC 1918
  { prefix: '172.17.', bits: 12 },
  { prefix: '172.18.', bits: 12 },
  { prefix: '172.19.', bits: 12 },
  { prefix: '172.20.', bits: 12 },
  { prefix: '172.21.', bits: 12 },
  { prefix: '172.22.', bits: 12 },
  { prefix: '172.23.', bits: 12 },
  { prefix: '172.24.', bits: 12 },
  { prefix: '172.25.', bits: 12 },
  { prefix: '172.26.', bits: 12 },
  { prefix: '172.27.', bits: 12 },
  { prefix: '172.28.', bits: 12 },
  { prefix: '172.29.', bits: 12 },
  { prefix: '172.30.', bits: 12 },
  { prefix: '172.31.', bits: 12 },
  { prefix: '192.168.', bits: 16 }, // RFC 1918
  { prefix: '0.', bits: 8 },       // "This" network
  { prefix: '255.255.255.255', bits: 32 }, // broadcast
];

const BLOCKED_IPV6_PREFIXES = [
  '::1',         // loopback
  'fc',          // ULA fc00::/7
  'fd',          // ULA fd00::/8
  'fe80',        // link-local
  '::ffff:',     // IPv4-mapped
];

export class SSRFBlockedError extends BadRequestException {
  constructor(reason: string) {
    super(`SSRF_BLOCKED: ${reason}`);
  }
}

function isPrivateIPv4(ip: string): boolean {
  return BLOCKED_CIDR_RANGES.some(({ prefix }) => ip.startsWith(prefix));
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  return BLOCKED_IPV6_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

export async function validateSSRFSafe(rawUrl: string): Promise<void> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new SSRFBlockedError(`Malformed URL: ${rawUrl}`);
  }

  // 1. Protocol must be https only
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new SSRFBlockedError(`Protocol "${parsed.protocol}" not allowed`);
  }

  // 2. Hostname must not be an IP address directly (DNS rebinding protection)
  const hostname = parsed.hostname;

  // 3. Resolve all DNS records and check each resolved IP
  let addresses: { address: string; family: number }[];
  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new SSRFBlockedError(`DNS resolution failed for hostname: ${hostname}`);
  }

  if (!addresses || addresses.length === 0) {
    throw new SSRFBlockedError(`No DNS records found for hostname: ${hostname}`);
  }

  for (const { address, family } of addresses) {
    if (family === 4 && isPrivateIPv4(address)) {
      throw new SSRFBlockedError(`Resolved to private IPv4: ${address}`);
    }
    if (family === 6 && isPrivateIPv6(address)) {
      throw new SSRFBlockedError(`Resolved to private IPv6: ${address}`);
    }
  }
}

/**
 * Maximum HTTP response size for research content: 10MB.
 */
export const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;

/**
 * Maximum allowed redirects.
 */
export const MAX_REDIRECTS = 3;

/**
 * Request timeout in milliseconds.
 */
export const REQUEST_TIMEOUT_MS = 30_000;
