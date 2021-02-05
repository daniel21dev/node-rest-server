
const jwt = require('jsonwebtoken')

// ===================
//  Verificar token
// ===================
let verficaToken = ( req, res, next ) =>{

    let token = req.get('token'); //  llave del header

    jwt.verify( token, process.env.SEED, (err, decoded)=>{
        if( err ){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
    
};
// ======================
//  Verificar Admin role
// ======================

let verfificaAdmin_Role = (req,res,next) =>{

    let usuario = req.usuario;
    
    if( usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message: 'El usuario no es administrador'
            }
        })
    }
}

// ======================
//  Verificar Admin role
// ======================

verificaTokenImg = (req, res, next) =>{

    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded)=>{
        if( err ){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

module.exports = {
    verficaToken,
    verfificaAdmin_Role,
    verificaTokenImg
}














