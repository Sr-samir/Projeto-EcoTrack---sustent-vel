import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  mostrarSenha: boolean = false;
   errorMessage: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {}

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  fecharErro() {
    this.errorMessage = null;
  }

  login() {

    this.errorMessage = null;

    if (!this.email || !this.senha) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
      
    }

    const payload = { email: this.email, senha: this.senha };

    this.http.post('http://localhost:8000/login', payload).subscribe({
      next: (response: any) => {
        if (response && response.access_token) {
          // salva o token
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.access_token);
          }

          // carrega o perfil e salva no UsuarioService + localStorage
          this.usuarioService.loadUserProfile().subscribe({
            next: () => {
              this.errorMessage = null;
              this.router.navigate(['/dashboard']);
            },
            error: () => {
               this.errorMessage = null;
              // se der erro pra carregar o perfil, ainda assim vai pro dashboard
              this.router.navigate(['/dashboard']);
            }
          });
        } else {
          alert('Resposta de login inválida.');
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Usuário ou senha inválidos.';
      }
    });
  }
}
