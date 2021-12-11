%{
    const {Aritmetica, OperadorA} = require('../ts/expresiones/Aritmetica.ts')
    const {Tipo} = require('../ts/ast/Tipo.ts')
    const {Print} = require('../ts/Instrucciones/Print.ts')
   
    const {Primitivo} = require('../ts/expresiones/Primitivo.ts')
    const { Relacional, OperadorRelacional } = require('../dist/expresiones/Relacional');
     let ListaE = [];
     let cadenaE = [];
%}
%lex

%options case-sensitive

%%

//comentarios
("/""/".*\r\n)|("/""/".*\n)|("/""/".*\r)    /*Se ignoran comentarios simples*/
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]         /*Se ignoran comentarios multiples*/


//Simbolos
"." return 'PUNTO';
"," return 'COMA';
";" return 'PUNTOYCOMA';
"{" return 'LLAVEIZQ';
"}" return 'LLAVEDER';
"(" return 'PARIZQ';
")" return 'PARDER';
"[" return 'CORIZQ';
"]" return 'CORDER';
"++" return 'MASMAS';
"--" return 'MENOSMENOS';
"+" return 'MAS';
"-" return 'MENOS';
"*" return 'POR';
"/" return 'DIV';
"%" return 'MOD';
"==" return 'IGUALIGUAL';
"=" return 'IGUAL';
"!=" return 'NOIGUAL';
">=" return 'MAYORIGUAL';
"<=" return 'MENORIGUAL';
">" return 'MAYORQUE';
"<" return 'MENORQUE';
"&&" return 'AND';
"||" return 'OR';
"!" return 'NOT';
"&" return 'CONCAT';
"^" return 'POTENCIA';
"?" return 'TERNARIO';
":" return 'DOSPUNTOS';
"$" return 'DOLAR';
"#" return 'HASHTAG';

//Palabras Reservadas
"null" return 'RNULL';
"true" return 'RTRUE';
"false" return 'RFALSE';
"int" return 'RINT';
"double" return 'RDOUBLE';
"boolean" return 'RBOOLEAN';
"char" return 'RCHAR';
"String" return 'RSTRING';
"struct" return 'RSTRUCT';
"void" return 'RVOID';
"pow" return 'RPOW';
"sqrt" return 'RSQRT';
"sin" return 'RSIN';
"cos" return 'RCOS';
"tan" return 'RTAN';
"log10" return 'RLOG10';
"caracterOfPosition" return 'RCARACTEROFPOSITION';
"subString" return 'RSUBSTRING';
"length" return 'RLENGTH';
"toUppercase" return 'RTOUPPER';
"toLowercase" return 'RTOLOWER';
"println" return 'RPRINTLN';
"print" return 'RPRINT';
"parse" return 'RPARSE';
"toInt" return 'RTOINT';
"toDouble" return 'RTODOUBLE';
"string" return 'RSTRINGMIN';
"typeof" return 'RTYPEOF';
"function" return 'RFUNCTION';
"return" return 'RRETURN';
"if" return 'RIF';
"else" return 'RELSE';
"switch" return 'RSWITCH';
"case" return 'RCASE';
"break" return 'RBREAK';
"continue" return 'RCONTINUE';
"default" return 'RDEFAULT';
"while" return 'RWHILE';
"do" return 'RDO';
"for" return 'RFOR';
"in" return 'RIN';
"begin" return 'RBEGIN';
"end" return 'REND';
"push" return 'RPUSH';
"pop" return 'RPOP';
"main" return 'RMAIN';

//ERs

[ \n\r\t]+                          /*Se ignoran espacios en blanco*/
[\"]([^\"\n]|(\\\")|(\\\'))*[\"]    %{ return 'CADENA'; %}
[\'][^\'\n][\']                     %{ return 'CARACTER'; %}
[0-9]+[.][0-9]+                 %{ return 'DECIMAL'; %}
[0-9]+                          %{ return 'ENTERO'; %}
[a-zA-Z"_"]+["_"0-9A-Za-z]*         %{ return 'IDENTIFICADOR'; %}

<<EOF>>                             return 'EOF';

. { console.error("Error lexico: " + yytext + ", en linea: " + yylloc.first_line + ", y columna: " + yylloc.first_column + "\n"); }

/lex
%{
%}
//Precedencia de Operadores
%left 'OR'
%left 'AND'
%left 'MENORQUE' 'MENORIGUAL' 'MAYORQUE' 'MAYORIGUAL' 'IGUALIGUAL' 'NOIGUAL'
%left 'MAS' 'MENOS'
%left 'POR' 'DIV' 'MOD'
%left 'RPOW' 'RSQRT'
%left 'NOT'
%right UMINUS
%left 'PARIZQ' 'PARDER'

//Produccion inicial
%start inicio

%%
inicio : lista_bloques EOF { $$ = $1; return {arbol: $$, lista: ListaE, texto: cadenaE};  };

lista_bloques
    : lista_bloques bloque { $1.push($2); $$ = $1;}
    | bloque { $$ = [$1]; }
;
bloque
    : asignacion { $$ = $1; }
    | declaracion { $$ = $1; }
    | structs { $$ = $1; }
    | funciones { $$ = $1; }
    | metodos{ $$ = $1; }
    | instruccion { $$ = $1;}
;
instrucciones
    : instrucciones instruccion { $1.push($2);$$=$1; }//lista reecursiva 
    | instruccion { $$ = [$1]; }
;
instruccion
    : imprimir { $$ = $1; }
    | declaracion { $$ = $1; } //ya
    | asignacion { $$ = $1; } //ya
    | if  { $$ = $1; }// ya
    | switch { $$ = $1; }//ya
    | while { $$ = $1; }//ya
    | do_while { $$ = $1; }//ya
    | for { $$ = $1; }
    | RBREAK PUNTOYCOMA
    | RCONTINUE PUNTOYCOMA
    | RRETURN PUNTOYCOMA
    | RRETURN expresion PUNTOYCOMA
    | expresion MASMAS PUNTOYCOMA 
    | expresion MENOSMENOS PUNTOYCOMA
    | IDENTIFICADOR PUNTO opciones_string PUNTOYCOMA
    | llamada PUNTOYCOMA
;

for
    : RFOR PARIZQ PARDER
;


do_while
    : RDO LLAVEIZQ instrucciones LLAVEDER RWHILE PARIZQ expresion PARDER PUNTOYCOMA
;

while
    :RWHILE PARIZQ expresion PARDER LLAVEIZQ instrucciones LLAVEDER
;

switch 
    : RSWITCH PARIZQ expresion PARDER LLAVEIZQ cases LLAVEDER
;

cases
    : cases case  
    | case
;

case
    : RCASE expresion DOSPUNTOS instrucciones 
    | RCASE expresion DOSPUNTOS instrucciones
    | RCASE RDEFAULT DOSPUNTOS instrucciones
    | RCASE RDEFAULT DOSPUNTOS
;


if
 : RIF PARIZQ expresion PARDER LLAVEIZQ instrucciones LLAVEDER
 | RIF PARIZQ expresion PARDER LLAVEIZQ instrucciones LLAVEDER else 
 | RIF PARIZQ expresion PARDER LLAVEIZQ LLAVEDER
 | RIF PARIZQ expresion PARDER LLAVEIZQ LLAVEDER else 
 | RIF PARIZQ expresion PARDER instrucciones
 | RIF PARIZQ expresion PARDER instrucciones else 
 | RIF PARIZQ expresion PARDER
 | RIF PARIZQ expresion PARDER else 
;

else 
    : RELSE LLAVEIZQ instrucciones LLAVEDER
    | RELSE LLAVEIZQ LLAVEDER
    | RELSE RIF
    | RELSE instrucciones
;

imprimir
    : RPRINT PARIZQ args PARDER PUNTOYCOMA { $$ = new Print($3, this._$.first_line, this._$.first_column); }
    | RPRINTLN PARIZQ args PARDER PUNTOYCOMA
;

funciones // int edad(int calculo1, int calculo2).....
    : tipo_dato IDENTIFICADOR PARIZQ parametros PARDER LLAVEIZQ instrucciones LLAVEDER
    | tipo_dato IDENTIFICADOR PARIZQ PARDER LLAVEIZQ instrucciones LLAVEDER
    | tipo_dato IDENTIFICADOR PARIZQ parametros PARDER LLAVEIZQ LLAVEDER
    | tipo_dato IDENTIFICADOR PARIZQ  PARDER LLAVEIZQ LLAVEDER
;


parametros
    : lista_parametros COMA params
    | params
;

params 
    : tipo_dato IDENTIFICADOR
;
asignacion
    : IDENTIFICADOR IGUAL expresion PUNTOYCOMA
     | IDENTIFICADOR PUNTO IDENTIFICADOR IGUAL expresion PUNTOYCOMA
;

declaracion
    : tipo_dato declaracion_varia PUNTOYCOMA
    | tipo_dato IDENTIFICADOR IGUAL expresion PUNTOYCOMA
    | tipo_dato CORIZQ CORDER declaracion_varia PUNTOYCOMA
    | tipo_dato CORIZQ CORDER IDENTIFICADOR IGUAL expresion PUNTOYCOMA
;

declaracion_varia
    : declaracion_varia COMMA dec
    | dec
;
dec
 : tipo_dato IDENTIFICADOR
;


structs
    : RSTRUCT IDENTIFICADOR LLAVEIZQ atribs LLAVEDER PUNTOYCOMA
;

atribs
    : atribs COMA tipo_dato IDENTIFICADOR
    | tipo_dato IDENTIFICADOR
    | atribs COMA IDENTIFICADOR IDENTIFICADOR
    | IDENTIFICADOR IDENTIFICADOR
;
tipo_dato
    : RINT {$$= Tipo.INT;}
    | RDOUBLE {$$=Tipo.DOUBLE;}
    | RBOOLEAN {$$=Tipo.BOOLEAN;}
    | RSTRING {$$=Tipo.STRING;}
    | RCHAR {$$=Tipo.CHAR;}
    | RVOID{$$=Tipo.VOID;}
;      

expresion
    : CADENA
    | expresion MAS expresion { $$ = new Aritmetica($1, $3, OperadorA.SUMA, this._$.first_line, this._$.first_column ); }
    | expresion MENOS expresion { $$ = new Aritmetica($1, $3, OperadorA.RESTA, this._$.first_line, this._$.first_column ); }
    | expresion POR expresion { $$ = new Aritmetica($1, $3, OperadorA.MULTIPLICACION, this._$.first_line, this._$.first_column ); }
    | expresion DIV expresion { $$ = new Aritmetica($1, $3, OperadorA.DIVISION, this._$.first_line, this._$.first_column ); }
    | expresion MOD expresion { $$ = new Aritmetica($1, $3, OperadorA.MOD, this._$.first_line, this._$.first_column ); }
    | expresion MENORIGUAL expresion
    | expresion MENORQUE expresion
    | expresion MAYORIGUAL expresion
    | expresion MAYORQUE expresion
    | expresion NOIGUAL expresion
    | expresion IGUALIGUAL expresion
    | expresion AND expresion
    | expresion OR expresion
    | NOT expresion
    | MENOS expresion %prec UMINUS { $$ = new Aritmetica($2, null, OperadorA.UNARIO, this._$.first_line, this._$.first_column ); } 
    | expresion CONCAT expresion { $$ = new Aritmetica($1, $3, OperadorA.CONCAT, this._$.first_line, this._$.first_column ); }
    | expresion POTENCIA expresion { $$ = new Aritmetica($1, $3, OperadorA.POTENCIA, this._$.first_line, this._$.first_column ); }
    | PARIZQ expresion PARDER
    | RPOW PARIZQ expresion COMA expresion PARDER { $$ = new Aritmetica($1, $5, OperadorA.POW, this._$.first_line, this._$.first_column ); }
    | RSQRT PARIZQ expresion PARDER
    | RSIN PARIZQ expresion PARDER
    | RCOS PARIZQ expresion PARDER
    | RTAN PARIZQ expresion PARDER
    | RLOG10 PARIZQ expresion PARDER
    | expresion TERNARIO expresion dospuntos expresion
    | IDENTIFICADOR PUNTO opciones_string // voy aquiii
    | llamada 
    | expresion MASMAS
    | expresion MENOSMENOS
    | tipo_dato PUNTO RPARSE PARIZQ expresion PARDER
    | RTOINT PARDER expresion PARIZQ
    | RTODOUBLE PARDER expresion PARIZQ
    | RSTRINGMIN PARDER expresion PARIZQ
    | RTYPEOF PARDER expresion PARIZQ
    | expresion CORIZQ expresion DOSPUNTOS expresion CORDER
    | CORIZQ expresion DOSPUNTOS expresion CORDER
    | HASHTAG IDENTIFICADOR
    | IDENTIFICADOR HASHTAG
    | RPOW HASHTAG PARIZQ expresion COMA expresion PARDER
    | RSQRT HASHTAG PARIZQ expresion PARDER
    | RSIN HASHTAG PARIZQ expresion PARDER
    | RCOS HASHTAG PARIZQ expresion PARDER
    | RTAN HASHTAG PARIZQ expresion PARDER
    | RLOG10 HASHTAG PARIZQ expresion PARDER
    | IDENTIFICADOR PUNTO IDENTIFICADOR
    | ENTERO  { $$ = new Primitivo(Number($1), @1.first_line, @1.first_column); }
    | DECIMAL  { $$ = new Primitivo(Number($1), @1.first_line, @1.first_column); }
    | CADENA   { $$ = new Primitivo($1, @1.first_line, @1.first_column); }
    | CARACTER  { $$ = new Primitivo($1, @1.first_line, @1.first_column); }
    | RTRUE  { $$ = new Primitivo(true, @1.first_line, @1.first_column); }
    | RFALSE  { $$ = new Primitivo(false, @1.first_line, @1.first_column); }
    | RNULL  { $$ = new Primitivo(null, @1.first_line, @1.first_column); }
    | IDENTIFICADOR
    | RBEGIN {$$=$1;}
    | REND {$$=$1;}
    
;

opciones_string
    : RCARACTEROFPOSITION PARIZQ expresion PARDER
    | RSUBSTRING PARIZQ expresion COMA expresion PARDER
    | RLENGTH PARIZQ PARDER
    | RTOUPPER PARIZQ PARDER
    | RTOLOWER PARIZQ PARDER
    | RPUSH PARIZQ expresion PARDER
    | RPOP PARIZQ PARDER
;

llamada
    : IDENTIFICADOR PARIZQ args PARDER
    | IDENTIFICADOR PARIZQ PARDER
;

args
    : args COMA expresion
    | expresion
;