const mongoose = require('mongoose')
const Endereco = mongoose.model('Endereco', {
    bairro: String,
    cidade: String,
    complemento: String,
    informacoesAdicionais: String,
    cep: String,
  })
  
  module.exports = Endereco