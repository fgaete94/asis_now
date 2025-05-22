export interface Asistencia {
    id?: number;
    usuario: string;
    entrada?: Date | null;
    salida?: Date | null;
    estacion?: string;
  }