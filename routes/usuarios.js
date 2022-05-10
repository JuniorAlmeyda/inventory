
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares');


router.get('/', (req, res) => {
  res.send('No se va a mostrar porque se usa middlewares')
});

router.get('/api', usuariosGet);

router.put('/api/:id', [
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('rol').custom( esRoleValido ),
  validarCampos
], usuariosPut);

router.post('/api', [
  validarJWT,
  esAdminRole,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe ser más de 6 letras').isLength({min: 6}),
  check('correo', 'El correo no es válido').isEmail(),
  check('correo').custom( emailExiste ),
  // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('rol').custom( esRoleValido ),
  validarCampos
],usuariosPost);

router.delete('/api/:id', [
  validarJWT,
  esAdminRole,
  // tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuariosDelete);

module.exports = router;