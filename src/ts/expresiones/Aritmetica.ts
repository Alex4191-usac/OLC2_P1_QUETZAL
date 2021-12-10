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
    op1: Expresion;
    op2: Expresion;
    operador: OperadorA;
    getTipo(ent: Entorno, arbol: AST): Tipo {
        throw new Error('Method not implemented.');
    }
    getValorImplicito(ent: Entorno, arbol: AST) {
        throw new Error('Method not implemented.');
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error('Method not implemented.');
    }
    
}