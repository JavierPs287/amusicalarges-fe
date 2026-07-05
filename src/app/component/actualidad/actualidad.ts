import { Component, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChildren, QueryList, ElementRef} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActualidadService } from '../../services/actualidad.service';
import { FacebookContent } from '../../model/facebookContent.model';

@Component({
  selector: 'app-actualidad',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './actualidad.html',
  styleUrl: './actualidad.css'
})
export class Actualidad implements AfterViewInit, OnDestroy {
 
  contenidos: FacebookContent[] = [];
  cargando = true;
  errorCarga: string | null = null;
 
  // Ancho actual (en px) calculado para cada tarjeta, indexado por url
  private anchosPorUrl = new Map<string, number>();
  // Cache de las SafeResourceUrl ya generadas, para no reconstruirlas en cada change detection
  private embedsCache = new Map<string, SafeResourceUrl>();
 
  @ViewChildren('videoCardRef') videoCards!: QueryList<ElementRef<HTMLElement>>;
 
  private resizeObserver?: ResizeObserver;
 
  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private actualidadService: ActualidadService
  ) {
    this.cargarContenidos();
  }
 
  ngAfterViewInit(): void {
    this.observarTarjetas();
    this.videoCards.changes.subscribe(() => this.observarTarjetas());
  }
 
  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
 
  private observarTarjetas(): void {
    this.resizeObserver?.disconnect();
 
    if (typeof ResizeObserver === 'undefined') return;
 
    this.resizeObserver = new ResizeObserver((entries) => {
      let huboCambios = false;
 
      for (const entry of entries) {
        const url = entry.target.getAttribute('data-url');
        if (!url) continue;
 
        const anchoReal = Math.round(entry.contentRect.width);
        const anchoAnterior = this.anchosPorUrl.get(url);
 
        // Evitamos regenerar el iframe por cambios de 1-2px (ruido de layout)
        if (!anchoAnterior || Math.abs(anchoAnterior - anchoReal) > 8) {
          this.anchosPorUrl.set(url, anchoReal);
          this.embedsCache.delete(url); // forzamos regeneración del embed
          huboCambios = true;
        }
      }
 
      if (huboCambios) {
        this.cdr.detectChanges();
      }
    });
 
    this.videoCards.forEach((card) => {
      this.resizeObserver!.observe(card.nativeElement);
    });
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
 
  /**
   * Relación de aspecto (ancho/alto) usada para cada tipo de contenido.
   * Debe coincidir con los valores de `aspect-ratio` definidos en el CSS
   * para .video-container.video y .video-container.post, para que el
   * height que le pedimos a Facebook encaje exactamente con el hueco
   * que le hace el contenedor.
   */
  private obtenerRelacionAspecto(contenido: FacebookContent): number {
    // 9/16 para reels verticales, 4/5 para posts normales
    return contenido.tipo === 'video' ? 9 / 16 : 4 / 5;
  }
 
  getFacebookEmbed(contenido: FacebookContent): SafeResourceUrl {
    const cacheado = this.embedsCache.get(contenido.url);
    if (cacheado) return cacheado;
 
    // Ancho real de la tarjeta si ya lo hemos medido; si no, un valor por defecto razonable
    const anchoBase = this.anchosPorUrl.get(contenido.url) ?? 450;
    // Facebook no acepta anchos por debajo de ~180px, así que ponemos un mínimo
    const ancho = Math.max(180, Math.min(anchoBase, 500));
 
    // Calculamos el alto a partir del ancho real y la relación de aspecto propia
    // del tipo de contenido, para que el video/post NO se recorte ni se quede
    // con hueco vacío: solo el ancho cambia, el alto se ajusta proporcionalmente.
    const relacion = this.obtenerRelacionAspecto(contenido);
    const alto = Math.round(ancho / relacion);
 
    let embed = '';
    if (contenido.tipo === 'video') {
      embed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(contenido.url)}&show_text=true&width=${ancho}&height=${alto}`;
    } else {
      embed = `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(contenido.url)}&show_text=true&width=${ancho}&height=${alto}`;
    }
 
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    this.embedsCache.set(contenido.url, safeUrl);
    return safeUrl;
  }
}
 