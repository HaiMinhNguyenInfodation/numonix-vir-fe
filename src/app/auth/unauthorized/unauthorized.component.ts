import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

const REASON_CONFIG: Record<string, { title: string; message: string; icon: string }> = {
  session_expired: {
    icon: 'timer_off',
    title: 'Session Expired',
    message: 'Your authentication session has expired or has already been used. Please reload the page.',
  },
  timeout: {
    icon: 'hourglass_disabled',
    title: 'Authentication Timeout',
    message: 'No authentication signal was received in time. Please ensure the parent application is configured correctly.',
  },
  unauthorized: {
    icon: 'lock',
    title: 'Access Denied',
    message: 'You do not have permission to access this page.',
  },
};

const DEFAULT_REASON = 'unauthorized';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-container">
      <mat-icon class="icon">{{ config().icon }}</mat-icon>
      <h2>{{ config().title }}</h2>
      <p>{{ config().message }}</p>
      <button mat-raised-button color="primary" (click)="goHome()">
        Go to Dashboard
      </button>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 16px;
      text-align: center;

      .icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--mat-sys-error);
      }
    }
  `],
})
export class UnauthorizedComponent implements OnInit {
  config = signal(REASON_CONFIG[DEFAULT_REASON]);

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason') ?? DEFAULT_REASON;
    this.config.set(REASON_CONFIG[reason] ?? REASON_CONFIG[DEFAULT_REASON]);
  }

  goHome(): void {
    this.router.navigate(['/app/dashboard']);
  }
}
