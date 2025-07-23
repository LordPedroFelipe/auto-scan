import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.scss']
})
export class ContaComponent {

  private dados!: any;

  nome = '';
  email = '';
  telefone = '';
  senha = '';
  imagemUrl = '';
  imagemSelecionada?: File;

  constructor(private contaService: UsuarioService) {}

  ngOnInit(): void {
    const id = 'e696142e-6be6-4ed5-a20f-8558d247263f';
    this.dados = this.contaService.buscarPorId(id);
    console.log('dados', this.dados)
    this.nome = this.dados.nome;
    this.email = this.dados.email;
    this.telefone = this.dados.telefone;
    this.senha = this.dados.senha;
    this.imagemUrl = this.dados.imagemUrl || '';
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imagemSelecionada = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.imagemUrl = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  salvar(): void {
    const atualizado: any = {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      senha: this.senha,
      imagemUrl: this.imagemUrl
    };

    // this.contaService.salvar(atualizado);
  }

  // Getters para o template
  get exibirImagem(): string {
    return this.imagemUrl || 'https://via.placeholder.com/120';
  }
}
