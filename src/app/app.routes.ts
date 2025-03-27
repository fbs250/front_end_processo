import { Routes } from '@angular/router';
import { ProcessoFormularioComponent } from './processo-formulario/processo-formulario.component';
import { ProcessoListagemComponent } from './processo-listagem/processo-listagem.component';

export const routes: Routes = [
    { path: '', redirectTo: 'processo-listagem', pathMatch: 'full' },
    { path: 'processo-formulario', component: ProcessoFormularioComponent },
    { path: 'processo-formulario/:id', component: ProcessoFormularioComponent },
    { path: 'processo-listagem', component: ProcessoListagemComponent },
];
