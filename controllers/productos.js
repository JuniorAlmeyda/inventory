const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async(req, res = response) => {
  const { limite = 5 , desde = 0 } = req.query;
  const productos = await Producto.find({estado: true})
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')
    .skip(Number(desde))
    .limit(Number(limite));

  const total = await Producto.countDocuments({estado: true});
  res.status(200).json({
    total,
    productos
  })
}

const obtenerProducto = async(req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
  .populate('usuario', 'nombre')
  .populate('categoria', 'nombre');

  res.status(200).json({
    producto
  })

}

const crearProducto = async(req, res = response) => {

  const { estado, usuario, ...resto } = req.body;
  const productoDB = await Producto.findOne({nombre: resto.nombre});
  if(productoDB){
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`
    })
  }
  const data = {
    ...resto,
    nombre: resto.nombre.toUpperCase(),
    usuario: req.usuario._id
  }
  const producto = new Producto(data);

  await producto.save();
  res.status(200).json(producto);

}

const actualizarProducto = async(req, res = response) => {

  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if(data.nombre){
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;
  const producto = await Producto.findByIdAndUpdate(id, data, {new: true});
  res.status(200).json({
    producto
  })
}

const borrarProducto = async(req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new:true});
  res.status(200).json({
    producto
  })
}


module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto
}


