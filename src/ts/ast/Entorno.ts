import {Simbolo} from './Simbolo';


export class Entorno {

    private anterior: Entorno;
    private tabla: { [id: string]: Simbolo };
    public nombre: string;

    constructor(anterior: any, nombre: string) {
        this.tabla = {};
        this.anterior = anterior;
        this.nombre = nombre
    }

    agregar(id: string, simbolo: Simbolo) {
        this.tabla[id] = simbolo;
    }

    eliminar(id: string): boolean {
        for (let e: Entorno = this; e != null; e = e.anterior) {
            const value = e.tabla[id]
            if (value !== undefined) {
                delete e.tabla[id];
                return true;
            }
        }
        return false;
    }

    existe(id: string): boolean {
        for (let e: Entorno = this; e != null; e = e.anterior) {
            const value = e.tabla[id]
            if (value !== undefined) {
                return true;
            }
        }
        return false;
    }

    existeEnActual(id: string): boolean {
        if (this.tabla[id] !== undefined) {
            return true;
        }
        return false;
    }

    getSimbolo(id: string): any {
        for (let e: Entorno = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    }

    reemplazar(id: string, nuevoValor: Simbolo) {
        for (let e: Entorno = this; e != null; e = e.anterior) {
            const value = e.tabla[id]
            if (value !== undefined) {
                e.tabla[id] = nuevoValor;
            }
        }
    }

    getEntorno(nombre: string, actual: Entorno) {
        for (let e: Entorno = this; e != null; e = e.anterior) {
            if (e.nombre === nombre) {
                return e;
            }
        }
        return null;
    }

    getFuncion(id: any): any {
        for (let e: Entorno = this; e != null; e = e.anterior) {
            if (e.tabla[id] !== undefined) {
                return e.tabla[id];
            }
        }
        return null;
    }

}