require('./config/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path  = require('path')
// middlewares  nota: todas las peticiones pasan por los middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// importacion de los endpoints
app.use( require('./routes/index'));

// habilitar la carpeta public
app.use( express.static( path.resolve(__dirname,'./public') ) );
// configuracion mongoose ( para que no de advertencias )
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
// en la url <mongodb:> es el protocolo
// esta es la conexión a la base de datos 
mongoose.connect(process.env.URLDB,(err, res)=>{
    if( err ) throw err;
    console.log(`Base de datos ONLINE`);
});
// listener escuchando las peticiones
app.listen(process.env.PORT,()=>{
    console.log('escuchando puerto: ', process.env.PORT);
})





