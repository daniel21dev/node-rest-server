const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true,'debe de llevar el nombre'],
        unique: true
    },     
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    } 

});

module.exports = mongoose.model('Categoria',categoriaSchema);