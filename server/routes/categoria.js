
const express = require('express');
const Categoria = require('../models/categoria');
let { verficaToken, verfificaAdmin_Role } = require('../middlewares/authenticacion');
const _ = require('underscore');
let app = express();


app.get('/categoria',verficaToken,(req,res)=>{

    Categoria.find({})
        .sort('nombre')
        .populate('usuario','nombre email')
        .exec((err,categoriasDB)=>{
            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok: true,
                categorias: categoriasDB
            })
        });
});

app.get('/categoria/:id',verficaToken,(req,res)=>{

    const id = req.params.id;

    Categoria.findById(id,(err,categoriaDB)=>{
        if( err ){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});


app.post('/categoria',verficaToken,(req,res)=>{
    const usuarioID = req.usuario._id
    const {nombre} = req.body;

    const categoria = new Categoria({
        nombre,
        usuario: usuarioID
    });
    
    categoria.save((err,categoriaDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id',verficaToken,(req,res)=>{

    const id = req.params.id;
    const body = _.pick( req.body, ['nombre'] );

    Categoria.findByIdAndUpdate(id,body ,{new: true},(err,categoriaDB)=>{
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Categoria no existe'
                }
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        })
    })

});

app.delete('/categoria/:id',[verficaToken, verfificaAdmin_Role],(req,res)=>{

    const id = req.params.id;

    Categoria.findByIdAndRemove(id,(err,categoriaBorrada)=>{
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if( !categoriaBorrada ){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoriaBorrada
        })
    })
});


module.exports = app;