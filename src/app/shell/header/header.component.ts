import { Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserVerificationService } from '../../auth/user-verification.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() menuToggle = new EventEmitter<void>();

    userDisplayName = signal<string>('');
    userSubtitle = signal<string>('TeamsCX');
    userInitials = signal<string>('');
    pageTitle = signal<string>('Dashboard');

    private readonly destroying$ = new Subject<void>();

    constructor(
        private msalService: MsalService,
        private msalBroadcastService: MsalBroadcastService,
        private router: Router,
        private userVerification: UserVerificationService,
    ) { }

    ngOnInit(): void {
        this.refreshUserInfo();

        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status) => status === InteractionStatus.None),
                takeUntil(this.destroying$),
            )
            .subscribe(() => this.refreshUserInfo());

        this.updateTitle();
        this.router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                takeUntil(this.destroying$),
            )
            .subscribe(() => this.updateTitle());
    }

    private refreshUserInfo(): void {
        let activeAccount = this.msalService.instance.getActiveAccount();
        if (!activeAccount) {
            const firstAccount = this.msalService.instance.getAllAccounts()[0];
            if (firstAccount) {
                this.msalService.instance.setActiveAccount(firstAccount);
                activeAccount = firstAccount;
            }
        }

        if (!activeAccount) {
            this.userDisplayName.set('');
            this.userInitials.set('');
            return;
        }

        const name = activeAccount.name ?? activeAccount.username;
        this.userDisplayName.set(name);
        this.userInitials.set(this.getInitials(name));
    }

    private updateTitle(): void {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) { route = route.firstChild; }
        this.pageTitle.set(route.data['title'] ?? 'Dashboard');
    }

    private getInitials(name: string): string {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    logout(): void {
        this.userVerification.clearCache();
        this.msalService.logoutRedirect({
            postLogoutRedirectUri: '/login',
        });
    }

    ngOnDestroy(): void {
        this.destroying$.next();
        this.destroying$.complete();
    }
}
