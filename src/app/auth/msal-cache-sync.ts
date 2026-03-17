import type { AuthenticationResult } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

const PREFIX = 'msal';
const CREDENTIAL_SCHEMA_VERSION = 2;
const SEP = '|';
/** Key riêng để không ghi đè cache MSAL (MSAL 5.x có thể mã hóa), user vẫn thấy entry cùng cấu trúc */
const PLAIN_KEY_SUFFIX = '.plain';

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
    }
  } catch (err) {
    console.warn('[MSAL cache sync] Failed to write cache entry:', err);
  }
}

function realmFromAuthority(authority: string): string {
  const match = authority.match(/([^/]+)\/?$/);
  return match ? match[1] : '';
}
