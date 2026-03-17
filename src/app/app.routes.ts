import { Routes } from '@angular/router';
import { MsalRedirectComponent } from '@azure/msal-angular';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { ShellComponent } from './shell/shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IframeContainerComponent } from './iframe/iframe-container.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'auth/callback', component: MsalRedirectComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    {
        path: 'app',
        component: ShellComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
            { path: 'reports/view', component: IframeContainerComponent, data: { title: 'Reports' } },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },
    { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
];
