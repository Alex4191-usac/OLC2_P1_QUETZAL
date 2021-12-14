import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import {Tipo} from "../ast/Tipo"
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Traduccion } from "../ast/Traduccion";


export enum TipoString {
    COP,
    SUBSTRING,
    LENGTH,
    UPPER,
    LOWER,
    POP,
    NULL
}

export class OperacionString implements Expresion {
    fila: number;
    columna: number;
    id: any;
    exp1: any;
    exp2: any;
    operacion: TipoString;
    vieneid: boolean;
    soloTipo: boolean;

    constructor(id: any, exp1: any, exp2: any, operacion: TipoString, fila: number, columna: number, vieneid: boolean = false, soloTipo: boolean = false) {
        this.id = id;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.operacion = operacion;
        this.fila = fila;
        this.columna = columna;
        this.vieneid = vieneid;
        this.soloTipo = soloTipo;
    }

    getTipo(ent: Entorno, arbol: AST, errores: any, imprimir: any): Tipo {
        this.soloTipo = true;
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
        if (this.vieneid) {
            const ide = this.id.getValorImplicito(ent, arbol, errores, imprimir);
            if (typeof (ide) === "string") {
                var op = this.exp1.getValorImplicito(ent, arbol, errores, imprimir);
                if (op.tipo == TipoString.COP) {
                    let cadena: string[] = ide.split("");
                    if (op.indice >= 0 && op.indice < cadena.length) {
                        return cadena[op.indice];
                    } else {
                        let err = new Errores("Semántico", "El índice está fuera de los límites", this.fila, this.columna, ent.nombre);
                        errores.push(err);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El índice está fuera de los límites\n");
                        return null;
                    }
                } else if (op.tipo == TipoString.SUBSTRING) {
                    let cadena: string[] = ide.split("");
                    if ((op.op1 >= 0 && op.op1 < cadena.length) && (op.op2 > 0 && op.op2 < cadena.length) && (op.op1 < op.op2)) {
                        let c = ""
                        for (op.op1; op.op1 <= op.op2; op.op1++) {
                            c += cadena[op.op1];
                        }
                        return c;
                    } else {
                        let err = new Errores("Semántico", "El índice está fuera de los límites", this.fila, this.columna, ent.nombre);
                        errores.push(err);
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El índice está fuera de los límites\n");
                        return null;
                    }
                } else if (op.tipo == TipoString.LENGTH) {
                    var cadena: string[] = ide.split("");
                    return cadena.length
                } else if (op.tipo == TipoString.UPPER) {
                    return ide.toUpperCase();
                } else if (op.tipo == TipoString.LOWER) {
                    return ide.toLowerCase();
                }
            } else if (typeof (ide) === "object") {
                var op = this.exp1.getValorImplicito(ent, arbol, errores, imprimir);
                if (op.tipo == TipoString.LENGTH) {
                    return ide.length;
                } else if (op.tipo == TipoString.POP) {
                    if (this.soloTipo) {
                        this.soloTipo = false;
                        return ide[ide.length - 1];
                    } else {
                        let aux = ide.pop();
                        const simbolo = ent.getSimbolo(this.id.identificador);
                        simbolo.valor = ide;
                        ent.reemplazar(this.id.identificador, simbolo);
                        return aux;
                    }
                }
            } else {
                let err = new Errores("Semántico", "Tipo de dato inválido para realizar la operación", this.fila, this.columna, ent.nombre);
                errores.push(err);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido para realizar la operación\n");
                return null;
            }
            return null;
        } else {
            return this.getTipoOperacion(ent, arbol, errores, imprimir);
        }
    }

    getTipoOperacion(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (this.operacion == TipoString.COP) {
            const op1 = this.exp1.getValorImplicito(ent, arbol, errores, imprimir);
            if (typeof (op1) === "number") {
                if (this.esEntero(op1)) {
                    return { tipo: TipoString.COP, indice: op1 }
                } else {
                    let err = new Errores("Semántico", "Tipo de dato inválido para realizar la operación", this.fila, this.columna, ent.nombre);
                    errores.push(err);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido para realizar la operación\n");
                    return null;
                }
            } else {
                let err = new Errores("Semántico", "Tipo de dato inválido para realizar la operación", this.fila, this.columna, ent.nombre);
                errores.push(err);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido para realizar la operación\n");
                return null;
            }
        } else if (this.operacion == TipoString.SUBSTRING) {
            var op1 = this.exp1.getValorImplicito(ent, arbol, errores, imprimir);
            var op2 = this.exp2.getValorImplicito(ent, arbol, errores, imprimir);
            if (typeof (op1) === "number" && typeof (op2) === "number") {
                if (this.esEntero(op1) && this.esEntero(op2)) {
                    return { tipo: TipoString.SUBSTRING, op1: op1, op2: op2 }
                } else {
                    let err = new Errores("Semántico", "Tipo de dato inválido para realizar la operación", this.fila, this.columna, ent.nombre);
                    errores.push(err);
                    imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido para realizar la operación\n");
                    return null;
                }
            } else {
                let err = new Errores("Semántico", "Tipo de dato inválido para realizar la operación", this.fila, this.columna, ent.nombre);
                errores.push(err);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", Tipo de dato inválido para realizar la operación\n");
                return null;
            }
        } else if (this.operacion == TipoString.LENGTH) {
            return { tipo: TipoString.LENGTH }
        } else if (this.operacion == TipoString.LOWER) {
            return { tipo: TipoString.LOWER }
        } else if (this.operacion == TipoString.UPPER) {
            return { tipo: TipoString.UPPER }
        } else if (this.operacion == TipoString.POP) {
            return { tipo: TipoString.POP }
        }
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