import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Módulos
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// Componentes
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PlansComponent } from './components/plans/plans.component';
import { CadastroLojaComponent } from './pages/cadastro-loja/cadastro-loja.component';
import { ChatAtendimentoComponent } from './pages/chat-atendimento/chat-atendimento.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PlanosComponent } from './pages/planos/planos.component';
import { ImagemModalComponent } from './components/imagem-modal/imagem-modal.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { CadastroVeiculoModalComponent } from './components/cadastro-veiculo-modal/cadastro-veiculo-modal.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MicRecordingSnackComponent } from './components/mic-recording-snack/mic-recording-snack.component';
import { LojaListaComponent } from './pages/loja-lista/loja-lista.component';
import { UsuariosListaComponent } from './pages/usuarios-lista/usuarios-lista.component';
import { LeadListaComponent } from './pages/lead-lista/lead-lista.component';
import { LojaFormComponent } from './components/loja-form/loja-form.component';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';
import { LeadFormModalComponent } from './components/lead-form-modal/lead-form-modal.component';

// Interceptadores
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

// NGX-MASK
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { LeadDetalheModalComponent } from './components/lead-detalhe-modal/lead-detalhe-modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TestDriveListComponent } from './pages/test-drive-list/test-drive-list.component';
import { DetalhesVeiculosModalComponent } from './components/detalhes-veiculos-modal/detalhes-veiculos-modal.component';
import { AgendamentoTestDriveComponent } from './pages/agendamento-test-drive/agendamento-test-drive.component';

import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from './custom-date-format';
import { SimularFinanciamentoComponent } from './pages/simular-financiamento/simular-financiamento.component'; // ajuste o caminho se necessário
import { PascalCasePipe } from './pipes/pascal-case.pipe';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { GraficoPalavrasComponent } from './components/grafico-palavras/grafico-palavras.component';
import { QrCodeListComponent } from './pages/qr-code-list/qr-code-list.component';
import { QrCodeFormComponent } from './components/qr-code-form/qr-code-form.component';
import { RelatoriosComponent } from './page/relatorios/relatorios.component';


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
