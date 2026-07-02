import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClientRegistrationService } from '../service/client-registration';
import { GetClientResponse } from '../models/client-registration.models';
import { CommonModule } from '@angular/common';
import { GenericButtonComponent } from '../../../shared/components/generic-button/generic-button.component';
import { NavbarService } from '../service/navbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-read',
  templateUrl: './client-read.html',
  styleUrls: ['./client-read.scss'],
  standalone: true,
  imports: [CommonModule, GenericButtonComponent]
})
export class ClientRead implements OnInit, OnDestroy {

  clients: GetClientResponse[] = [];
  loading = false;
  error = '';
  private updateSub!: Subscription;

  constructor(
    private clientService: ClientRegistrationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private navbar: NavbarService
  ) { }

  ngOnInit(): void {
    this.loadClients();
    this.navbar.setPage({ pageTitle: 'Client List', showActions: false });

    this.updateSub = this.clientService.clientUpdated$.subscribe(() => {
      this.loadClients();
    });
  }

  ngOnDestroy(): void {
    this.updateSub?.unsubscribe();
    this.navbar.clearActions();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: res => {
        this.clients = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.error = 'Failed to load clients';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  editClient(clientId: number): void {
    this.router.navigate(['/client/edit', clientId]);
  }

  deleteClient(clientId: number): void {
    if (!confirm('Are you sure you want to delete this client?')) return;
    this.loading = true;
    this.clientService.deleteClient(clientId).subscribe({
      next: () => this.loadClients(),
      error: err => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}