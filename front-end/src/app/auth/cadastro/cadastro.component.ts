import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
RouterModule
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

  constructor(private http: HttpClient, private router: Router) {}

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleConfirmarSenha() {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  cadastrar() {
    if (
      !this.nome ||
      !this.email ||
      !this.senha ||
      !this.confirmarSenha
    ) {
      alert('Preencha todos os campos.');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    if (!this.aceitarTermos) {
      alert('Você precisa aceitar os Termos de Uso.');
      return;
    }

    const payload = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
    };

    this.http.post('https://projeto-ecotrack-sustent-vel-production.up.railway.app/register
/register', payload).subscribe({
      next: (response: any) => {
        if (response && response.success){
          
          alert('Cadastro realizado com sucesso!')
          setTimeout (() =>{
            this.router.navigate(['/login'])},2000
          );
        }
        
        
      },
      error: (err) => {
        console.error('Erro no cadastro', err);
        alert('Erro ao cadastrar. Tente novamente.');
      },
    });
  }
        
        
        
        
}
