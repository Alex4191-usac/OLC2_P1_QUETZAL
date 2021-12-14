import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Traduccion } from "../ast/Traduccion";


export enum ONativa {
    PARSE,
    TOINT,
    TODOUBLE,
    STRING,
    TYPEOF
}

export class Nativas implements Expresion {
    fila: number;
    columna: number;
    expresion: Expresion;
    operacion: ONativa;
    tipo: Tipo;
    estoDouble: boolean;

    constructor(expresion: Expresion, operacion: ONativa, fila: number, columna: number, tipo: Tipo) {
        this.expresion = expresion;
        this.operacion = operacion;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
        this.estoDouble = false;
    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        const valor = this.getValorImplicito(ent, arbol, errores, imprimir);

        if (typeof (valor) === 'number' || typeof (valor) === "bigint") {
            if (this.esEntero(Number(valor))) {
                return Tipo.INT;
            }
            return Tipo.DOUBLE;
        } else if (typeof (valor) === "string") {
            if (this.esChar(valor)) {
                return Tipo.CHAR;
            }
            if (this.estoDouble) {
                if (this.esDouble(valor)) {
                    return Tipo.DOUBLE;
                }
            }
            return Tipo.STRING;
        } else if (typeof (valor) === "boolean") {
            return Tipo.BOOLEAN;
        } else if (valor === null) {
            return Tipo.NULL;
        }
        return Tipo.VOID;
    }

    getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (this.operacion == ONativa.PARSE) {
            var op = this.expresion.getValorImplicito(ent, arbol, errores, imprimir);
            if (typeof (op) === "string") {
                if (!this.esChar(op)) {
                    if (this.tipo == Tipo.INT) {
                        try {
                            return parseInt(op);
                        } catch {
                            let er = new Errores("Semántico", "Tipo de dato inválido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido\n");
                            return null;
                        }
                    } else if (this.tipo == Tipo.DOUBLE) {
                        try {
                            return parseFloat(op);
                        } catch {
                            let er = new Errores("Semántico", "Tipo de dato inválido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido\n");
                            return null;
                        }
                    } else if (this.tipo == Tipo.BOOLEAN) {
                        if (op.toLowerCase() === "true" || op === "1") {
                            return true;
                        } else if (op.toLowerCase() === "false" || op === "0") {
                            return false;
                        } else {
                            let er = new Errores("Semántico", "Tipo de dato inválido", this.fila, this.columna, ent.nombre);
                            errores.push(er);
                            imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido\n");
                            return null;
                        }
                    } else {
                        let er = new Errores("Semántico", "Tipo de parseo inválido", this.fila, this.columna, ent.nombre);
                        errores.push(er);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de parseo inválido\n");
                        return null;
                    }
                } else {
                    let er = new Errores("Semántico", "Tipo de dato inválido", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido\n");
                    return null;
                }
            } else {
                let er = new Errores("Semántico", "Tipo de dato inválido", this.fila, this.columna, ent.nombre);
                errores.push(er);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido\n");
                return null;
            }
        } else if (this.operacion == ONativa.TOINT) {
            var op = this.expresion.getValorImplicito(ent, arbol, errores, imprimir);
            if (typeof (op) === "number") {
                if (!this.esEntero(op)) {
                    return Math.trunc(op);
                } else {
                    let er = new Errores("Semántico", "El número ya es tipo int", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", El número ya es tipo int\n");
                    return op;
                }
            } else {
                let er = new Errores("Semántico", "Tipo de dato inválido", this.fila, this.columna, ent.nombre);
                errores.push(er);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido\n");
                return null;
            }
        } else if (this.operacion == ONativa.TODOUBLE) {
            this.estoDouble = true;
            var op = this.expresion.getValorImplicito(ent, arbol, errores, imprimir);
            if (typeof (op) === "number") {
                if (this.esEntero(op)) {
                    return op.toFixed(1);
                } else {
                    let er = new Errores("Semántico", "El número ya es tipo double", this.fila, this.columna, ent.nombre);
                    errores.push(er);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", El número ya es tipo double\n");
                    return op;
                }
            } else {
                let er = new Errores("Semántico", "Tipo de dato inválido", this.fila, this.columna, ent.nombre);
                errores.push(er);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido\n");
                return null;
            }
        } else if (this.operacion == ONativa.STRING) {
            var op = this.expresion.getValorImplicito(ent, arbol, errores, imprimir);
            if (op !== null) {
                return op.toString();
            } else {
                let er = new Errores("Semántico", "No se puede convertir un valor nulo", this.fila, this.columna, ent.nombre);
                errores.push(er);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No se puede convertir un valor nulo\n");
                return null;
            }
        } else if (this.operacion == ONativa.TYPEOF) {
            op = this.expresion.getTipo(ent, arbol, errores, imprimir);
            if (op == Tipo.INT) {
                return "int";
            } else if (op == Tipo.DOUBLE) {
                return "double";
            } else if (op == Tipo.STRING) {
                return "String";
            } else if (op == Tipo.CHAR) {
                return "char";
            } else if (op == Tipo.BOOLEAN) {
                return "boolean";
            } else if (op == Tipo.VOID) {
                return "void";
            } else {
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

    esDouble(n: string) {
        let a: string[] = n.split(".");
        return this.esEntero(Number(a[0])) && this.esEntero(Number(a[1])) && a.length == 2;
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }

}