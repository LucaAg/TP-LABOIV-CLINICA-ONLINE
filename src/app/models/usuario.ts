export class Usuario {
    id: number;
    perfil:string;
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    email: string;
    clave: string;
    imagen1: string;
    
  
    constructor() {
      this.id = 0;
      this.perfil = '';
      this.nombre = '';
      this.apellido = '';
      this.edad = 0;
      this.dni = 0;
      this.email = '';
      this.clave = '';
      this.imagen1 = '';
    }
  }