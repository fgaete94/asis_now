export interface Asistencia {
    id?: number;
    usuario: string;
    entrada?: Date | null;
    salida?: Date | null;
    estacion?: string;
    linea?: string;
    ubicacionUrl?: string;
    justificado?: Date | null;
    observacion?: string;
  }