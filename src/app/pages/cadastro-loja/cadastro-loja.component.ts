import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LojaCreateDto } from 'src/app/models/loja-create.dto';
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Suponha que estes valores venham do login, por exemplo
    const userName = 'pedro.souza';
    const email = 'pedro@autoscan.com';
    const phoneNumber = '(47) 99999-9999';

    const novaLoja: LojaCreateDto = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      ownerId: '1234567890', // ID real do usuário logado
      owner: {
        userName: userName,
        normalizedUserName: userName.toUpperCase(),
        email: email,
        normalizedEmail: email.toUpperCase(),
        emailConfirmed: true,
        passwordHash: 'senha_criptografada_aqui',
        phoneNumber: phoneNumber,
        phoneNumberConfirmed: true
      }
    };

    this.lojaService.criar(novaLoja).subscribe({
      next: (loja) => {
        console.log('[Loja criada]', loja);
        alert(`Loja "${loja.name}" cadastrada com sucesso!`);
        this.form.reset();
      },
      error: (err) => {
        console.error('[Erro ao cadastrar loja]', err);
        alert('Erro ao cadastrar loja');
      }
    });
  }
}


