import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActualidadService } from '../../services/actualidad.service';
import { FacebookContent } from '../../model/facebookContent.model';

@Component({
  selector: 'app-actualidad',
  standalone: true,
  templateUrl: './actualidad.html',
  styleUrl: './actualidad.css'
})
export class Actualidad implements OnInit {

  contenidos: FacebookContent[] = [];

  // Datos de ejemplo si no hay nada en BD
  private readonly contenidosEjemplo: FacebookContent[] = [
    {
      titulo: 'Reel de la Asociación Musical Arges',
      fecha: 'Junio 2026',
      tipo: 'video',
      url: 'https://www.facebook.com/reel/1322297286781125/'
    },
    {
      titulo: 'Nueva publicación',
      fecha: 'Junio 2026',
      tipo: 'post',
      url: 'https://www.facebook.com/AsociacionMusicalArges/posts/pfbid0dTE4HVbKnVZiudZL5SLSWzpRFSVzj5dmLxhbKkc9KErB6mTjLoT7vy5AGSGHC4LCl'
    }
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private actualidadService: ActualidadService
  ) {}

  ngOnInit(): void {
    this.cargarContenidos();
  }

  cargarContenidos(): void {
    this.actualidadService.getContenidos().subscribe({
      next: (datos) => {
        // console.log("Datos recibidos del backend:", datos);
        this.contenidos = datos.length ? datos : this.contenidosEjemplo;
      },
      error: (error) => {
        // console.error("Error cargando contenidos:", error);
        this.contenidos = this.contenidosEjemplo;
      }
    });
  }

  getFacebookEmbed(contenido: FacebookContent): SafeResourceUrl {

    let embed = '';

    if (contenido.tipo === 'video') {
      embed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(contenido.url)}&show_text=true&width=500`;
    } else {
      embed = `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(contenido.url)}&show_text=true&width=500`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }

}