import { Expresion } from '../interfaces/Expresion';
import { Tipo } from "./Tipo";
import {Entorno} from "./Entorno";
import {AST} from "./AST";
export class Simbolo implements Expresion{
    fila: number;
    columna: number;
    public identificador: string;
    public valor: any;
    private tipo: Tipo;
    
    constructor(tipo: Tipo, id: string, valor: any, fila: number, columna: number) {
        this.tipo = tipo;
        this.identificador = id;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        return this.tipo;
    }
    
    getValorImplicito(ent: Entorno, arbol: AST) {
        return this.valor;
    }

    traducir(ent: Entorno, arbol: AST) {
        console.log("Traducir Simbolo xD");
    }


}