import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // <- corrigido
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  mostrarSenha: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  login() {
    if (!this.email || !this.senha) {
      alert('Preencha todos os campos.');
      return;
    }

    const payload = { email: this.email, senha: this.senha };

    this.http.post('http://localhost:8000/login', payload).subscribe({
    next: (response: any) => {
      if (response && response.access_token) {
        localStorage.setItem('token', response.access_token);
        this.router.navigate(['/dashboard']);
      }
    }
  });
  }
}
