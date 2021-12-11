import {AST} from '../ast/AST';
import {Entorno} from '../ast/Entorno';
import {Expresion} from './Expresion';
export interface Condicional {
    // Condicion
    condicion: Expresion;
    siVerdadero: string;
    siFalso: string;

    ejecutar(ent: Entorno, arbol: AST , errores: any, imprimir: any): any;
    traducir(ent: Entorno, arbol: AST): any;
}