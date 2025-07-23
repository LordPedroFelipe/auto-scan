import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent {

  selectedIndex = 0;

  onTabChange(index: number) {
    this.selectedIndex = index;
    console.log(`Aba ativa: ${index}`);
  }
}
