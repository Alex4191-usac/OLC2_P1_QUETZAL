import {AST} from "../ast/AST"
import { Entorno } from "../ast/Entorno"
import { Instruccion } from "../interfaces/Instruccion" 
import { Expresion } from "../interfaces/Expresion"
import { Errores } from '../ast/Error';
import { Simbolo } from "../ast/Simbolo";
import { Tipo } from "../AST/Tipo";


export class Declaracion implements Instruccion {

    public tipo: Tipo;
    public identificador: string[];
    public valor: Expresion;
    fila: number;
    columna: number;
    esArreglo: boolean;

    constructor(tipo: Tipo, identificador: string[], valor: any, fila: number, columna: number, esArreglo: boolean = false) {
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
        this.esArreglo = esArreglo;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        this.identificador.forEach((id: string) => {
            if (!ent.existe(id)) {
                if (this.valor === null) {
                    const simbolo = new Simbolo(this.tipo, id, this.valorDefecto(), this.fila, this.columna);
                    ent.agregar(id, simbolo);
                } else {
                    if (this.tipo === this.valor.getTipo(ent, arbol, errores, imprimir)) {
                        const valor = this.valor.getValorImplicito(ent, arbol, errores, imprimir);
                        const simbolo = new Simbolo(this.tipo, id, valor, this.fila, this.columna);
                        ent.agregar(id, simbolo);
                    } else {
                        errores.push(new Errores("Semántico", "El valor no coincide con el tipo de la variable", this.fila, this.columna, ""));
                        imprimir.push("\n>>Error semántico en linea " + this.fila + ", El valor no coincide con el tipo de la variable\n");
                    }
                }
            } else {
                errores.push(new Errores("Semántico", "La variable " + id + " ya existe en el entorno actual", this.fila, this.columna, ""));
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", La variable " + id + " ya existe en el entorno actual\n");
            }
        });
    }

    private valorDefecto() {
        if (this.tipo == Tipo.INT) {
            return 0;
        } else if (this.tipo == Tipo.DOUBLE) {
            return 0.0;
        } else if (this.tipo == Tipo.STRING) {
            return "";
        } else if (this.tipo == Tipo.CHAR) {
            return "''";
        } else if (this.tipo == Tipo.BOOLEAN) {
            return false;
        } else {
            return null;
        }
    }

    traducir(ent: Entorno, arbol: AST) {
        throw new Error("Method not implemented.");
    }
}