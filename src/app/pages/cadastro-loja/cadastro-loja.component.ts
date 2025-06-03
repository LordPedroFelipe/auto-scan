import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LojaService } from 'src/app/services/loja.service';

@Component({
  selector: 'app-cadastro-loja',
  templateUrl: './cadastro-loja.component.html',
  styleUrls: ['./cadastro-loja.component.scss']
})
export class CadastroLojaComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private lojaService: LojaService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      cep: ['', Validators.required],
      qtde_carros_estoque: [0, [Validators.required, Validators.min(0)]]
    });
  }
  
  salvar(): void {
    if (this.form.valid) {
      this.lojaService.criar(this.form.value).subscribe(() => {
        alert('Loja cadastrada com sucesso!');
        this.form.reset();
      }, () => {
        alert('Erro ao cadastrar loja');
      });
    }
  }
}
