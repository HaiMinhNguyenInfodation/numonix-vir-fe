import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, RouterLink],
    template: `
    <div class="not-found-container">
      <mat-icon class="icon">search_off</mat-icon>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <button mat-raised-button color="primary" [routerLink]="['/app/dashboard']">
        Go to Dashboard
      </button>
    </div>
  `,
    styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 12px;
      text-align: center;

      .icon {
        font-size: 72px;
        width: 72px;
        height: 72px;
        color: var(--mat-sys-outline);
      }

      h1 {
        font-size: 4rem;
        margin: 0;
        color: var(--mat-sys-primary);
      }

      h2 { margin: 0; }

      p {
        color: var(--mat-sys-on-surface-variant);
        margin: 0 0 8px;
      }
    }
  `],
})
export class NotFoundComponent { }
