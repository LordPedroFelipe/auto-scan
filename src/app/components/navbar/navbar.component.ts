import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLogado = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarSessao();
  }

  verificarSessao(): void {
    this.isLogado = !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
    this.isLogado = false;
    this.router.navigate(['/login']);
  }
}
