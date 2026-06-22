import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Navbar } from './component/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('amusicalarges-fe');

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {

  if (isPlatformBrowser(this.platformId)) {

    const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (dark: boolean) => {
      if (dark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    };

    applyTheme(darkMode.matches);

    darkMode.addEventListener('change', (event) => {
      applyTheme(event.matches);
    });

  }
}
}