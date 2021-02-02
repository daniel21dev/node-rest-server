const express = require('express');
const _ = require('underscore');
const {verficaToken } = require('../middlewares/authenticacion');

let app = express();
let Producto = require('../models/producto');

// obtener todos los productos
app.get('/productos',verficaToken, (req,res)=>{
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number( desde );

    let limite = req.query.limite || 5;
    limite = Number( limite );

    Producto.find({disponible: true})
            .populate('usuario','nombre email')
            .populate('categoria','nombre')
            .skip( desde )
            .limit( limite )
            .exec((err, productosDB)=>{
                if( err ){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                if( !productosDB ){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    productos: productosDB,
                    cuantos: productosDB.length
                });
            })

});

app.get('/productos/:id', verficaToken, (req,res)=>{
    // populate: usuario categoria
    const id = req.params.id;
    Producto.findById(id,{disponible: true})
            .populate('usuario','nombre email')
            .populate('categoria','nombre')
            .exec((err, productoDB)=>{
                if( err ){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                if( !productoDB ){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    productos: productoDB
                });
            })
    
});

// buscar productos
app.get('/productos/buscar/:termino', verficaToken,(req,res)=>{

    let termino = req.params.termino;
    console.info( termino );
    let regex = new RegExp(termino,'i');

    Producto.find({ nombre: regex })
        .populate('categoria','nombre')
        .exec((err,productosDB)=>{
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if( !productosDB ){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productosDB
            });
        })
});

app.post('/productos',verficaToken, (req,res)=>{
    // grabar el usuario
    // grabar una categoria del listado
    const usuario = req.usuario._id;
    const {nombre,precioUni,descripcion,disponible,categoria} = req.body;

    const producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario
    });

    producto.save((err,productoDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

    
});

app.put('/productos/:id', verficaToken, (req,res)=>{
    // grabar el usuario
    // grabar una categoria del listado
    const id = req.params.id;
    let body = _.pick( req.body, ['nombre','precioUni','descripcion','categoria','disponible'] );
    Producto.findByIdAndUpdate(id,body,{new: true},(err,productoDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.delete('/productos/:id', verficaToken, (req,res)=>{
    // poner disponible en falso
    const id = req.params.id;
    let disponible = false;
    Producto.findByIdAndUpdate(id,{disponible},{new: true},(err,productoDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if( !productoDB ){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

    
});

module.exports = app;