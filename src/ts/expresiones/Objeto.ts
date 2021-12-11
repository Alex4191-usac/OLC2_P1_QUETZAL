import { Entorno } from '../ast/Entorno';

import{Atributo}  from "./Atributo"

export class Objeto {

    identificador: string;
    texto: string;
    atributos: Array<Atributo>;
    objetos: Array<Objeto>;
    fila: number;
    columna: number;
    entorno: Entorno;

    constructor(id: string, texto: string, atributos: Array<Atributo>, objetos: Array<Objeto>, fila: number, columna: number) {
        this.identificador = id;
        this.texto = texto;
        this.fila = fila;
        this.columna = columna;
        this.atributos = atributos;
        this.objetos = objetos;
        this.entorno = new Entorno(null, id);
    }
}