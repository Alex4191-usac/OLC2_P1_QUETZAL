import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"


export class Ternario implements Expresion {

    condicion: Expresion;
    siVerdadero: Expresion;
    siFalso: Expresion;
    fila: number;
    columna: number;

    constructor(condicion: Expresion, siVerdadero: Expresion, siFalso: Expresion, fila: number, columna: number) {
        this.condicion = condicion;
        this.siVerdadero = siVerdadero;
        this.siFalso = siFalso;
        this.fila = fila;
        this.columna = columna;
    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        const valor = this.getValorImplicito(ent, arbol, errores, imprimir);

        if (typeof (valor) === 'number') {
            if (this.esEntero(Number(valor))) {
                return Tipo.INT;
            }
            return Tipo.DOUBLE;
        } else if (typeof (valor) === 'string') {
            if (this.esChar(valor)) {
                return Tipo.CHAR;
            }
            return Tipo.STRING;
        } else if (typeof (valor) === 'boolean') {
            return Tipo.BOOLEAN;
        } else if (valor === null) {
            return Tipo.NULL;
        } else if (typeof (valor) === 'object') {
            return Tipo.ARRAY;
        }
        return Tipo.VOID;
    }

    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        var condi = this.condicion.getValorImplicito(ent, arbol, errores, imprimir);
        if (condi) {
            return this.siVerdadero.getValorImplicito(ent, arbol, errores, imprimir);
        } else {
            return this.siFalso.getValorImplicito(ent, arbol, errores, imprimir);
        }
    }

    esEntero(n: number) {
        return Number(n) === n && n % 1 === 0;
    }

    esChar(n: string) {
        return n[0] === "'" && n[2] === "'" && n.length === 3;
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }
}