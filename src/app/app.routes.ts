import { Routes } from '@angular/router';
import { HousesPage } from './pages/houses-page/houses-page';
import { MarkersPage } from './pages/markers-page/markers-page';
import { FullscreenMapPage } from './pages/fullscreen-map-page/fullscreen-map-page';

export const routes: Routes = [
    {
        path: '',
        component: FullscreenMapPage,
        title: 'Fullscreen Map'
    },
    {
        path: 'houses',
        component: HousesPage,
        title: 'Houses'
    },
    {
        path: 'markers',
        component: MarkersPage,
        title: 'Markers'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
