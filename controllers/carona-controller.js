const mongoose = require("mongoose");
const Usuario = require("../models/Usuario");
const Carona = require("../models/Carona");

// encontrar carona
exports.EncontrarCarona = async (req, res) => {
    const idCarona = req.params.id;
  
    // check if user exists
    const carona = await Carona.findById(idCarona);
  
    if (!carona) {
      return res.status(404).json({ msg: "Carona não encontrada!" });
    }
  
    res.status(200).json({ carona });
  };
  
  // salvar carona usuario
  exports.CadastrarCarona = async (req, res) => {
    const { _idUsuario, enderecoDestino, enderecoSaida, dataHorarioSaida, ativa, lugaresDisponiveis } = req.body;
  
    const usuario = await Usuario.findById(_idUsuario);
  
    const carro = usuario.carro;
  
    const carona = new Carona({
      _id: new mongoose.Types.ObjectId,
      _idUsuario,
      carro,
      enderecoDestino,
      enderecoSaida,
      dataHorarioSaida,
      ativa,
      lugaresDisponiveis
    });
  
    try {
      await carona.save();
  
      res.status(201).json({ msg: "Carona cadastrada com sucesso!" });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  };
  
  exports.AtualizarCarona= async (req, res) => {
    const { enderecoDestino, enderecoSaida, dataHorarioSaida, ativa, id } = req.body;
  
    const carona = await Carona.findById(id);
    
    carona.enderecoDestino = enderecoDestino ? enderecoDestino : carona.enderecoDestino;
    carona.enderecoSaida = enderecoSaida ? enderecoSaida : carona.enderecoSaida;
    carona.dataHorarioSaida = dataHorarioSaida ? dataHorarioSaida : carona.dataHorarioSaida;
    carona.ativa = ativa ? ativa : carona.ativa;
  
    try {
      await carona.save();
  
      res.status(201).json({ msg: "Carona atualizada com sucesso!" });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  };
  
  exports.DeleteCarona= async (req, res) => {
    const { id } = req.body;
  
    const carona = await Carona.findById(id);
  
    try {
      await carona.delete();
  
      res.status(201).json({ msg: "Carona excluida com sucesso!" });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  };
  
  exports.Caronas = async (req, res) => {
    
    const caronas = await Carona.find();
  
    if (!caronas) {
      return res.status(404).json({ msg: "Nenhuma carona encontrada" });
    }
  
    res.status(200).json({ caronas });
  };