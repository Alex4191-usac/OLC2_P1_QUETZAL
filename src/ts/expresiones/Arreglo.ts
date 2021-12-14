import { Expresion } from "../interfaces/Expresion";
import { AST } from "../ast/AST";
import { Entorno } from "../ast/Entorno";
import { Tipo } from "../AST/Tipo"; 
import { Traduccion } from "../ast/Traduccion";
export class Arreglo implements Expresion {

    expresion: Expresion[];
    fila: number;
    columna: number;

    constructor(expresion: Expresion[], fila: number, columna: number) {
        this.expresion = expresion;
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
        let aux: any = [];
        this.expresion.forEach(ele => {
            aux.push(ele.getValorImplicito(ent, arbol, errores, imprimir));
        });
        return aux;
    }

    obtenerTipo(n: any) {
        if (typeof (n) === "number") {
            if (this.esEntero(n)) {
                return Tipo.INT
            }
            return Tipo.DOUBLE
        } else if (typeof (n) === "string") {
            if (this.esChar(n)) {
                return Tipo.CHAR
            }
            return Tipo.STRING
        } else if (typeof (n) === "boolean") {
            return Tipo.BOOLEAN
        }
        return Tipo.VOID
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