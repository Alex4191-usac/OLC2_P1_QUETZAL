import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"


export enum operadorRelacional {
    MENOR,
    MAYOR,
    MENORIGUAL,
    MAYORIGUAL,
    DIFERENTE,
    IGUAL
}

export class Relacional implements Expresion {
    fila: number;
    columna: number;
    op1: Expresion;
    op2: Expresion;
    operador: operadorRelacional;

    constructor(op1: Expresion, op2: Expresion, operador: operadorRelacional, fila: number, columna: number) {
        this.op1 = op1;
        this.op2 = op2;
        this.operador = operador;
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
        let op1 = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
        let op2 = this.op2.getValorImplicito(ent, arbol, errores, imprimir);

        if (this.operador == operadorRelacional.MAYOR) {
            if (typeof (op1) === "number" && typeof (op2) === "number") {
                return op1 > op2;
            } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                return op1 > op2;
            } else {
                //Error semantico, los tipos no coinciden para hacer la operación
                return null;
            }
        } else if (this.operador == operadorRelacional.MAYORIGUAL) {
            if (typeof (op1) === "number" && typeof (op2) === "number") {
                return op1 >= op2;
            } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                return op1 >= op2;
            } else {
                //Error semantico, los tipos no coinciden para hacer la operación
                return null;
            }
        } else if (this.operador == operadorRelacional.MENOR) {
            if (typeof (op1) === "number" && typeof (op2) === "number") {
                return op1 < op2;
            } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                return op1 < op2;
            } else {
                //Error semantico, los tipos no coinciden para hacer la operación
                return null;
            }
        } else if (this.operador == operadorRelacional.MENORIGUAL) {
            if (typeof (op1) === "number" && typeof (op2) === "number") {
                return op1 <= op2;
            } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                return op1 <= op2;
            } else {
                //Error semantico, los tipos no coinciden para hacer la operación
                return null;
            }
        } else if (this.operador == operadorRelacional.DIFERENTE) {
            if (typeof (op1) === "number" && typeof (op2) === "number") {
                return op1 !== op2;
            } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                return op1 !== op2;
            } else if (typeof (op1) === "boolean" && typeof (op2) === "boolean") {
                return op1 !== op2;
            } else {
                //Error semantico, los tipos no coinciden para hacer la operación
                return null;
            }
        } else if (this.operador == operadorRelacional.IGUAL) {
            if (typeof (op1) === "number" && typeof (op2) === "number") {
                return op1 === op2;
            } else if (typeof (op1) === "string" && typeof (op2) === "string") {
                return op1 === op2;
            } else if (typeof (op1) === "boolean" && typeof (op2) === "boolean") {
                return op1 === op2;
            } else {
                //Error semantico, los tipos no coinciden para hacer la operación
                return null;
            }
        }
        return null;
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