const { response } = require("express");
const { Categoria } = require('../models');

const obtenerCategorias = async(req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const categorias = await Categoria.find({estado:true})
    .populate('usuario', 'nombre')
    .skip(Number(desde))
    .limit(Number(limite));

  const total = await Categoria.countDocuments({estado: true});

  res.status(200).json({
    total,
    categorias
  })
}


const obtenerCategoria = async(req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
  res.status(200).json(categoria)

}

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({nombre});
  if ( categoriaDB ){
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`
    });
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id
  }
  const categoria = new Categoria(data);

  // Guardar en DB
  await categoria.save();
  res.status(201).json(categoria);
}

const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;
  const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
  res.status(200).json({
    categoria
  })
}

const borrarCategoria = async(req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
  res.status(200).json({
    categoria
  })

}

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria
}
