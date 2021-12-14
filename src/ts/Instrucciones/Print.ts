import { AST } from '../ast/AST';
import { Entorno } from '../ast/Entorno';
import {Errores} from '../ast/Error';
import {Expresion} from '../interfaces/Expresion';
import {Instruccion} from '../interfaces/Instruccion';
import { Traduccion } from '../ast/Traduccion';
import { Acceso } from '../expresiones/Acceso';



export class Print implements Instruccion {

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
            let valor = element.getValorImplicito(ent, arbol, errores, imprimir);
            if (valor !== null) {
                if (typeof (valor) === "string") {
                    if (valor.includes("$")) {
                        let aux: any[] = valor.split(" ");
                        let cad = "";
                        for (let i: number = 0; i < aux.length; i++) {
                            if (aux[i].includes("$")) {
                                let id = aux[i].replace("$", "");
                                let vari = new Acceso(id, this.fila, this.columna);
                                let v = vari.getValorImplicito(ent, arbol, errores, imprimir);
                                aux[i] = v;
                            }
                            cad += aux[i] + " ";
                        }
                        valor = cad;
                    }
                }
                imprimir.push(valor);
                console.log(valor);
            } else {
                let er = new Errores("Semántico", "No es posible imprimir valores nulos", this.fila, this.columna, "");
                errores.push(er);
                imprimir.push("\n>>Error semántico en linea " + this.fila + ", No es posible imprimir valores nulos\n");
                return er;
            }
        });
        if (this.salto) {
            imprimir.push("\n");
        }
    }

    traducir(ent: Entorno, arbol: AST, trad: Traduccion) {
        throw new Error("Method not implemented.");
    }
}