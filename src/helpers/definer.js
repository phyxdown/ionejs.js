var creator = require('./creator');

var Definer = function(){};
var p = Definer.prototype;

p.define = function(options, superConstruct, alias){
    var fields = {};
    var methods = {};

    for (var i in options) {
        if (typeof options[i] == 'function') 
            methods[i] = options[i];
        else
            fields[i] = options[i];
    }

    var construct = function() {
        if (superConstruct != undefined)
            superConstruct.apply(this, arguments);
        var I = this;
        for (var i in fields) {
            I[i] = fields[i];
        }
    }
    construct._super = superConstruct;
    var p = construct.prototype = Object.create(superConstruct.prototype, {
        constructor: {
            value: construct,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    for (var i in methods) {
        p[i] = methods[i];
    }
    if (alias != undefined)
        creator.Ones[alias] = construct;
    return construct;
};

module.exports = new Definer();
