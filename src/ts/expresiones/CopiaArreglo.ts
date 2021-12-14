import { Expresion } from "../interfaces/Expresion";
import { AST } from "../ast/AST";
import { Entorno } from "../ast/Entorno";
import { Tipo } from "../AST/Tipo"; 
import { Traduccion } from "../ast/Traduccion";
import { Errores } from "../ast/Error";

export class CopiaArreglo implements Expresion {
    fila: number;
    columna: number;
    id: Expresion;

    constructor(id: Expresion, fila: number, columna: number) {
        this.id = id;
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
        var arr = this.id.getValorImplicito(ent, arbol, errores, imprimir);
        if (typeof (arr) === "object") {
            let ca: any[] = [];
            arr.forEach((element: any) => {
                ca.push(element);
            });
            return ca;
        } else {
            let er = new Errores("Semántico", "No se está recibiendo un arreglo", this.fila, this.columna, ent.nombre);
            errores.push(er);
            imprimir.push("\n>>Error semántico en linea " + this.fila + ", No se está recibiendo un arreglo\n");
            return null
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