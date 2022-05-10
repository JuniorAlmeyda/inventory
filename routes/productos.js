const { Router } = require('express');
const { check }  = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoria, existeProducto } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
  check('id', 'No es un id de Mongo').isMongoId(),
  check('id').custom( existeProducto ),
  validarCampos
], obtenerProducto);

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'La categoria no es un id de Mongo').not().isEmpty(),
  check('categoria', 'La categoria es obligatorio').not().isEmpty(),
  check('categoria').custom( existeCategoria ),
  validarCampos
], crearProducto),

router.put('/:id', [
  validarJWT,
  check('id', 'No es un id de Mongo').isMongoId(),
  check('id').custom( existeProducto ),
  validarCampos
], actualizarProducto);

router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un id de Mongo').isMongoId(),
  check('id').custom( existeProducto ),
  validarCampos
], borrarProducto);

module.exports = router;