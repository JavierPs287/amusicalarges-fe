import { Component, ChangeDetectorRef } from '@angular/core';
  import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
  import { ActualidadService } from '../../services/actualidad.service';
  import { FacebookContent } from '../../model/facebookContent.model';

  @Component({
    selector: 'app-actualidad',
    standalone: true,
    templateUrl: './actualidad.html',
    styleUrl: './actualidad.css'
  })
  export class Actualidad {

    contenidos: FacebookContent[] = [];
    cargando = true;
    errorCarga: string | null = null;

    constructor(
      private sanitizer: DomSanitizer,
      private cdr: ChangeDetectorRef,
      private actualidadService: ActualidadService
    ) {
      this.cargarContenidos();
    }

    cargarContenidos(): void {
      this.cargando = true;
      this.errorCarga = null;
      this.actualidadService.getContenidos().subscribe({
        next: (datos) => {
          this.contenidos = datos;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error cargando contenidos:', error);
          this.errorCarga = error?.message ?? 'No se pudieron cargar los contenidos.';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }

    getFacebookEmbed(contenido: FacebookContent): SafeResourceUrl {
      let embed = '';
      if (contenido.tipo === 'video') {
        embed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(contenido.url)}&show_text=true&width=400`;
      } else {
        embed = `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(contenido.url)}&show_text=true&width=450`;
      }
      return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    }
  }