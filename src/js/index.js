const parser = require('../../Gramatica/gramatica');

var tabIndex = 2;
let File_Js = "";

function openEditorTab(evt, tabName) {

    var i, tabcontent, tabBtns;

    tabcontent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tabBtns = document.getElementsByClassName("tabBtn");
    for (i = 0; i < tabBtns.length; i++) {
        tabBtns[i].style.backgroundColor = "";
        tabBtns[i].className = tabBtns[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

}




function addTab() {

    //Contenido de Tab
    var newTab = document.createElement("div");
    newTab.id = "tab" + tabIndex;
    newTab.className = "tabContent";
    document.getElementById("myTabPage").appendChild(newTab);

    var newTxtArea = document.createElement("textarea");
    newTxtArea.id = "txtArea" + tabIndex;
    newTxtArea.rows = 20;
    newTab.appendChild(newTxtArea);


    //Boton de Tab
    var newItem = document.createElement("li");
    newItem.className = "nav-item"

    var newTabButton = document.createElement("a");
    newTabButton.className = "tabBtn nav-link ";
    newTabButton.id = tabIndex;
    newTabButton.innerHTML = "Tab" + tabIndex;
    newTabButton.onclick = function() { openEditorTab(event, "tab" + this.id) };
    newItem.appendChild(newTabButton);

    document.getElementById("tabPageBtns").appendChild(newItem);

    tabIndex++;
}



/*OPEN FILE CHOOSER */

function openArchive(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result;
        showText(contenido);
    };
    lector.readAsText(archivo);
}

function showText(contenido) {
    var indice = document.getElementsByClassName("nav-link active tabBtn")
    var txtCSharp = document.getElementById("txtArea" + indice[0].id)
    console.log(contenido);
    txtCSharp.innerHTML = contenido;
}

function llamar() {
    let indices = document.getElementsByClassName("nav-link active tabBtn");
    let txts = document.getElementById("txtArea" + indices[0].id);
    let javaFile = txts.value;


    fetch('../getDataInfo', {
            method: 'POST',
            body: JSON.stringify({ "Nombre": javaFile }),
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log(response));

}

function interpretar() {
    let indice = document.getElementsByClassName("nav-link active tabBtn")
    let TxtCSharp = document.getElementById("txtArea" + indice[0].id)
    let curso = TxtCSharp.value;
    console.log(curso);
    let salida = parser.parse(curso);
    console.log(salida);
}


function obtenerSaludo() {

    //llamada a la funcion limpiar
    clean_area();

    let indice = document.getElementsByClassName("nav-link active tabBtn")
    let TxtCSharp = document.getElementById("txtArea" + indice[0].id)
    let curso = TxtCSharp.value;
    llamar();

    fetch('../getInfo', {
            method: 'POST',
            body: JSON.stringify({ "Nombre": curso }),
            headers: {
                'Content-Type': 'application/json'
            }

        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => view(response));




}





function view(response) {

    d3.select(document.getElementById("graph")).graphviz()
        .renderDot('digraph  {' + response.Saludo + '}');

    TokenReport(response.Saludo2);
    add_errorJison(response.ListaErrores);

    File_Js = response.Traduccion_Jison;


}

function TokenReport(TokenObject) {
    let obj_t = JSON.parse(TokenObject);
    let NewRow;
    let NewColumn;

    for (tk in obj_t.tokens) {

        NewRow = document.createElement("tr");

        NewColumn = document.createElement("th");
        NewColumn.innerHTML = tk;
        NewRow.appendChild(NewColumn);

        NewColumn = document.createElement("td");
        NewColumn.innerHTML = obj_t.tokens[tk].fila;
        NewRow.appendChild(NewColumn);

        NewColumn = document.createElement("td");
        NewColumn.innerHTML = obj_t.tokens[tk].columna;
        NewRow.appendChild(NewColumn);

        NewColumn = document.createElement("td");
        NewColumn.innerHTML = `"` + obj_t.tokens[tk].lexema + `"`;
        NewRow.appendChild(NewColumn);

        NewColumn = document.createElement("td");
        NewColumn.innerHTML = obj_t.tokens[tk].tipo;
        NewRow.appendChild(NewColumn);

        NewColumn = document.createElement("td");
        NewColumn.innerHTML = obj_t.tokens[tk].correlativo;
        NewRow.appendChild(NewColumn);

        document.getElementById("token_display").appendChild(NewRow);
        document.getElementById("token_display_Python").appendChild(NewRow);

    }

}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}



function add_errorJison(table_errors) {
    var txtCSharp = document.getElementById("errors_jison");
    let errores_aux = "";
    if (table_errors != undefined) {

        for (const iterator of table_errors) {
            errores_aux += iterator + "\n";
        }
        txtCSharp.innerHTML = errores_aux.toString();
    } else {
        txtCSharp.innerHTML = "NO SE ENCONTRARON ERRORES";
    }
}




function clean_area() {
    //cleans the actual String file

    File_Js = "";

    //remover listado de tokens JISON
    removeAllChildNodes(document.querySelector('#token_display'));
    removeAllChildNodes(document.querySelector('#token_display_Python'));



    //remover data de los errores JISON
    let txtJison = document.getElementById("errors_jison");
    txtJison.innerHTML = "";

    //remove data de los errores PYTHON

    let txtPython = document.getElementById("erroes_Python");
    txtPython.innerHTML = "";
}


function saveData() {

    var saveData = (function() {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function() {
            var blob = new File([File_Js], "Traduccion.js");
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = blob.name;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());
    saveData();
}