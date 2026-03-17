import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { ParentBridgeService } from '../auth/auth-bridge.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-iframe-container',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
    templateUrl: './iframe-container.component.html',
    styleUrl: './iframe-container.component.scss',
})
export class IframeContainerComponent implements OnInit, OnDestroy {
    safeUrl = signal<SafeResourceUrl | null>(null);
    isLoading = signal(true);
    hasError = signal(false);
    errorMessage = signal<string | null>(null);

    private sessionId: string | null = null;
    private provider = 'azure-ad';
    private sub = new Subscription();

    constructor(
        private sanitizer: DomSanitizer,
        private msalService: MsalService,
        private parentBridge: ParentBridgeService,
    ) { }

    ngOnInit(): void {
        this.initBridgeSession();
    }

    private initBridgeSession(): void {
        const cachedSessionId = this.parentBridge.getValidSession(this.provider);
        if (cachedSessionId) {
            this.sessionId = cachedSessionId;
            this.safeUrl.set(
                this.sanitizer.bypassSecurityTrustResourceUrl(environment.authBridge.iframeAppOrigin),
            );
            this.isLoading.set(true);
            this.hasError.set(false);
            return;
        }

        const accounts = this.msalService.instance.getAllAccounts();
        if (!accounts.length) {
            this.handleError('No authenticated account found.');
            return;
        }

        this.isLoading.set(true);
        this.hasError.set(false);

        // Acquire token via MSAL; gửi token trực tiếp cho iframe (không gọi Numonix BE tạo session)
        this.sub.add(
            this.msalService
                .acquireTokenSilent({ account: accounts[0], scopes: environment.apiScopes })
                .subscribe({
                    next: (result) => {
                        this.sessionId = result.accessToken;
                        const expiresAt = result.expiresOn instanceof Date
                            ? result.expiresOn.toISOString()
                            : new Date(Date.now() + 60 * 1000).toISOString();
                        this.parentBridge.cacheSession(
                            { sessionId: result.accessToken, expiresAt },
                            this.provider,
                        );
                        this.safeUrl.set(
                            this.sanitizer.bypassSecurityTrustResourceUrl(
                                environment.authBridge.iframeAppOrigin,
                            ),
                        );
                    },
                    error: () => this.handleError('Failed to acquire access token.'),
                }),
        );
    }

    onIframeLoad(event: Event): void {
        this.isLoading.set(false);
        // Phase 3: Send sessionId to iframe via postMessage
        if (this.sessionId) {
            const iframe = event.target as HTMLIFrameElement;
            this.parentBridge.sendAuthMessage(iframe, this.sessionId, this.provider);
        }
    }

    onIframeError(): void {
        this.handleError('The report iframe could not be loaded.');
    }

    retry(): void {
        this.sessionId = null;
        this.safeUrl.set(null);
        this.initBridgeSession();
    }

    private handleError(message: string): void {
        this.isLoading.set(false);
        this.hasError.set(true);
        this.errorMessage.set(message);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
