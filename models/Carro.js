const mongoose = require('mongoose')


const Carro = mongoose.model('Carro', {
  _id: mongoose.Types.ObjectId,
  lugaresDisponiveis: Number,
  cor: String,
  marca: String,
  ano: String,
  portas: Number,
  arCondicionado: Boolean
})

module.exports = Carro