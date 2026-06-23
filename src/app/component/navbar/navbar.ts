import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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

  isMobile = false;
  menuOpen = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([
        Breakpoints.Handset,
        Breakpoints.TabletPortrait
      ])
      .subscribe(result => {
        this.isMobile = result.matches;

        if (!this.isMobile) {
          this.menuOpen = false;
        }
      });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
  @HostListener('window:scroll')
  onScroll() {

    const current = window.scrollY;


    if (current > this.lastScroll && current > 60) {

      this.visible = false;

      // cerrar menú al bajar
      this.menuOpen = false;

    } else {

      this.visible = true;

    }


    this.lastScroll = current;
  }
}