import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class Galeria {
  readonly galleryItems: GalleryItem[] = [
    {
      src: '/home-carrusel/charanga.jpeg',
      alt: 'Charanga en la calle',
      title: 'Charanga en la calle',
      caption: 'La banda acompañando las fiestas de Argés.',
    },
    {
      src: '/home-carrusel/4calles.jpeg',
      alt: 'Procesión por las calles',
      title: 'Procesión y tradición',
      caption: 'Una imagen vertical que encaja con la marcha de la procesión.',
    },
    {
      src: '/home-carrusel/toros.jpeg',
      alt: 'Fiestas con ambiente',
      title: 'Ambiente festivo',
      caption: 'Momentos de celebración compartida con el pueblo.',
    },
    {
      src: '/home-carrusel/sanantonio.jpg',
      alt: 'San Antonio',
      title: 'San Antonio',
      caption: 'Recuerdo de una jornada especial dentro del calendario festivo.',
    },
    {
      src: '/home-carrusel/charanga.jpeg',
      alt: 'Charanga tocando en la calle',
      title: 'Música en movimiento',
      caption: 'El sonido de la banda recorriendo cada rincón.',
    },
    {
      src: '/home-carrusel/4calles.jpeg',
      alt: 'Detalle de la procesión',
      title: 'Detalle de procesión',
      caption: 'Una foto vertical que mantiene bien su proporción original.',
    },
    {
      src: '/home-carrusel/toros.jpeg',
      alt: 'Celebración popular',
      title: 'Celebración popular',
      caption: 'Colores, gente y tradición en una sola escena.',
    },
    {
      src: '/home-carrusel/sanantonio.jpg',
      alt: 'San Antonio en fiestas',
      title: 'San Antonio en fiestas',
      caption: 'Una imagen más del mismo álbum para completar el tablero.',
    },
  ];
}
