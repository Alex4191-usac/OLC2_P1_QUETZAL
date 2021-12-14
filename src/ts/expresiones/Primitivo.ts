import { AST } from '../ast/AST';
import { Entorno } from '../ast/Entorno';
import { Tipo } from '../ast/Tipo';
import { Expresion } from '../interfaces/Expresion';
import { Traduccion } from '../ast/Traduccion';



export class Primitivo implements Expresion {
    fila: number;
    columna: number;
    valor: any;

    constructor(valor: any, fila: number, columna: number) {
        this.fila = fila;
        this.columna = columna;
        this.valor = valor;
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
        if (typeof (this.valor) === "string") {
            if (!this.esChar(this.valor)) {
                let letra = Array.from(this.valor)
                let opaux = ""
                if (letra[0] == "\"" && letra[letra.length - 1] == "\"") {
                    for (let i: number = 1; i < letra.length - 1; i++) {
                        opaux += letra[i];
                    }
                    this.valor = opaux;
                }
            } else {
                this.valor.replace("'", "");
            }
        }
        return this.valor;
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