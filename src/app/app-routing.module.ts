import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatAtendimentoComponent } from './pages/chat-atendimento/chat-atendimento.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PlanosComponent } from './pages/planos/planos.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'planos', component: PlanosComponent },
  { path: 'atendimento', component: ChatAtendimentoComponent },
  { path: 'atendimento/:placa', component: ChatAtendimentoComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
