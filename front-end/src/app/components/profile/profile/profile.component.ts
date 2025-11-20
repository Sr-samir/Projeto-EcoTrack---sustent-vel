import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

   name: string = 'Ana Silva';
  email: string = 'ana.silva@email.com';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  save() {
    console.log('Alterações salvas:', {
      name: this.name,
      email: this.email,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    });
    alert('Alterações salvas com sucesso!');
  }
}
