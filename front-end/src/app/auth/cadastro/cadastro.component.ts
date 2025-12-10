import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
})
export class CadastroComponent {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;
  aceitarTermos: boolean = false;

  // ✅ Regex de validação de e-mail
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private http: HttpClient, private router: Router) {}

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmarSenha() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  cadastrar() {
    // ❗ Verificação de campos vazios
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      alert('Preencha todos os campos.');
      return;
    }

    // ✅ Validação de e-mail
    if (!this.emailRegex.test(this.email)) {
      alert('E-mail inválido. Insira um endereço válido contendo "@" e domínio.');
      return;
    }

    // ❗ Senhas iguais
    if (this.senha !== this.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    // ❗ Aceitar termos
    if (!this.aceitarTermos) {
      alert('Você precisa aceitar os Termos de Uso.');
      return;
    }

    // Payload do cadastro
    const payload = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
    };

    this.http
      .post(
        'https://projeto-ecotrack-sustent-vel-production.up.railway.app/register',
        payload
      )
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            alert('Cadastro realizado com sucesso!');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error: (err) => {
          console.error('Erro no cadastro', err);

          // Mensagem personalizada
          if (err.status === 400 && err.error?.detail) {
            alert(err.error.detail);
          } else {
            alert('Erro ao cadastrar. Tente novamente.');
          }
        },
      });
  }
}
