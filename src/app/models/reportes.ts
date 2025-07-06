export interface Reportes {
    id?: number;
    usuario: string;
    fecha?: Date | null;
    descripcion?: string;
    estacion?: string;
    imagenUrl?: string; // URL de la imagen del reporte
  }