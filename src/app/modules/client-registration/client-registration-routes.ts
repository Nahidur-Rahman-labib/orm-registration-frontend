import { Routes } from '@angular/router';
import { ClientForm } from './client-form/client-form';

export const CLIENT_REGISTRATION_ROUTES: Routes = [
    {
        path: '',
        component: ClientForm
    }
];