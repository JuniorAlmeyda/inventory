const { Router } = require('express')
const { check } = require('express-validator');
const { crearCategoria, obtenerCategoria, borrarCategoria, actualizarCategoria, obtenerCategorias } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( existeCategoria ),
  validarCampos
], obtenerCategoria)

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria)

// Actualizar un registro por id - privado - cualquiera con token valido
router.put('/:id', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( existeCategoria ),
  validarCampos
], actualizarCategoria)

// Borrar categoria - admin
router.delete('/:id',[
  validarJWT,
  esAdminRole,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( existeCategoria ),
  validarCampos
], borrarCategoria)

module.exports = router