import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
   constructor(private router: Router) {}

  // Função de logout
  logout() {
    // Remover o token do localStorage
    localStorage.removeItem('token');
    
    // Redirecionar o usuário para a página de login
    this.router.navigate(['/login']);
  }

}
