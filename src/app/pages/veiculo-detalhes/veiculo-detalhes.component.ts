import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VeiculoService } from 'src/app/services/veiculo.service';

@Component({
  selector: 'app-veiculo-detalhes',
  templateUrl: './veiculo-detalhes.component.html',
  styleUrls: ['./veiculo-detalhes.component.scss']
})
export class VeiculoDetalhesComponent implements OnInit {
  fotoSelecionadaIndex: number | null = null;
  public data: any

  constructor(
    private route: ActivatedRoute,
    private veiculoService: VeiculoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id ', id);

    if (id) {
      this.veiculoService.getVeiculoById(id).subscribe({
        next: (res: any) => this.data = res,
        error: (err: any) => console.error('Erro ao carregar veículo:', err)
      });
    }
  }

  abrirFotoFullscreen(index: number) {
    this.fotoSelecionadaIndex = index;
  }


  fecharFullscreen() {
    this.fotoSelecionadaIndex = null;
  }

  proximaFoto() {
    if (this.fotoSelecionadaIndex !== null && this.fotoSelecionadaIndex < this.data.photoUrls.length - 1) {
      this.fotoSelecionadaIndex++;
    }
  }

  fotoAnterior() {
    if (this.fotoSelecionadaIndex !== null && this.fotoSelecionadaIndex > 0) {
      this.fotoSelecionadaIndex--;
    }
  }

  agendarTestDrive() {
    console.log('Agendar Test Drive acionado!');
    this.router.navigate(['/testdrive', this.data.id]);
  }

  simularFinanciamento() {
    console.log('Simular financiamento acionado!');
    this.router.navigate(['/simular-financiamento', this.data.id]);
  }

  falarComIA() {
    // Inicia um chat com IA ou redireciona
    console.log('Falar com IA acionado!');
    this.router.navigate(['/atendimento', this.data.id]);
    // this.chatService.abrirChatComContextoVeiculo(this.data);
  }
}
