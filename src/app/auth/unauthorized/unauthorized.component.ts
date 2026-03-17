import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { UserVerificationService } from '../user-verification.service';

const REASON_CONFIG: Record<
  string,
  { title: string; message: string; detail: string; icon: string }
> = {
  session_expired: {
    icon: 'timer_off',
    title: 'Session Expired',
    message: 'Your session has expired or has already been used.',
    detail: 'Please sign in again to continue.',
  },
  timeout: {
    icon: 'hourglass_disabled',
    title: 'Authentication Timeout',
    message: 'No authentication signal was received in time.',
    detail: 'Ensure the parent application is configured correctly and try again.',
  },
  unauthorized: {
    icon: 'lock',
    title: "You can't access this page",
    message: "You don't have permission to view this content.",
    detail: 'Please contact your administrator.',
  },
  report: {
    icon: 'visibility_off',
    title: "You can't access this page",
    message: "You don't have permission to view reports.",
    detail: 'Request access from your administrator or go back to the dashboard.',
  },
};

const DEFAULT_REASON = 'unauthorized';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="bg">
        <div class="bg-shape bg-shape-1"></div>
        <div class="bg-shape bg-shape-2"></div>
        <div class="bg-shape bg-shape-3"></div>
      </div>

      <main class="card">
        <div class="icon-wrap">
          <mat-icon class="icon">{{ config().icon }}</mat-icon>
        </div>
        <h1 class="title">{{ config().title }}</h1>
        <p class="message">{{ config().message }}</p>
        <p class="detail">{{ config().detail }}</p>
        <div class="actions">
          <button mat-raised-button color="primary" class="btn-primary" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        position: relative;
        overflow: hidden;
      }

      .bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          145deg,
          var(--mat-sys-surface-container-lowest, #f5f5f5) 0%,
          var(--mat-sys-surface-container, #e8e8e8) 50%,
          var(--mat-sys-surface-container-high, #e0e0e0) 100%
        );
        z-index: 0;
      }

      .bg-shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.4;
        filter: blur(80px);
      }

      .bg-shape-1 {
        width: 400px;
        height: 400px;
        background: var(--mat-sys-primary-container, #cfe2ff);
        top: -120px;
        right: -80px;
      }

      .bg-shape-2 {
        width: 300px;
        height: 300px;
        background: var(--mat-sys-tertiary-container, #c8e6f5);
        bottom: -60px;
        left: -60px;
      }

      .bg-shape-3 {
        width: 200px;
        height: 200px;
        background: var(--mat-sys-error-container, #ffdad4);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.25;
      }

      .card {
        position: relative;
        z-index: 1;
        max-width: 440px;
        width: 100%;
        text-align: center;
        padding: 48px 40px;
        border-radius: 24px;
        background: var(--mat-sys-surface, #fff);
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.04),
          0 8px 24px rgba(0, 0, 0, 0.08),
          0 24px 48px rgba(0, 0, 0, 0.06);
      }

      .icon-wrap {
        width: 88px;
        height: 88px;
        margin: 0 auto 24px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--mat-sys-error-container, #ffdad4),
          var(--mat-sys-error-container, #ffcdc7)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(179, 38, 30, 0.2);
      }

      .icon {
        font-size: 44px;
        width: 44px;
        height: 44px;
        color: var(--mat-sys-error, #b3261e);
      }

      .title {
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.3;
        margin: 0 0 12px;
        color: var(--mat-sys-on-surface, #1c1b1f);
      }

      .message {
        font-size: 1.0625rem;
        line-height: 1.5;
        margin: 0 0 8px;
        color: var(--mat-sys-on-surface-variant, #49454f);
      }

      .detail {
        font-size: 0.9375rem;
        line-height: 1.5;
        margin: 0 0 32px;
        color: var(--mat-sys-outline, #79747e);
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .actions button {
        justify-content: center;
        min-height: 48px;
        font-weight: 500;
      }

      .actions button mat-icon {
        margin-right: 8px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }

      .btn-primary {
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.25);
      }

      .btn-secondary {
        color: var(--mat-sys-on-surface-variant, #49454f);
      }

      @media (min-width: 480px) {
        .actions {
          flex-direction: row;
          justify-content: center;
        }

        .actions button {
          flex: 1;
          max-width: 200px;
        }
      }
    `,
  ],
})
export class UnauthorizedComponent implements OnInit {
  config = signal(REASON_CONFIG[DEFAULT_REASON]);

  constructor(
    private route: ActivatedRoute,
    private msalService: MsalService,
    private userVerification: UserVerificationService,
  ) {}

  ngOnInit(): void {
    const reason =
      this.route.snapshot.queryParamMap.get('reason') ?? DEFAULT_REASON;
    this.config.set(REASON_CONFIG[reason] ?? REASON_CONFIG[DEFAULT_REASON]);
  }

  logout(): void {
    this.userVerification.clearCache();
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: '/login',
    });
  }
}
