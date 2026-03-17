import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface CreateSessionResponse {
    sessionId: string;
    expiresAt: string;
}

interface CachedBridgeSession {
    sessionId: string;
    provider: string;
    expiresAtEpochMs: number;
}

@Injectable({ providedIn: 'root' })
export class ParentBridgeService {
    private cachedSession: CachedBridgeSession | null = null;

    getValidSession(provider: string): string | null {
        if (!this.cachedSession) {
            return null;
        }

        const isSameProvider = this.cachedSession.provider === provider;
        const isNotExpired = Date.now() < this.cachedSession.expiresAtEpochMs;

        if (!isSameProvider || !isNotExpired) {
            this.cachedSession = null;
            return null;
        }

        return this.cachedSession.sessionId;
    }

    cacheSession(response: CreateSessionResponse, provider: string): void {
        const expiresAtEpochMs = Date.parse(response.expiresAt);
        this.cachedSession = {
            sessionId: response.sessionId,
            provider,
            expiresAtEpochMs: Number.isFinite(expiresAtEpochMs)
                ? expiresAtEpochMs
                : Date.now() + 55_000,
        };
    }

    /**
     * Phase 3: Send AUTH_SESSION_READY postMessage to the loaded iframe.
     * Must be called AFTER the iframe (load) event fires.
     */
    sendAuthMessage(iframeEl: HTMLIFrameElement, sessionId: string, provider: string): void {
        iframeEl.contentWindow?.postMessage(
            {
                type: 'AUTH_SESSION_READY',
                sessionId,
                provider,
                timestamp: Date.now(),
            },
            environment.authBridge.iframeAppOrigin,
        );
    }
}
