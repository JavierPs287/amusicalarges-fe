import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  visible = true;
  lastScroll = 0;

  @HostListener('window:scroll')
  onScroll() {
    const current = window.scrollY;

    if (current > this.lastScroll && current > 60) {
      this.visible = false; // bajando → ocultar
    } else {
      this.visible = true;  // subiendo → mostrar
    }

    this.lastScroll = current;
  }
}