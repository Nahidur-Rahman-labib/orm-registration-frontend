import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarService } from '../../modules/client-registration/service/navbar.service';

type MenuSection = 'client';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  sidebarCollapsed = signal(false);
  expandedSection = signal<MenuSection | null>('client');
  menuOpen = signal(false);

  constructor(
    private router: Router,
    public navbar: NavbarService
  ) { }

  toggleSidebar(): void { this.sidebarCollapsed.update(v => !v); }
  toggleSection(s: MenuSection): void {
    this.expandedSection.update(v => v === s ? null : s);
  }
  toggleMenu(): void { this.menuOpen.update(v => !v); }
  closeMenu(): void { this.menuOpen.set(false); }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }

  goHome(): void { this.router.navigate(['/home']); }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
}