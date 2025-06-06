import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroLojaComponent } from './pages/cadastro-loja/cadastro-loja.component';
import { ChatAtendimentoComponent } from './pages/chat-atendimento/chat-atendimento.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PlanosComponent } from './pages/planos/planos.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { LojaListaComponent } from './pages/loja-lista/loja-lista.component';
import { UsuariosListaComponent } from './pages/usuarios-lista/usuarios-lista.component';
import { LeadListaComponent } from './pages/lead-lista/lead-lista.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'planos', component: PlanosComponent },
  { path: 'atendimento', component: ChatAtendimentoComponent },
  { path: 'atendimento/:placa', component: ChatAtendimentoComponent },
  { path: 'cadastro-loja', component: CadastroLojaComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'estoque', component: EstoqueComponent },
  { path: 'loja-lista', component: LojaListaComponent },
  { path: 'usuarios-lista', component: UsuariosListaComponent },
  { path: 'lead-lista', component: LeadListaComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
