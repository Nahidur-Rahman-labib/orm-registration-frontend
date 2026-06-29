import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class Dashboard {
    constructor(private router: Router) { }

    goToAddClient(): void {
        this.router.navigate(['/client/new']);
    }

    goToClientList(): void {
        this.router.navigate(['/client']);
    }
}