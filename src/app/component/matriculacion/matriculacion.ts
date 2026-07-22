import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatriculaService } from '../../services/matricula.service';
import { Matricula } from '../../model/matricula.model';

@Component({
  selector: 'app-matriculacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './matriculacion.html',
  styleUrl: './matriculacion.css',
})
export class Matriculacion implements OnInit, AfterViewInit {

  @ViewChild('sheet', { static: false }) sheetRef?: ElementRef<HTMLFormElement>;

  // Estado UI
  enviando = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  mostrarDialogoPdf = false;

  // Datos del alumno
  nombreApellidosAlumno = '';
  nifCif = '';
  domicilio = '';
  cpPoblacion = '';
  edad = '';
  fechaNacimiento = '';
  telefono1 = '';
  telefono2 = '';
  email = '';
  nombreTutor = '';

  // Asignaturas
  asignaturas = {
    lenguaje_musical: false,
    iniciacion_musical: false,
    instrumento: false,
    iniciacion_instrumento: false,
    canto: false,
  };

  // Especialidades instrumentales
  especialidades = {
    tuba: false,
    trompeta: false,
    saxo_tenor: false,
    piano: false,
    bombardino: false,
    fliscorno: false,
    clarinete: false,
    guitarra_clasica: false,
    trombon: false,
    saxo_alto: false,
    requinto: false,
    guitarra_electrica: false,
    trompa: false,
    saxo_soprano: false,
    flauta: false,
    percusion: false,
    otros: false,
  };
  instOtrosText = '';

  // Nivel
  nivelLenguajeMusical = '';

  // Precios
  precios = {
    lenguaje_musical: false,
    iniciacion_musical: false,
    instrumento_canto: false,
  };

  // Datos bancarios
  titularNombre = '';
  titularDni = '';
  entidadNombrePoblacion = '';
  ibanDigits: string[] = new Array(24).fill('');

  // Fecha firma
  firmaDia = '';
  firmaMes = '';

  // IBAN cells: referencias para autofocus tras pegar
  ibanInputRefs: (HTMLInputElement | null)[] = new Array(24).fill(null);

  // Logo de la asociación (la ruta física está en FE/src/assets o en public)
  // Reutilizamos el logo de la web
  readonly logoUrl = 'logo.png';

  readonly curso = '2026-2027';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private matriculaService: MatriculaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Nada especial al iniciar
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Auto-focus inicial en el primer campo
      const firstField = document.getElementById('nombre_apellidos_alumno') as HTMLInputElement | null;
      firstField?.focus();
    }
  }

  // === IBAN ===
  onIbanInput(idx: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = (input.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 1);
    this.ibanDigits[idx] = val;
    input.value = val;
    if (val && idx < this.ibanDigits.length - 1) {
      this.ibanInputRefs[idx + 1]?.focus();
      this.ibanInputRefs[idx + 1]?.select();
    }
  }

  onIbanKeydown(idx: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.ibanDigits[idx] && idx > 0) {
      this.ibanInputRefs[idx - 1]?.focus();
      this.ibanInputRefs[idx - 1]?.select();
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && idx > 0) {
      event.preventDefault();
      this.ibanInputRefs[idx - 1]?.focus();
      this.ibanInputRefs[idx - 1]?.select();
    } else if (event.key === 'ArrowRight' && idx < this.ibanDigits.length - 1) {
      event.preventDefault();
      this.ibanInputRefs[idx + 1]?.focus();
      this.ibanInputRefs[idx + 1]?.select();
    }
  }

  onIbanPaste(idx: number, event: ClipboardEvent): void {
    event.preventDefault();
    const text = (event.clipboardData || (window as any).clipboardData).getData('text') || '';
    const clean = text.toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '');
    for (let i = 0; i < clean.length && idx + i < this.ibanDigits.length; i++) {
      this.ibanDigits[idx + i] = clean[i];
      const ref = this.ibanInputRefs[idx + i];
      if (ref) ref.value = clean[i];
    }
    const next = Math.min(idx + clean.length, this.ibanDigits.length - 1);
    this.ibanInputRefs[next]?.focus();
    this.ibanInputRefs[next]?.select();
  }

  setIbanRef(idx: number, el: HTMLInputElement | null): void {
    this.ibanInputRefs[idx] = el;
  }

  get ibanCompleto(): string {
    return this.ibanDigits.join('');
  }

  // === Helpers para los grupos de IBAN (solo usados para el render) ===
  ibanGroup(start: number, end: number): string[] {
    return this.ibanDigits.slice(start, end);
  }

  // === Acciones ===
  enviarAlBackend(): void {
    this.mensajeError = null;
    this.mensajeExito = null;

    if (!this.email || !this.email.trim()) {
      this.mensajeError = 'El email es obligatorio para poder enviar la matrícula.';
      return;
    }
    if (!this.nombreApellidosAlumno || !this.nombreApellidosAlumno.trim()) {
      this.mensajeError = 'El nombre y apellidos del alumno son obligatorios.';
      return;
    }

    const matricula: Matricula = {
      nombreApellidosAlumno: this.nombreApellidosAlumno.trim(),
      nifCif: this.nifCif.trim(),
      domicilio: this.domicilio.trim(),
      cpPoblacion: this.cpPoblacion.trim(),
      edad: this.edad.trim(),
      fechaNacimiento: this.fechaNacimiento.trim(),
      telefono1: this.telefono1.trim(),
      telefono2: this.telefono2.trim(),
      email: this.email.trim(),
      nombreTutor: this.nombreTutor.trim(),
      asignaturas: Object.entries(this.asignaturas).filter(([_, v]) => v).map(([k]) => k),
      especialidades: Object.entries(this.especialidades).filter(([_, v]) => v).map(([k]) => k),
      instOtrosText: this.instOtrosText.trim(),
      nivelLenguajeMusical: this.nivelLenguajeMusical,
      precios: Object.entries(this.precios).filter(([_, v]) => v).map(([k]) => k),
      titularNombre: this.titularNombre.trim(),
      titularDni: this.titularDni.trim(),
      entidadNombrePoblacion: this.entidadNombrePoblacion.trim(),
      iban: this.ibanCompleto,
      firmaDia: this.firmaDia.trim(),
      firmaMes: this.firmaMes.trim(),
      curso: this.curso,
    };

    this.enviando = true;
    this.matriculaService.addMatricula(matricula).subscribe({
      next: () => {
        this.enviando = false;
        this.mensajeExito = '¡Matrícula enviada correctamente! Te contactaremos al email facilitado.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.enviando = false;
        console.error('Error al enviar la matrícula', err);
        this.mensajeError = err?.error?.message || err?.message || 'No se pudo enviar la matrícula. Inténtalo de nuevo más tarde.';
        this.cdr.detectChanges();
      }
    });
  }

  // === PDF ===
  abrirDialogoPdf(): void {
    this.mostrarDialogoPdf = true;
  }

  cerrarDialogoPdf(): void {
    this.mostrarDialogoPdf = false;
  }

  /**
   * Vacía temporalmente los inputs del formulario (sin tocar el modelo Angular),
   * lanza window.print() y restaura los valores al cerrar el diálogo de impresión
   * gracias a afterprint. Así el usuario puede imprimir/PDF con el formulario en blanco.
   */
  descargarPdfVacio(): void {
    if (!isPlatformBrowser(this.platformId) || !this.sheetRef) {
      return;
    }
    this.mostrarDialogoPdf = false;

    const form = this.sheetRef.nativeElement;
    // Guardamos los valores actuales para restaurarlos al volver
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>('input'));
    const snapshot = inputs.map((el) => el.value);

    // Vaciamos inputs (checkbox/radio se desmarcan visualmente)
    inputs.forEach((el) => {
      if (el.type === 'checkbox' || el.type === 'radio') {
        el.checked = false;
      } else {
        el.value = '';
      }
    });

    const restore = () => {
      inputs.forEach((el, i) => {
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = this.isInputChecked(el);
        } else {
          el.value = snapshot[i];
        }
      });
      window.removeEventListener('afterprint', restore);
      this.cdr.detectChanges();
    };

    window.addEventListener('afterprint', restore);
    // Damos un pequeño respiro para que el navegador pinte los inputs vacíos antes de imprimir
    setTimeout(() => window.print(), 60);
  }

  /**
   * Imprime/PDF tal cual está el formulario (con los datos rellenados).
   */
  descargarPdfConDatos(): void {
    this.mostrarDialogoPdf = false;
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    setTimeout(() => window.print(), 60);
  }

  /**
   * Devuelve si un input checkbox/radio debería estar marcado según el modelo Angular.
   */
  private isInputChecked(el: HTMLInputElement): boolean {
    const name = el.name;
    if (el.type === 'radio') {
      return el.value === this.nivelLenguajeMusical && el.value !== '';
    }
    if (el.type === 'checkbox') {
      if (name && name.startsWith('asig_')) {
        const key = name.replace('asig_', '') as keyof typeof this.asignaturas;
        return !!this.asignaturas[key];
      }
      if (name && name.startsWith('inst_') && name !== 'inst_otros_text') {
        const key = name.replace('inst_', '') as keyof typeof this.especialidades;
        return !!this.especialidades[key];
      }
      if (name && name.startsWith('precio_')) {
        const key = name.replace('precio_', '') as keyof typeof this.precios;
        return !!this.precios[key];
      }
    }
    return el.checked;
  }
}
