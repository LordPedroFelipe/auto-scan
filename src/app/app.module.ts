import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';


// Módulos
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// Componentes
import { AppComponent } from './app.component';
import { CadastroVeiculoModalComponent } from './components/cadastro-veiculo-modal/cadastro-veiculo-modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImagemModalComponent } from './components/imagem-modal/imagem-modal.component';
import { LeadFormModalComponent } from './components/lead-form-modal/lead-form-modal.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LojaFormComponent } from './components/loja-form/loja-form.component';
import { MicRecordingSnackComponent } from './components/mic-recording-snack/mic-recording-snack.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PlansComponent } from './components/plans/plans.component';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';
import { CadastroLojaComponent } from './pages/cadastro-loja/cadastro-loja.component';
import { ChatAtendimentoComponent } from './pages/chat-atendimento/chat-atendimento.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { HomeComponent } from './pages/home/home.component';
import { LeadListaComponent } from './pages/lead-lista/lead-lista.component';
import { LoginComponent } from './pages/login/login.component';
import { LojaListaComponent } from './pages/loja-lista/loja-lista.component';
import { PlanosComponent } from './pages/planos/planos.component';
import { UsuariosListaComponent } from './pages/usuarios-lista/usuarios-lista.component';

// Interceptadores
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

// NGX-MASK
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DetalhesVeiculosModalComponent } from './components/detalhes-veiculos-modal/detalhes-veiculos-modal.component';
import { LeadDetalheModalComponent } from './components/lead-detalhe-modal/lead-detalhe-modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AgendamentoTestDriveComponent } from './pages/agendamento-test-drive/agendamento-test-drive.component';
import { TestDriveListComponent } from './pages/test-drive-list/test-drive-list.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { ContaComponent } from './components/configuracao/conta/conta.component';
import { MonitoramentoComponent } from './components/configuracao/monitoramento/monitoramento.component';
import { NotificacoesComponent } from './components/configuracao/notificacoes/notificacoes.component';
import { PagamentoComponent } from './components/configuracao/pagamento/pagamento.component';
import { PreferenciasComponent } from './components/configuracao/preferencias/preferencias.component';
import { SegurancaComponent } from './components/configuracao/seguranca/seguranca.component';
import { GraficoPalavrasComponent } from './components/grafico-palavras/grafico-palavras.component';
import { QrCodeFormComponent } from './components/qr-code-form/qr-code-form.component';
import { MY_DATE_FORMATS } from './custom-date-format';
import { ShopIdInterceptor } from './interceptors/shop-id.interceptor';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';
import { LojaDetalhesComponent } from './pages/loja-detalhes/loja-detalhes.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { QrCodeListComponent } from './pages/qr-code-list/qr-code-list.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { SimularFinanciamentoComponent } from './pages/simular-financiamento/simular-financiamento.component'; // ajuste o caminho se necessário
import { VeiculoDetalhesComponent } from './pages/veiculo-detalhes/veiculo-detalhes.component';
import { PascalCasePipe } from './pipes/pascal-case.pipe';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    PlansComponent,
    FooterComponent,
    HomeComponent,
    PlanosComponent,
    ChatAtendimentoComponent,
    CadastroLojaComponent,
    ImagemModalComponent,
    DashboardComponent,
    EstoqueComponent,
    CadastroVeiculoModalComponent,
    LoadingComponent,
    MicRecordingSnackComponent,
    LojaListaComponent,
    UsuariosListaComponent,
    LeadListaComponent,
    LojaFormComponent,
    UsuarioFormComponent,
    LeadFormModalComponent,
    LeadDetalheModalComponent,
    PaginationComponent,
    TestDriveListComponent,
    DetalhesVeiculosModalComponent,
    AgendamentoTestDriveComponent,
    SimularFinanciamentoComponent,
    PascalCasePipe,
    GraficoPalavrasComponent,
    QrCodeListComponent,
    QrCodeFormComponent,
    RelatoriosComponent,
    VeiculoDetalhesComponent,
    LojaDetalhesComponent,
    ConfiguracoesComponent,
    PagamentoComponent,
    ContaComponent,
    PreferenciasComponent,
    NotificacoesComponent,
    SegurancaComponent,
    MonitoramentoComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Material
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatIconModule,
    MatOptionModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatRadioModule,
    MatTooltipModule,
    DragDropModule,

    // NGX-MASK
    NgxMaskDirective,

    // NGX-Apex-Charts
    NgxApexchartsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    provideNgxMask(),

    // FORMATOS DE DATA EM PT-BR
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ShopIdInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [PascalCasePipe]
})
export class AppModule {
  constructor(
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer
  ) {
    matIconRegistry.addSvgIcon(
      'whatsapp',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/img/WhatsApp.svg')
    );
  }
}
