import { Usuario } from "./usuario";

export class Especialista extends Usuario
{
    especialidad: string[]=[];
    aprobado: boolean;
    duracionTurno:number;
    disponibilidad:any[]=[];
    constructor(){
        super();
        this.especialidad = [];
        this.aprobado = false;
        this.duracionTurno = 30;
        this.disponibilidad = [];
    }
}