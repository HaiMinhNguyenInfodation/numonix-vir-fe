import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, AuthError } from '@azure/msal-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);

    private readonly destroying$ = new Subject<void>();

    constructor(
        private msalService: MsalService,
        private msalBroadcastService: MsalBroadcastService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        // If already authenticated, go to app
        if (this.msalService.instance.getAllAccounts().length > 0) {
            this.router.navigate(['/app/dashboard']);
            return;
        }

        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status) => status === InteractionStatus.None),
                takeUntil(this.destroying$),
            )
            .subscribe(() => {
                if (this.msalService.instance.getAllAccounts().length > 0) {
                    this.router.navigate(['/app/dashboard']);
                }
                this.isLoading.set(false);
            });
    }

    login(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);
        this.msalService.loginRedirect().subscribe({
            error: (error: AuthError) => {
                this.isLoading.set(false);
                this.errorMessage.set(error.message || 'Authentication failed. Please try again.');
            },
        });
    }

    ngOnDestroy(): void {
        this.destroying$.next();
        this.destroying$.complete();
    }
}
