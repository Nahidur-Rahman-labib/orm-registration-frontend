import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'home',
                loadComponent: () =>
                    import('./features/home-page/home-page')
                        .then(m => m.HomePage)
            },
            {
                path: 'client',
                loadChildren: () =>
                    import('./modules/client-registration/client-registration-routes')
                        .then(m => m.CLIENT_REGISTRATION_ROUTES)
            },
            {
                path: 'practice',
                loadComponent: () =>
                    import('./features/practice-form/practice-form')
                        .then(m => m.PracticeForm)
            },
            {
                path: 'all',
                loadComponent: () =>
                    import('./features/all-components-page/all-components-page')
                        .then(m => m.AllComponentsPage)
            },
            {
                path: '',
                redirectTo: 'client',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];