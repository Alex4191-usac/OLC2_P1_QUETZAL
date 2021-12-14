export class Traduccion {

    header: string = "";
    codigo: string = "";
    contador: number = 0;
    PH: number = 0;
    PS: number = 0;
    punteroActual: number = 0;
    contadorEtiqueta: number = 0;
    temporalesUso: any = [];
    temporalesLibres: any = [];
    etiquetas: any = [];
    etiquetaContinue: string = "";
    etiquetaBreak: string = "";
    hayReturn: boolean = false;
    stackReturn: any = {};
    stacksustituto: any = null;
    listaFuncion: any = {};
    nombreFuncion: string = "";
    nombreFunciones: any = {};
    codigo3d: any = null;
    apuntador_return: string = "";
    activa: any = null;
    stackActivo: any = null;
    actual: string = "";

    constructor() {
        this.contador = 0;
        this.contadorEtiqueta = 0;
        this.header = "";
        this.codigo = "";
        this.PH = 0;
        this.PS = 0;
        this.punteroActual = 0;
        this.temporalesUso = [];
        this.temporalesLibres = [];
        this.etiquetas = [];
        this.codigo3d = null;
        //this.etiquetaVerdadera = "";
        //this.etiquetaFalsa = "";
        //this.codigoFuncion = "";
        //this.listaFuncion = {};
    }
}