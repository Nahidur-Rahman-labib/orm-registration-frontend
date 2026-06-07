import { Component, OnInit } from '@angular/core';
import { ClientRegistrationService } from '../service/client-registration';
import { GetClientResponse } from '../models/client-registration.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-read',
  templateUrl: './client-read.html',
  styleUrls: ['./client-read.scss']
})
export class ClientRead implements OnInit {

  clients: GetClientResponse[] = [];
  loading = false;
  error = '';

  constructor(
    private clientService: ClientRegistrationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: (res) => {
        this.clients = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load clients';
        this.loading = false;
        console.error(err);
      }
    });
  }
  editClient(clientId: number): void {
    // Navigate to edit page
    this.router.navigate(['/client/edit', clientId]);
  }

  deleteClient(clientId: number): void {
    if (!confirm('Are you sure you want to delete this client?')) return;
    this.clientService.deleteClient(clientId).subscribe({
      next: () => this.loadClients(),
      error: (err) => console.error(err)
    });
  }

}