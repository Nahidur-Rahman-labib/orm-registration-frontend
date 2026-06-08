import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientViewService } from '../service/client-view.service';
import { ClientView } from '../models/client-view.models';


@Component({
    selector: 'app-client-view',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './client-view.html',
    styleUrl: './client-view.scss'
})
export class ClientViewComponent implements OnInit {

    clients: ClientView[] = [];
    loading = false;
    errorMessage = '';

    constructor(
        private clientViewService: ClientViewService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadClients();
    }

    loadClients(): void {
        this.loading = true;
        this.errorMessage = '';

        this.clientViewService.getAllClientsWithFullInfo().subscribe({
            next: (data) => {
                this.clients = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.errorMessage = 'Failed to load client information.';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
}