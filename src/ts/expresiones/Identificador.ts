import { Nativa } from "../Instrucciones/Nativa";
export class Identificador {
    
    nombre: string;
    funcionNativa: Nativa;
    
    constructor(nombre: string, funcionNativa: Nativa) {
        this.nombre = nombre;
        this.funcionNativa = funcionNativa;
    }
}