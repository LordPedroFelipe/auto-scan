import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AgendamentoTestDriveComponent } from './pages/agendamento-test-drive/agendamento-test-drive.component';
import { CadastroLojaComponent } from './pages/cadastro-loja/cadastro-loja.component';
import { ChatAtendimentoComponent } from './pages/chat-atendimento/chat-atendimento.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { HomeComponent } from './pages/home/home.component';
import { LeadListaComponent } from './pages/lead-lista/lead-lista.component';
import { LoginComponent } from './pages/login/login.component';
import { LojaDetalhesComponent } from './pages/loja-detalhes/loja-detalhes.component';
import { LojaListaComponent } from './pages/loja-lista/loja-lista.component';
import { PlanosComponent } from './pages/planos/planos.component';
import { QrCodeListComponent } from './pages/qr-code-list/qr-code-list.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { SimularFinanciamentoComponent } from './pages/simular-financiamento/simular-financiamento.component';
import { TestDriveListComponent } from './pages/test-drive-list/test-drive-list.component';
import { UsuariosListaComponent } from './pages/usuarios-lista/usuarios-lista.component';
import { VeiculoDetalhesComponent } from './pages/veiculo-detalhes/veiculo-detalhes.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'planos', component: PlanosComponent },
  { path: 'atendimento', component: ChatAtendimentoComponent },
  { path: 'atendimento/:placa', component: ChatAtendimentoComponent },
  { path: 'cadastro-loja', component: CadastroLojaComponent },
  { path: 'testdrive/:vehicleId', component: AgendamentoTestDriveComponent },
  { path: 'simular-financiamento/:vehicleId', component: SimularFinanciamentoComponent },
  { path: 'vehicle/:id', component: VeiculoDetalhesComponent },
  { path: 'shop/:id', component: LojaDetalhesComponent },

  // Rotas privadas
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
  { path: 'estoque', component: EstoqueComponent, canActivate: [AuthGuard]  },
  { path: 'loja-lista', component: LojaListaComponent, canActivate: [AuthGuard]  },
  { path: 'usuarios-lista', component: UsuariosListaComponent, canActivate: [AuthGuard]  },
  { path: 'lead-lista', component: LeadListaComponent, canActivate: [AuthGuard]  },
  { path: 'test-drive-list', component: TestDriveListComponent, canActivate: [AuthGuard]  },
  { path: 'qr-code-list', component: QrCodeListComponent, canActivate: [AuthGuard]  },
  { path: 'relatorios', component: RelatoriosComponent, canActivate: [AuthGuard]  },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [AuthGuard]  },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
