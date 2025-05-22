

export interface User {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  rol: number; // La propiedad rol es del tipo Rol, no string
  user: string; // user
  password: string;
  
  
}