import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Traduccion } from "../ast/Traduccion";

export enum OperadorL {
    AND,
    OR,
    NOT
}

export class Logica implements Expresion {
    fila: number;
    columna: number;
    op1: Expresion;
    op2: Expresion;
    operador: OperadorL;

    constructor(op1: Expresion, op2: Expresion, operador: OperadorL, fila: number, columna: number) {
        this.op1 = op1;
        this.op2 = op2;
        this.operador = operador;
        this.fila = fila;
        this.columna = columna;
    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        const valor = this.getValorImplicito(ent, arbol, errores, imprimir);

        if (typeof (valor) === 'number' || typeof (valor) === "bigint") {
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
        }
        return Tipo.VOID;
    }

    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (this.operador !== OperadorL.NOT) {
            let op1 = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
            let op2 = this.op2.getValorImplicito(ent, arbol, errores, imprimir);

            if (this.operador == OperadorL.AND) {
                if (typeof (op1) === "boolean" && typeof (op2) === "boolean") {
                    return op1 && op2;
                } else {
                    let er = new Errores("Semantico", "Los tipos de datos son incompatibles para operar", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos son incompatibles para operar\n");
                    return null;
                }
            } else if (this.operador == OperadorL.OR) {
                if (typeof (op1) === "boolean" && typeof (op2) === "boolean") {
                    return op1 || op2;
                } else {
                    let er = new Errores("Semantico", "Los tipos de datos son incompatibles para operar", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos son incompatibles para operar\n");
                    return null;
                }
            }
        } else {
            let op1 = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
            if (this.operador == OperadorL.NOT) {
                if (typeof (op1) === "boolean") {
                    return !op1;
                } else {
                    let er = new Errores("Semantico", "Los tipos de datos son incompatibles para operar", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", Los tipos de datos son incompatibles para operar\n");
                    return null;
                }
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

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

}