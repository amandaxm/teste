const mongoose = require('mongoose')
const Carro = require('./Carro').schema

const Usuario = mongoose.model('Usuario', {
  _id: mongoose.Types.ObjectId,
  nome: String,
  email: String,
  senha: String,
  ePassageiro: Boolean,
  eMotorista: Boolean,
  carro: Carro,
  matricula: String,
})

module.exports = Usuario