import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
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
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { CadastroVeiculoModalComponent } from './components/cadastro-veiculo-modal/cadastro-veiculo-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoadingComponent } from './components/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
