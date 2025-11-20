import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
CommonModule;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
    }

    const payload = {
      email: this.email,
      senha: this.senha,
    };

    this.http.post('http://localhost:8000/login',payload).subscribe({
      next: (response: any) => {
        console.log('resposta do beck-end', response);
        if (response && response.success) {
          alert('Redericionando')
          setTimeout (() => {
            this.router.navigate(['/dashboard'])
          },1500);
             
          
        } 
      },
      

      error: (err) => {
        console.error('erro ao fazer login', err);
        alert('falha na comunicação com o servidor.');
      },
    });
  }
}
