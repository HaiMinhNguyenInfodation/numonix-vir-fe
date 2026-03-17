import { Component, ViewChild, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [RouterOutlet, MatSidenavModule, HeaderComponent, SidenavComponent],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
})
export class ShellComponent {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    isMobile = signal(false);

    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
            this.isMobile.set(result.matches);
            if (result.matches && this.sidenav?.opened) {
                this.sidenav.close();
            }
        });
    }

    toggleSidenav(): void {
        this.sidenav.toggle();
    }
}
