import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarService } from '../../modules/client-registration/service/navbar.service';

type MenuSection = 'client' | 'account';

interface FastPathRoute {
  code: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  sidebarCollapsed = signal(false);
  expandedSection = signal<MenuSection | null>('client');
  menuOpen = signal(false);
  fastPath = '';
  fastPathError = false;

  readonly fastPathRoutes: FastPathRoute[] = [
    { code: 'CC', label: 'Client Registration', path: '/client/create' },
    { code: 'CR', label: 'Client List', path: '/client' },
    { code: 'CV', label: 'Client View', path: '/client/view' },
    { code: 'DB', label: 'Dashboard', path: '/client/dashboard' },
    { code: 'HM', label: 'Home', path: '/home' },
  ];

  constructor(
    private router: Router,
    public navbar: NavbarService
  ) { }

  toggleSidebar(): void {
    const newValue = !this.sidebarCollapsed();
    this.sidebarCollapsed.set(newValue);
    if (newValue) this.closeMenu();
  }

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

  onFastPath(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      this.fastPathError = false;
      return;
    }

    const input = this.fastPath.trim().toUpperCase();
    const match = this.fastPathRoutes.find(r => r.code === input);

    if (match) {
      this.fastPathError = false;
      this.fastPath = '';
      this.navigate(match.path);
    } else {
      this.fastPathError = true;
    }
  }
}



