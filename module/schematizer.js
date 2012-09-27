//TODO : Use a dictionnary to store models
//TODO : Send the right information to the server
//TODO : Create client-side model and server

var mongoose, async, Schema, ObjectId, Mixed,
    extracter;

mongoose = require('mongoose');
_ = require('underscore');
_.str = require('underscore.string');
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
Mixed = mongoose.Schema.Types.Mixed;

//Validation
function checkColor(value){
    "use strict";
    console.log(arguments);
    return true;
}

function checkDomain(value){
    "use strict";
    console.log(arguments);
    return true;
}

function checkSlug(value){
    "use strict";
    console.log(arguments);
    return true;
}

function checkEmail(value){
    "use strict";
    console.log(arguments);
    return true;
}

extracter = function extracter(model){
    "use strict";

    function loop(el){
        var schema = {};
        _.each(model,function(value, key, list){
            if(value.type){
                if(value.type === "array"){
                    schema[key] = [loop(value.object)];
                } else if(value.type === "string") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = String;
                    schema[key] = value;
                } else if(value.type === "color") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = String;
                    value.validate = checkColor;
                    schema[key] = value;
                } else if(value.type === "image") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = Buffer;
                    value.validate = checkColor;
                    schema[key] = value;
                } else if(value.type === "domain") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = String;
                    value.validate = checkDomain;
                    schema[key] = value;
                } else if(value.type === "onechoice") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = String;
                    if(value["list"]){
                        value.enum = value.list;
                        delete value["list"];
                    }
                    schema[key] = value;
                }  else if(value.type === "slug") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.validate = checkSlug;
                    value.type = String;
                    schema[key] = value;
                } else if(value.type === "mixed") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = Mixed;
                    schema[key] = value;
                } else if(value.type === "number") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = Number;
                    schema[key] = value;
                } else if(value.type === "email") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.validate = checkEmail;
                    value.type = String;
                    schema[key] = value;
                } else if(value.type === "date") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = Date;
                    schema[key] = value;
                } else if(value.type === "salt") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = String;
                    schema[key] = value;
                } else if(value.type === "hash") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    value.type = String;
                    schema[key] = value;
                } else if(value.type === "onelink") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    if(value.reference){
                        delete value.reference;
                    }
                    if(value.symetric){
                        delete value.symetric;
                    }
                    value.type = ObjectId;
                    schema[key] = value;
                } else if(value.type === "multimultilink") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    if(value.reference){
                        delete value.reference;
                    }
                    if(value.symetric){
                        delete value.symetric;
                    }
                    value.type = ObjectId;
                    schema[key] = [value];
                } else if(value.type === "onemultilink") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    if(value.reference){
                        delete value.reference;
                    }
                    if(value.symetric){
                        delete value.symetric;
                    }
                    value.type = ObjectId;
                    schema[key] = value;
                } else if(value.type === "multionelink") {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    if(value.reference){
                        delete value.reference;
                    }
                    if(value.symetric){
                        delete value.symetric;
                    }
                    value.type = ObjectId;
                    schema[key] = [value];
                } else {
                    if(value["scope"]){
                        delete value["scope"];
                    }
                    schema[key] = value;
                }
            } else {
                schema[key] = loop(value);
            }
            schema[key] = value;
        });
    }

    return loop(model);

};

var Schematizer = function Schematizer(userName,userPassword,IP,port,baseName,model){
    "use strict";
    if(!mongoose.connection){
        mongoose.createConnection('mongodb://' + userName + ":" + userPassword + "@" + IP + ":" + port + '/' + baseName);
    }

    if(model && model.name && !this[model.name]){

        var schema = new Schema(extracter(model.schema));

        this[model.name] = mongoose.model(model.name, schema);
    }

    return this;
};

module.exports = exports = Schematizer;