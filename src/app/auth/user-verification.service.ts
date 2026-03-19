import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { clearMsalTokenFromStorage } from './msal-cache-sync';
import type {
  NumonixUsersApiResponse,
  NumonixUser,
  VerificationResult,
  VerificationFailureReason,
} from './user-verification.types';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const REQUIRED_LOGIN = 'LOGIN';
const REQUIRED_CALL_VIEW = 'CALL_VIEW';

/** Set to true to temporarily skip CALL_VIEW check (all users can open Reports). */
const SKIP_CALL_VIEW_CHECK = true;

interface CacheEntry {
  result: VerificationResult;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class UserVerificationService {
  private cache: CacheEntry | null = null;
  private cacheKey: string | null = null;

  constructor(
    private http: HttpClient,
    private msalService: MsalService
  ) {}

  /**
   * Verify the current MSAL user against Numonix tenant users API.
   * Returns allowed + canViewReports; uses in-memory cache with TTL.
   */
  verify(): Observable<VerificationResult> {
    const account = this.msalService.instance.getAllAccounts()[0];
    if (!account) {
      return of(this.failResult('no_match'));
    }

    const email = this.getAccountEmail(account);
    if (!email) {
      return of(this.failResult('no_match'));
    }

    const key = `${account.homeAccountId ?? email}`;
    if (this.cacheKey === key && this.cache && Date.now() < this.cache.expiresAt) {
      return of(this.cache.result);
    }

    const { apiBaseUrl, tenantId, nToken } = environment.numonixVerification ?? {};
    if (!apiBaseUrl || !tenantId || !nToken) {
      return of(this.failResult('error'));
    }

    const url = `${apiBaseUrl.replace(/\/$/, '')}/user/tenant/${tenantId}/users`;
    const headers = { 'n-token': nToken };

    return this.http.get<NumonixUsersApiResponse>(url, { headers }).pipe(
      map((res) => this.evaluateVerification(res, email)),
      catchError(() => of(this.failResult('error'))),
      map((result) => {
        this.cache = { result, expiresAt: Date.now() + CACHE_TTL_MS };
        this.cacheKey = key;
        return result;
      })
    );
  }

  getCachedResult(): VerificationResult | null {
    if (!this.cache || Date.now() >= this.cache.expiresAt) {
      return null;
    }
    return this.cache.result;
  }

  /** Clear cache (e.g. on logout) so next login re-verifies. */
  clearCache(): void {
    this.cache = null;
    this.cacheKey = null;
    clearMsalTokenFromStorage();
  }

  private getAccountEmail(account: { username?: string; idTokenClaims?: Record<string, unknown> }): string | null {
    const email =
      (account.idTokenClaims?.['preferred_username'] as string) ??
      account.username ??
      (account.idTokenClaims?.['email'] as string);
    return email && typeof email === 'string' ? email.trim() : null;
  }

  private failResult(reason: VerificationFailureReason): VerificationResult {
    return {
      allowed: false,
      canViewReports: false,
      reason,
    };
  }

  private evaluateVerification(res: NumonixUsersApiResponse, email: string): VerificationResult {
    const users = res?.item1 ?? [];
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(
      (u: NumonixUser) => (u.emailAddress ?? '').toLowerCase().trim() === normalizedEmail
    );

    if (!user) {
      return this.failResult('no_match');
    }

    const permissions = this.collectPermissions(user);
    const hasLogin = permissions.includes(REQUIRED_LOGIN);
    const hasCallView = SKIP_CALL_VIEW_CHECK || permissions.includes(REQUIRED_CALL_VIEW);

    if (!hasLogin) {
      return this.failResult('no_login');
    }
    if (!hasCallView) {
      return {
        allowed: true,
        canViewReports: false,
        reason: 'no_call_view',
      };
    }

    return {
      allowed: true,
      canViewReports: true,
    };
  }

  private collectPermissions(user: NumonixUser): string[] {
    const set = new Set<string>();
    for (const role of user.roles ?? []) {
      for (const p of role.permissions ?? []) {
        set.add(p);
      }
    }
    return Array.from(set);
  }
}
