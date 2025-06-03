import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Plano } from 'src/app/models/plano.model';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.scss']
})
export class PlanosComponent implements OnInit {
  planos: Plano[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Plano[]>('assets/data/planos.json').subscribe(data => {
      this.planos = data;
    });
  }
}
