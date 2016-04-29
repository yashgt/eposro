var page = require('webpage').create();
fs = require('fs');
var lazy = require("lazy")
new lazy(fs.createReadStream('raw_gs1_pdts.txt'))
     .lines
     .forEach(function(line){
         console.log(line.toString());
     }
);