import { AST } from '../ast/AST';
import { Entorno } from '../ast/Entorno';
import {Errores} from '../ast/Error';
import {Expresion} from '../interfaces/Expresion';
import {Instruccion} from '../interfaces/Instruccion';

export class Print implements Instruccion{
    
    public expresiones: Expresion[];
    fila: number;
    columna: number;
    salto: boolean;
    constructor(expresiones: Expresion[], fila: number, columna: number, salto: boolean = false) {
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
        this.salto = salto;
    }

    ejecutar(ent: Entorno, arbol: AST, errores: any, imprimir: any) {
        this.expresiones.forEach((element: Expresion) => {
            const valor = element.getValorImplicito(ent, arbol);
            if (valor !== null) {
                imprimir.push(valor + " ");
                console.log('Imprimiendo supuestamente: ', valor);
            } else {
                errores.push(new Errores("Semántico", "No es posible imprimir valores nulos", this.fila, this.columna, ""));
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible imprimir valores nulos\n");
            }
            if (this.salto) {
                imprimir.push("\n");
            }
        });
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error('Method not implemented.');
    }
    
}