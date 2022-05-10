
const { Router } = require('express')
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');

const { cargarArchivo, actualizarImagen, mostarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
  validarArchivoSubir,
  check('id', 'No es un id de mongo').isMongoId(),
  check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
  check('id', 'No es un id de mongo').isMongoId(),
  check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], mostarImagen)

module.exports = router
