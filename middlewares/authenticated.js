'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave-secreta-para-generar-el-token-1234567890";

exports.authenticated = function (req, res, next) {

    // Comprobar si llega autorizaci�n
    if(!req.headers.authorization) {
        return res.status(403).send({
            message: 'La petici�n no tiene la cabecera de authorization'
        });
    }

    // Limpiar el token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');


    try {
        // Decodificar token
        var payload = jwt.decode(token, secret);

        // Comprobar si el token ha expirado
        if( payload.exp <= moment().unix() ) {
            return res.status(404).send({
                message: 'El token ha expirado'
            });
        }
    }
    catch (ex) {
        return res.status(404).send({
            message: 'El token no es v�lido'
        });
    }

    // Adjuntar usuario identificado a la request
    req.user = payload;

    // Pasar a la acci�n

    next();
}