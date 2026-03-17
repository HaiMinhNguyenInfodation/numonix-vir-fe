import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface NavItem {
    label: string;
    icon: string;
    route: string;
}

@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
    @Output() navItemClicked = new EventEmitter<void>();

    navItems: NavItem[] = [
        { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard' },
        { label: 'Reports', icon: 'bar_chart', route: '/app/reports/view' },
    ];
}
