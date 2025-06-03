import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Veiculo } from '../models/veiculo';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private veiculosMock: Veiculo[] = [
    { id: 1, modelo: 'Onix', marca: 'Chevrolet', ano: 2020, preco: 52000, status: 'disponível' },
    { id: 2, modelo: 'Corolla', marca: 'Toyota', ano: 2019, preco: 78000, status: 'vendido' },
  ];

  private veiculosSubject = new BehaviorSubject<Veiculo[]>(this.veiculosMock);
  veiculos$ = this.veiculosSubject.asObservable();

  adicionar(veiculo: Veiculo) {
    const atual = this.veiculosSubject.value;
    this.veiculosSubject.next([...atual, { ...veiculo, id: Date.now() }]);
  }

  excluir(id: number) {
    const atualizado = this.veiculosSubject.value.filter(v => v.id !== id);
    this.veiculosSubject.next(atualizado);
  }

  editar(veiculo: Veiculo) {
    const atualizado = this.veiculosSubject.value.map(v => v.id === veiculo.id ? veiculo : v);
    this.veiculosSubject.next(atualizado);
  }
}
