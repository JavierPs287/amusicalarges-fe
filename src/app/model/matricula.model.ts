export interface Matricula {
  // Datos del alumno
  nombreApellidosAlumno: string;
  nifCif: string;
  domicilio: string;
  cpPoblacion: string;
  edad: string;
  fechaNacimiento: string;
  telefono1: string;
  telefono2: string;
  email: string;
  nombreTutor: string;

  // Asignaturas
  asignaturas: string[];

  // Especialidades instrumentales
  especialidades: string[];
  instOtrosText: string;

  // Datos bancarios
  titularNombre: string;
  titularDni: string;
  entidadNombrePoblacion: string;
  iban: string;

  // Fecha de firma
  firmaDia: string;
  firmaMes: string;

  // Metadata
  curso: string;
}
