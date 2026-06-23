import { Page } from '@playwright/test';

export type AuthTokenSource = 'localStorage' | 'sessionStorage' | 'cookie';

export type AuthTokenResult = {
  jwt: string;
  bearer: string;
  source: AuthTokenSource;
  key: string;
};

const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const TOKEN_KEY_HINTS = ['token', 'access', 'jwt', 'auth', 'session','accessToken'];

function parsePossibleJwt(value: string): string | null {
  const trimmed = value.trim();

  if (JWT_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (/^Bearer\s+/i.test(trimmed)) {
    const token = trimmed.replace(/^Bearer\s+/i, '').trim();
    return JWT_PATTERN.test(token) ? token : null;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return findJwtInValue(parsed);
  } catch {
    return null;
  }
}

function findJwtInValue(value: unknown): string | null {
  if (typeof value === 'string') {
    return parsePossibleJwt(value);
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  for (const [key, childValue] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();
    if (TOKEN_KEY_HINTS.some((hint) => normalizedKey.includes(hint))) {
      const token = findJwtInValue(childValue);
      if (token) {
        return token;
      }
    }
  }

  for (const childValue of Object.values(value)) {
    const token = findJwtInValue(childValue);
    if (token) {
      return token;
    }
  }

  return null;
}

async function findJwtInWebStorage(
  page: Page,
  storageName: 'localStorage' | 'sessionStorage'
): Promise<AuthTokenResult | null> {
  const entries = await page.evaluate((name) => {
    const storage = window[name];
    return Array.from({ length: storage.length }, (_, index) => {
      const key = storage.key(index) || '';
      return [key, storage.getItem(key) || ''] as const;
    });
  }, storageName);

  for (const [key, value] of entries) {
    const token = parsePossibleJwt(value);
    if (token) {
      return {
        jwt: token,
        bearer: `Bearer ${token}`,
        source: storageName,
        key,
      };
    }
  }

  return null;
}

export async function getJwtFromBrowser(page: Page): Promise<AuthTokenResult> {
  const localStorageToken = await findJwtInWebStorage(page, 'localStorage');
  if (localStorageToken) {
    return localStorageToken;
  }

  const sessionStorageToken = await findJwtInWebStorage(page, 'sessionStorage');
  if (sessionStorageToken) {
    return sessionStorageToken;
  }

  const cookies = await page.context().cookies();
  for (const cookie of cookies) {
    const token = parsePossibleJwt(cookie.value);
    if (token) {
      return {
        jwt: token,
        bearer: `Bearer ${token}`,
        source: 'cookie',
        key: cookie.name,
      };
    }
  }

  throw new Error('[authToken] Cannot find JWT in localStorage, sessionStorage, or cookies.');
}

export async function getBearerAuthHeader(page: Page): Promise<{ Authorization: string }> {
  const token = await getJwtFromBrowser(page);
  return { Authorization: token.bearer };
}
