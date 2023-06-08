import { Usuario } from "./usuario";

export class Especialista extends Usuario
{
    especialidad: string[]=[];
    aprobado: boolean;
    constructor(){
        super();
        this.especialidad = [];
        this.aprobado = false;
    }
}