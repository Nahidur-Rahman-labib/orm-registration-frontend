import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

type MenuSection = 'client';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  menuOpen = signal(false);
  expandedSection = signal<MenuSection | null>('client');

  constructor(private router: Router) { }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  toggleSection(section: MenuSection): void {
    this.expandedSection.update(v => v === section ? null : section);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }
}