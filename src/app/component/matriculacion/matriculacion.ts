import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
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
  @ViewChildren('ibanInput')
  ibanInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // Estado UI
  enviando = false;
  mensajeError: string | null = null;
  mostrarDialogoPdf = false;
  mostrarDialogoExito = false;

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
    canto: false,
    otros: false,
  };
  instOtrosText = '';

  // Datos bancarios
  titularNombre = '';
  titularDni = '';
  entidadNombrePoblacion = '';
  ibanDigits: string[] = new Array(24).fill('');

  // Fecha firma
  firmaDia = '';
  firmaMes = '';

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

    if (input.value && idx < this.ibanDigits.length - 1) {
      setTimeout(() => {
        const nextInput = this.ibanInputs.get(idx + 1)?.nativeElement;

        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      });
    }
  }

  onIbanKeydown(idx: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.ibanDigits[idx] && idx > 0) {
      this.ibanInputs.toArray()[idx - 1]?.nativeElement.focus();
      this.ibanInputs.toArray()[idx - 1]?.nativeElement.select();
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && idx > 0) {
      event.preventDefault();
      this.ibanInputs.toArray()[idx - 1]?.nativeElement.focus();
      this.ibanInputs.toArray()[idx - 1]?.nativeElement.select();
    } else if (event.key === 'ArrowRight' && idx < this.ibanDigits.length - 1) {
      event.preventDefault();
      this.ibanInputs.toArray()[idx + 1]?.nativeElement.focus();
      this.ibanInputs.toArray()[idx + 1]?.nativeElement.select();
    }
  }

  onIbanPaste(idx: number, event: ClipboardEvent): void {
    event.preventDefault();
    const text = (event.clipboardData || (window as any).clipboardData).getData('text') || '';
    const clean = text.toUpperCase().replace(/\s+/g, '').replace(/[^A-Z0-9]/g, '');
    for (let i = 0; i < clean.length && idx + i < this.ibanDigits.length; i++) {
      this.ibanDigits[idx + i] = clean[i];
      const ref = this.ibanInputs.toArray()[idx + i];
      if (ref) ref.nativeElement.value = clean[i];
    }
    const next = Math.min(idx + clean.length, this.ibanDigits.length - 1);
    this.ibanInputs.toArray()[next]?.nativeElement.focus();
    this.ibanInputs.toArray()[next]?.nativeElement.select();
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
        this.mostrarDialogoExito = true;
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

  /**
   * Cierra el popup de éxito y reinicia el formulario para una nueva matrícula.
   */
  cerrarDialogoExito(): void {
    this.mostrarDialogoExito = false;
    this.resetForm();
    this.cdr.detectChanges();
  }

  /**
   * Reinicia todos los campos del formulario a su estado inicial.
   */
  private resetForm(): void {
    this.nombreApellidosAlumno = '';
    this.nifCif = '';
    this.domicilio = '';
    this.cpPoblacion = '';
    this.edad = '';
    this.fechaNacimiento = '';
    this.telefono1 = '';
    this.telefono2 = '';
    this.email = '';
    this.nombreTutor = '';

    this.asignaturas = {
      lenguaje_musical: false,
      iniciacion_musical: false,
      instrumento: false,
      iniciacion_instrumento: false,
    };

    this.especialidades = {
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
      canto: false,
      otros: false,
    };
    this.instOtrosText = '';

    this.titularNombre = '';
    this.titularDni = '';
    this.entidadNombrePoblacion = '';
    this.ibanDigits = new Array(24).fill('');
    this.ibanInputs.forEach((ref) => {
      if (ref) ref.nativeElement.value = '';
    });

    this.firmaDia = '';
    this.firmaMes = '';

    this.mensajeError = null;
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
    if (el.type === 'checkbox') {
      if (name && name.startsWith('asig_')) {
        const key = name.replace('asig_', '') as keyof typeof this.asignaturas;
        return !!this.asignaturas[key];
      }
      if (name && name.startsWith('inst_') && name !== 'inst_otros_text') {
        const key = name.replace('inst_', '') as keyof typeof this.especialidades;
        return !!this.especialidades[key];
      }
    }
    return el.checked;
  }
}