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

  private baseUrl =
    window.location.hostname === 'localhost'
      ? 'http://127.0.0.1:8000'
      : 'https://projeto-ecotrack-sustent-vel-production.up.railway.app';

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

    this.http.post(`${this.baseUrl}/login`, payload).subscribe({
      next: (response: any) => {
        if (response && response.access_token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.access_token);
          }

          this.usuarioService.loadUserProfile().subscribe({
            next: () => {
              this.errorMessage = null;
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              this.router.navigate(['/dashboard']);
            }
          });
        } else {
          this.errorMessage = 'Resposta de login inválida.';
        }
      },
      error: () => {
        this.errorMessage = 'Usuário ou senha inválidos.';
      }
    });
  }
}
