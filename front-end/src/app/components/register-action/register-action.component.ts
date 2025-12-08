import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-action',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-action.component.html',
  styleUrls: ['./register-action.component.css'], // <- ajustei para styleUrls
})
export class RegisterActionComponent {
  titulo: string = '';
  descricao: string = '';
  file: File | null = null;
  preview: string | ArrayBuffer | null = null;

  
  options: string[] = ['Reciclagem', 'Plantação', 'Compostagem'];

 
  selectedOption: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  selectOption(option: string) {
    this.selectedOption = option;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.file = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.preview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  registrarAcao() {
    if (!this.titulo || !this.descricao || !this.file || !this.selectedOption) {
      alert('Preencha todos os campos, selecione um tipo de ação e escolha uma imagem!');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.titulo);
    formData.append('descricao', this.descricao);
    formData.append('tipo_acao', this.selectedOption);
    formData.append('imagem', this.file);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado!');
      return;
    }

    this.http.post('http://localhost:8000/actions/', formData, {
      headers: {
        Authorization: Bearer ${token},
      },
    }).subscribe({
      next: () => {
        alert('Ação registrada com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('Ocorreu um erro ao registrar a ação!');
      },
    });
  }
}
