let fs = require('fs');
let parser = require('./gramatica');

fs.readFile('.URL', (err, data) => {

    if (err) {
        throw err
    }

    console.log(data.toString());
    parser.parse(data.toString());

})