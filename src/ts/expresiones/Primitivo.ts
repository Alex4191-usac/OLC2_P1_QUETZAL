import { AST } from '../ast/AST';
import { Entorno } from '../ast/Entorno';
import { Tipo } from '../ast/Tipo';
import { Expresion } from '../interfaces/Expresion';

export class Primitivo implements Expresion{
    fila: number;
    columna: number;
    valor:any;


    constructor(valor:any, fila:number, columna:number){
        this.fila = fila;
        this.columna = columna;
        this.valor = valor;
    }

    getTipo(ent: Entorno, arbol: AST): Tipo {
        const valor = this.getValorImplicito(ent, arbol);
        if (typeof(valor) === 'boolean')
        {
            return Tipo.BOOL;
        }
        else if (typeof(valor) === 'string')
        {
            return Tipo.STRING;
        }
        else if (typeof(valor) === 'number')
        {
            if(this.isInt(Number(valor))){
                return Tipo.INT;
            }
           return Tipo.DOUBLE;
        }
        else if(valor === null){
            return Tipo.NULL;
        }
            
        return Tipo.VOID;
    }

    isInt(n:number){
        return Number(n) === n && n % 1 === 0;
    }

    getValorImplicito(ent: Entorno, arbol: AST) {
        return this.valor;
    }
    traducir(ent: Entorno, arbol: AST) {
        throw new Error('Method not implemented.');
    }
    

}