import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface FacebookContent {
  titulo: string;
  fecha?: string;
  url: string;
  tipo: 'video' | 'post';
}

@Component({
  selector: 'app-actualidad',
  standalone: true,
  imports: [],
  templateUrl: './actualidad.html',
  styleUrl: './actualidad.css'
})
export class Actualidad {

  contenidos: FacebookContent[] = [
    {
      titulo: "Reel de la Asociación Musical Arges",
      fecha: "Junio 2026",
      tipo: "video",
      url: "https://www.facebook.com/reel/1322297286781125/"
    },
    {
      titulo: "Nueva publicación",
      fecha: "Junio 2026",
      tipo: "post",
      url: "https://www.facebook.com/AsociacionMusicalArges/posts/pfbid0dTE4HVbKnVZiudZL5SLSWzpRFSVzj5dmLxhbKkc9KErB6mTjLoT7vy5AGSGHC4LCl"
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  getFacebookEmbed(contenido: FacebookContent): SafeResourceUrl {

    let embed = "";

    if (contenido.tipo === "video") {
      embed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(contenido.url)}&show_text=true&width=500`;
    }

    if (contenido.tipo === "post") {
      embed = `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(contenido.url)}&show_text=true&width=500`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }
}