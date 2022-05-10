
const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
  
  const { limite = 5, desde = 0 } = req.query;
  const usuarios = await Usuario.find({estado:true})
    .skip(Number(desde))
    .limit(Number(limite));
  
  const total = await Usuario.countDocuments({estado:true});

  res.json({
    msg: 'Get Api - Controlador',
    total,
    usuarios
  })
}

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt )
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto );
  
  res.json({
    msg: 'Put Api - Controlador',
    usuario
  })
  
}

const usuariosPost = async(req, res) => {

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt )

  //Guardar en BD
  await usuario.save();
  
  res.json({
    msg: 'Post Api - Controlador',
    usuario
  })
}

const usuariosDelete = async (req, res) => {

  const { id } = req.params;
  // Borramos Físicamente
  // const usuario = await Usuario.findByIdAndDelete( id );

  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

  const usuarioAutenticado = req.usuario;

  res.json({
    msg: 'Delete Api - Controlador',
    usuario,
    usuarioAutenticado
  })
}

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete
}
