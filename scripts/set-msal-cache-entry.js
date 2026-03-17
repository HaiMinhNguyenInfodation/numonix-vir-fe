/**
 * Script tạo 1 entry localStorage giống cấu trúc MSAL AccessToken cache (như trong ảnh).
 * Chạy trong Console (F12) khi đang mở trang app (ví dụ http://localhost:4200).
 *
 * Cách dùng: copy toàn bộ nội dung file này và paste vào Console, Enter.
 */

(function () {
  const PREFIX = 'msal';
  const CREDENTIAL_SCHEMA_VERSION = 2;
  const SEP = '|';

  // Dữ liệu từ ảnh (có thể sửa secret nếu bạn có token thật)
  const homeAccountId =
    '852afa1f-f964-47e5-aff6-a4ba4ae7bef4.967731f1-e365-496e-b378-fcb5b0c71157';
  const environment = 'login.windows.net';
  const clientId = '459e40d6-e96a-4c4e-833f-f43bd5d71885'; // clientId từ environment.development.ts
  const realm = '967731f1-e365-496e-b378-fcb5b0c71157';
  const target = 'openid profile User.Read email';

  // Key = msal.2|homeAccountId|environment|credentialType|clientId|realm|target|scheme (lowercase)
  const credentialType = 'AccessToken';
  const scheme = ''; // Bearer => scheme rỗng
  const keyParts = [
    `${PREFIX}.${CREDENTIAL_SCHEMA_VERSION}`,
    homeAccountId,
    environment,
    credentialType,
    clientId,
    realm,
    target,
    scheme,
  ];
  const cacheKey = keyParts.join(SEP).toLowerCase();

  const value = {
    cachedAt: '1773719329',
    clientId,
    credentialType,
    environment,
    expiresOn: '1773802127',
    extendedExpiresOn: '1773884926',
    homeAccountId,
    lastUpdatedAt: '1773719329818',
    realm,
    secret:
      'ey3BeXA101JKV1QiLCJub25jZ5I6ImRzam95bUhFVJNHNGSMSzteU1G@21sV0lsbzF', // Thay bằng access token JWT thật nếu cần
    target,
    tokenType: 'Bearer',
  };

  try {
    localStorage.setItem(cacheKey, JSON.stringify(value));
    console.log('Đã tạo MSAL cache entry trong localStorage.');
    console.log('Key:', cacheKey);
    console.log('Value:', value);
  } catch (e) {
    console.error('Lỗi khi ghi localStorage:', e);
  }
})();
