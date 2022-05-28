const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require("../models/Usuario");
const Carro = require("../models/Carro");
const Carona = require("../models/Carona");

exports.criarUsuario = async (req, res, next) => {

    const { nome, email, matricula, senha, confirmacaoSenha, eMotorista, ePassageiro, carro } = req.body;
  
    // validacao
    if (!nome) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
  
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }
  
    if (!senha) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }
  
    if (senha != confirmacaoSenha) {
      return res
        .status(422)
        .json({ msg: "A senha e a confirmação precisam ser iguais!" });
    }
  
    // checando se usuario ja existe
    const userExists = await Usuario.findOne({ email: email });
  
    if (userExists) {
      return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
    }
  
    // criando a senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);
    
    var carroMotorista;
    if(eMotorista){

      const idCarro = new mongoose.Types.ObjectId;
   
      carroMotorista = new Carro({
      _id: idCarro,
       lugaresDisponiveis: carro.lugaresDisponiveis,
       cor: carro.cor,
       marca: carro.marca,
       ano: carro.ano,
       portas: carro.portas,
       arCondicionado: carro.arCondicionado
      }) 
     }
     if(carroMotorista)
      await carroMotorista.save();

    // criando o usuario
    const user = new Usuario({
      _id: new mongoose.Types.ObjectId,
      nome,
      email,
      matricula,
      senha: passwordHash,
      eMotorista,
      ePassageiro,
      carro: carroMotorista ? carroMotorista : null
    });
  
    try {
      await user.save();
  
      res.status(201).json({ msg: "Usuário criado com sucesso!" });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
};

exports.Login = async (req, res, next) => {

    const { email, senha } = req.body;
  
    // validations
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }
  
    if (!senha) {
      return res.status(422).json({ msg: "A senha é obrigatória!" });
    }
  
    // check if user exists
    const user = await Usuario.findOne({ email: email });
  
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    // check if password match
  
    const checkPassword = await bcrypt.compare(senha, user.senha);

    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida", senha:{ senha}, userSenha: {s} });
    }
  
    try {
      const secret = process.env.SECRET;
  
      const token = jwt.sign(
        {
          id: user._id,
        },
        secret
      );
  
      res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  }
exports.caronasUsuario =  async (req, res) => {
  
    const id = req.params.id;
  
    const caronas = await Carona.find({ _idUsuario: id }); 
    console.log(caronas) 
    if (!caronas) {
      return res.status(404).json({ msg: "Nenhuma carona encontrada" });
    }
  
    res.status(200).json({ caronas });
  };

  // Private Route
exports.GetUsuarioEspecifico = async (req, res) => {
    const id = req.params.id;
  
    // check if user exists
    const user = await Usuario.findById(id, "-password");
  
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }
  
    res.status(200).json({ user });
  };
  
  exports.GetTodosUsuarios = async (req, res) => {
    
    const users = await Usuario.find();
  
    if (!users) {
      return res.status(404).json({ msg: "Nenhum usuário encontrado" });
    }
  
    res.status(200).json({ users });
  };
  