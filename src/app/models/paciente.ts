import { Usuario } from "./usuario";

export class Paciente extends Usuario
{
    obraSocial: string;
    imagen2: string;

    constructor()
    {
        super();
        this.obraSocial = "";
        this.imagen2 = "";
    }
}   