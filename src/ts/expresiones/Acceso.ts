import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Simbolo } from "../ast/Simbolo"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"

export class Acceso implements Expresion {
    fila: number;
    columna: number;
    public identificador: string;

    constructor(identificador: string, fila: number, columna: number) {
        this.identificador = identificador;
        this.fila = fila;
        this.columna = columna;
    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        if(ent.existe(this.identificador)){
            const simbolo:Simbolo = ent.getSimbolo(this.identificador);
            return simbolo.getTipo(ent, arbol, errores, imprimir); 
        }
        return Tipo.NULL;
    }

    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if(ent.existe(this.identificador)){
            const simbolo:Simbolo = ent.getSimbolo(this.identificador);
            return simbolo.valor; 
        } else {
            //Agregar error semantico
            return null;
        }
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

}