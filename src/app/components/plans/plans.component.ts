import { Component } from '@angular/core';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent {
  plans = [
    { name: 'Plano Básico', description: 'Plano para iniciantes', price: 'R$ 99,00/mês' },
    { name: 'Plano Intermediário', description: 'Plano para empresas pequenas', price: 'R$ 149,00/mês' },
    { name: 'Plano Premium', description: 'Plano completo para grandes lojas', price: 'R$ 199,00/mês' }
  ];

  selectPlan(plan: any) {
    console.log('Plano selecionado:', plan);
  }
}
