
const { Categoria, Producto } = require('../models');
const Role = require('../models/role')
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
  const existeRol = await Role.findOne({rol});
  if(!existeRol){
    throw new Error(`El rol ${rol} no está registrado en la BD`)
  }
}

const emailExiste = async(correo = '') => {
  const existeEmail = await Usuario.findOne({ correo });
  if( existeEmail ) {
    // return res.status(400).json({
    //   msg: 'el correo ya está registrado'
    // })
    throw new Error(`El email ${correo} ya está registrado en la BD`)
  }
}

const existeUsuarioPorId = async(id) => {
  const existeUsuario = await Usuario.findById(id);
  if( !existeUsuario ) {
    // return res.status(400).json({
    //   msg: 'el correo ya está registrado'
    // })
    throw new Error(`El id ${id} no existe en la BD`)
  }
}

const existeCategoria = async(id) => {
  const existeCategoria = await Categoria.findById(id);
  if(!existeCategoria){
    throw new Error(`No existe la categoría con el id ${ id }`);
  }
}

const existeProducto = async(id) => {
  const existeProducto = await Producto.findById(id);
  if(!existeProducto){
    throw new Error(`No existe el producto con el id ${id}`)
  }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if(!incluida){
    throw new Error(`La ${coleccion} no está permitida - ${colecciones}`)
  }
  return true
}

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoria,
  existeProducto,
  coleccionesPermitidas
}
