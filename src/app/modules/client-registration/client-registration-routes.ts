import { Routes } from '@angular/router';
import { ClientForm } from './client-form/client-form';
import { ClientRead } from './client-read/client-read';
import { Dashboard } from '../../shared/components/dashboard/dashboard';


export const CLIENT_REGISTRATION_ROUTES: Routes = [
    { path: '', component: ClientRead },  // Read page (list)
    { path: 'create', component: ClientForm }, // Create page
    { path: 'edit/:id', component: ClientForm }, // Edit page
    { path: "dashboard", component: Dashboard }
];