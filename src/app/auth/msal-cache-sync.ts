import type { AuthenticationResult } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

const PREFIX = 'msal';
const CREDENTIAL_SCHEMA_VERSION = 2;
const SEP = '|';
/** Key riêng để không ghi đè cache MSAL (MSAL 5.x có thể mã hóa), user vẫn thấy entry cùng cấu trúc */
const PLAIN_KEY_SUFFIX = '.plain';

/** Key cố định trong localStorage để app get token dễ dàng (không phụ thuộc key dài do MSAL tạo) */
export const MSAL_TOKEN_STORAGE_KEY = 'numonix.msal.token';

export interface StoredMsalToken {
  accessToken: string;
  expiresOn: number;
  homeAccountId: string;
  environment?: string;
  realm?: string;
}

/**
 * Tạo entry localStorage theo cấu trúc MSAL AccessToken cache mỗi lần đăng nhập thành công.
 * Dùng key có hậu tố .plain để không đụng cache MSAL, value vẫn đúng format (cachedAt, secret, target, ...).
 */
export function syncMsalCacheEntryToStorage(result: AuthenticationResult): void {
  try {
    const account = result.account;
    if (!account) return;
    const clientId = environment.msalConfig.clientId;
    const homeAccountId = account.homeAccountId;
    const env = account.environment || 'login.windows.net';
    const realm = account.tenantId || realmFromAuthority(environment.msalConfig.authority);
    const target = Array.isArray(result.scopes) ? result.scopes.join(' ').toLowerCase() : 'openid profile email';

    const nowMs = Date.now();
    const nowSec = Math.floor(nowMs / 1000);
    const expiresOn = result.expiresOn instanceof Date
      ? Math.floor(result.expiresOn.getTime() / 1000)
      : nowSec + 3600;
    const extExpires = (result as { extExpiresOn?: Date }).extExpiresOn;
    const extendedExpiresOn = extExpires instanceof Date
      ? Math.floor(extExpires.getTime() / 1000)
      : expiresOn + 82800; // +23h nếu không có

    const keyParts = [
      `${PREFIX}.${CREDENTIAL_SCHEMA_VERSION}${PLAIN_KEY_SUFFIX}`,
      homeAccountId,
      env,
      'AccessToken',
      clientId,
      realm,
      target,
      '',
    ];
    const cacheKey = keyParts.join(SEP).toLowerCase();

    const value = {
      cachedAt: String(nowSec),
      clientId,
      credentialType: 'AccessToken',
      environment: env,
      expiresOn: String(expiresOn),
      extendedExpiresOn: String(extendedExpiresOn),
      homeAccountId,
      lastUpdatedAt: String(nowMs),
      realm,
      secret: result.accessToken,
      target,
      tokenType: 'Bearer',
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify(value));
      // Ghi thêm vào key cố định để get dễ: localStorage.getItem(MSAL_TOKEN_STORAGE_KEY)
      const simplePayload: StoredMsalToken = {
        accessToken: result.accessToken,
        expiresOn: typeof expiresOn === 'number' ? expiresOn : parseInt(String(expiresOn), 10),
        homeAccountId,
        environment: env,
        realm,
      };
      localStorage.setItem(MSAL_TOKEN_STORAGE_KEY, JSON.stringify(simplePayload));
    }
  } catch (err) {
    console.warn('[MSAL cache sync] Failed to write cache entry:', err);
  }
}

/**
 * Lấy token từ localStorage qua key cố định (dễ get hơn key dài của MSAL).
 * Chỉ dùng khi cần đọc nhanh; refresh token vẫn nên qua MsalService.acquireTokenSilent().
 */
export function getMsalTokenFromStorage(): StoredMsalToken | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MSAL_TOKEN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredMsalToken;
  } catch {
    return null;
  }
}

/** Xóa entry token đơn giản (gọi khi logout để đồng bộ). */
export function clearMsalTokenFromStorage(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(MSAL_TOKEN_STORAGE_KEY);
  }
}

function realmFromAuthority(authority: string): string {
  const match = authority.match(/([^/]+)\/?$/);
  return match ? match[1] : '';
}
