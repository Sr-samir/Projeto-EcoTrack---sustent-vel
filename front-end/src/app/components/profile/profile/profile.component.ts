import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  nome: string = '';
  email: string = '';

  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.usuarioService.loadUserProfile()
.subscribe({
      next: (res: any) => {
        if (res) {
          this.nome = res.nome;
          this.email = res.email;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  salvarPerfil() {
    const data = { nome: this.nome, email: this.email };

    this.usuarioService.updateProfile(data).subscribe({
      next: () => alert('Dados atualizados com sucesso!'),
      error: () => alert('Erro ao atualizar perfil!')
    });
  }

  alterarSenha() {
    if (this.novaSenha !== this.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const data = {
      senha_atual: this.senhaAtual,
      nova_senha: this.novaSenha
    };

    this.usuarioService.updatePassword(data).subscribe({
      next: () => {
        alert('Senha alterada!');
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
      },
      error: () => alert('Erro ao atualizar senha!')
    });
  }
}
