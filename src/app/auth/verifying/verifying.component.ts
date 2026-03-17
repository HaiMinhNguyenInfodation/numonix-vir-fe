import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { UserVerificationService } from '../user-verification.service';

@Component({
  selector: 'app-verifying',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="page">
      <div class="card">
        <mat-spinner diameter="48" class="spinner"></mat-spinner>
        <h2 class="title">Verifying your access</h2>
        <p class="message">Please wait while we confirm your permissions.</p>
      </div>
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
        background: var(--mat-sys-surface-container-lowest, #f5f5f5);
      }

      .card {
        text-align: center;
        padding: 48px 40px;
        border-radius: 16px;
        background: var(--mat-sys-surface, #fff);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        min-width: 280px;
      }

      .spinner {
        margin: 0 auto 24px;
        display: block;
      }

      .title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 8px;
        color: var(--mat-sys-on-surface, #1c1b1f);
      }

      .message {
        font-size: 0.9375rem;
        color: var(--mat-sys-on-surface-variant, #49454f);
        margin: 0;
      }
    `,
  ],
})
export class VerifyingComponent implements OnInit {
  constructor(
    private router: Router,
    private verification: UserVerificationService
  ) {}

  ngOnInit(): void {
    this.verification.verify().subscribe((result) => {
      if (!result.allowed) {
        this.router.navigate(['/unauthorized']);
        return;
      }
      if (!result.canViewReports) {
        this.router.navigate(['/unauthorized'], { queryParams: { reason: 'report' } });
        return;
      }
      this.router.navigate(['/app/dashboard']);
    });
  }
}
