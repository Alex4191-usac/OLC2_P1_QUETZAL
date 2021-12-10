
import{Atributo}  from "./Atributo"

export class Objeto{
    identificador: string;
    texto: string;
    atributos: Array<Atributo>;
    objetos: Array<Objeto>;
    fila: number;
    columna: number;
   // entorno: Entorno;
}