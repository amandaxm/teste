const mongoose = require('mongoose')
const Carro = require('./Carro').schema
const Endereco = require('./ValueObjects/Endereco').schema

const Carona = mongoose.model('Carona', {
  _id: mongoose.Types.ObjectId,
  _idUsuario: mongoose.Types.ObjectId,
  carro: Carro,
  usuarioId: String,
  enderecoDestino: Endereco,
  enderecoSaida: Endereco,
  dataHorarioSaida: Date,
  ativa: Boolean,
  lugaresDisponiveis: Number
})

module.exports = Carona