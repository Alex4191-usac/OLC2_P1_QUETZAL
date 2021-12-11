import { AST } from '../ast/AST';
import { Entorno } from '../ast/Entorno';
import { Tipo } from '../ast/Tipo';
import { Expresion } from '../interfaces/Expresion';

export enum OperadorA {
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    MOD,
    POW,
    UNARIO,
    CONCAT,
    POTENCIA,
    INCREMENTO,
    DECREMENTO
}
export class Aritmetica implements Expresion{
    fila: number;
    columna: number;
    public op1: Expresion;
    op2: Expresion;
    operador: OperadorA;

    constructor(op1: Expresion, op2: Expresion, operador: OperadorA, fila: number, columna: number) {
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

    public getValorImplicito(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        if (this.operador !== OperadorA.UNARIO && this.operador !== OperadorA.INCREMENTO && this.operador !== OperadorA.DECREMENTO) {
            let op1 = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
            let op2 = this.op2.getValorImplicito(ent, arbol, errores, imprimir);

            if (this.operador == OperadorA.SUMA) {
                if (typeof (op1) === "number" && typeof (op2) === "number") {
                    return op1 + op2;
                } else {
                    //Agregar un error semántico por incompatibilidad de tipos
                    return null;
                }
            } else if (this.operador == OperadorA.RESTA) {
                if (typeof (op1) === "number" && typeof (op2) === "number") {
                    return op1 - op2;
                } else {
                    //Agregar un error semántico por incompatibilidad de tipos
                    return null;
                }
            } else if (this.operador == OperadorA.MULTIPLICACION) {
                if (typeof (op1) === "number" && typeof (op2) === "number") {
                    return op1 * op2;
                } else {
                    //Agregar un error semántico por incompatibilidad de tipos
                    return null;
                }
            } else if (this.operador == OperadorA.DIVISION) {
                if (typeof (op1) === "number" && typeof (op2) === "number") {
                    return op1 / op2;
                } else {
                    //Agregar un error semántico por incompatibilidad de tipos
                    return null;
                }
            } else if (this.operador == OperadorA.MOD) {
                if (typeof (op1) === "number" && typeof (op2) === "number") {
                    return op1 % op2;
                } else {
                    //Agregar un error semántico por incompatibilidad de tipos
                    return null;
                }
            } else if (this.operador == OperadorA.POW) {
                if (typeof (op1) === "number" && typeof (op2) === "number") {
                    if (this.esEntero(op2)) {
                        return op1 ^ op2;
                    } else {
                        //Agregar error, el exponente no puede ser decimal.
                        return null;
                    }
                } else {
                    //Agregar un error semántico por incompatibilidad de tipos
                    return null;
                }
            } else if (this.operador == OperadorA.CONCAT) {
                return op1.toString() + op2.toString();
            } else if (this.operador == OperadorA.POTENCIA) {
                if (typeof (op1) === "string" && typeof (op2) === "number") {
                    if (this.esEntero(op2)) {
                        let a = "";
                        for (let i: number = 0; i < Number(op2); i++) {
                            a += op1;
                        }
                        return a;
                    } else {
                        //Agregar error, el exponente no puede ser decimal.
                        return null;
                    }
                } else {
                    //Agregar un error semántico por incompatibilidad de tipos
                    return null;
                }
            }
        } else {
            let op1 = this.op1.getValorImplicito(ent, arbol, errores, imprimir);
            if (this.operador == OperadorA.UNARIO) {
                if (typeof (op1) === "number") {
                    return -1 * op1;
                } else {
                    //Agregar error semantico, tipos de datos no compatibles
                    return null;
                }
            } else if (this.operador == OperadorA.INCREMENTO) {
                if (typeof (op1) === "number") {
                    return op1 + 1;
                } else if (typeof (op1) === "string") {
                    if (this.esChar(op1)) {
                        let a = (op1.charCodeAt(0) + 1).toString();
                        return a.charAt(0);
                    }
                } else {
                    //Agregar error semantico, tipo de dato incompatible
                }
            } else if (this.operador == OperadorA.DECREMENTO) {
                if (typeof (op1) === "number") {
                    return op1 - 1;
                } else if (typeof (op1) === "string") {
                    if (this.esChar(op1)) {
                        let a = (op1.charCodeAt(0) - 1).toString();
                        return a.charAt(0);
                    }
                } else {
                    //Agregar error semantico, tipo de dato incompatible
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

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }

}