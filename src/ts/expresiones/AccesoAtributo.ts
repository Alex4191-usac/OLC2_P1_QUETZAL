import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import {Tipo} from "../ast/Tipo"
import { Traduccion } from "../ast/Traduccion";
import { Expresion } from "../interfaces/Expresion"

export class AccesoAtributo implements Expresion {

    idStruct: string;
    atributo: string;
    fila: number;
    columna: number;

    constructor(idStruct: string, atributo: string, fila: number, columna: number) {
        this.idStruct = idStruct;
        this.atributo = atributo;
        this.fila = fila;
        this.columna = columna;

    }
    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        throw new Error('Method not implemented.');
    }
    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        throw new Error('Method not implemented.');
    }
    
}