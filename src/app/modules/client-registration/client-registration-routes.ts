import { Routes } from '@angular/router';
import { ClientForm } from './client-form/client-form';
import { ClientRead } from './client-read/client-read';

export const CLIENT_REGISTRATION_ROUTES: Routes = [
    {
        path: '',
        component: ClientRead

    },

    // Create client (form)
    {
        path: 'create',
        component: ClientForm
    },

    // Edit client (reusing form component, pass clientId as param)
    {
        path: 'edit/:id',
        component: ClientForm
    }
];



