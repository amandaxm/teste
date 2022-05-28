require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("./src/models/Usuario");
const Carona = require("./src/models/Carona");
const Carro = require("./src/models/Carro");

const app = express();

// models
//const User = require("./models/User");

// Config JSON response
app.use(express.json());

// Open Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo ao app de caronas!" });
});

// Private Route
app.get("/usuario/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await Usuario.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

app.get("/usuario", checkToken, async (req, res) => {
  
  const users = await Usuario.find();

  if (!users) {
    return res.status(404).json({ msg: "Nenhum usuário encontrado" });
  }

  res.status(200).json({ users });
});


function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}
app.post("/auth/register", async (req, res) => {
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
  });
  
  app.post("/auth/login", async (req, res) => {
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
  });
  

//rotas caronas

// encontrar carona
app.get("/carona/", checkToken, async (req, res) => {
  const idCarona = req.body;

  // check if user exists
  const carona = await Carona.findById(idCarona);

  if (!carona) {
    return res.status(404).json({ msg: "Carona não encontrada!" });
  }

  res.status(200).json({ carona });
});

// salvar carona usuario
app.post("/carona", checkToken, async (req, res) => {
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
});

app.put("/carona", checkToken, async (req, res) => {
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
});

app.delete("/carona", checkToken, async (req, res) => {
  const { id } = req.body;

  const carona = await Carona.findById(id);

  try {
    await carona.delete();

    res.status(201).json({ msg: "Carona excluida com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.get("/carona", checkToken, async (req, res) => {
  
  const caronas = await Carona.find();

  if (!caronas) {
    return res.status(404).json({ msg: "Nenhuma carona encontrada" });
  }

  res.status(200).json({ caronas });
});

//caronas do usuario
app.get("/usuario/:id/caronas/", checkToken, async (req, res) => {
  
  const id = req.params.id;

  const caronas = await Carona.find({ _idUsuario: id }); 
  console.log(caronas) 
  if (!caronas) {
    return res.status(404).json({ msg: "Nenhuma carona encontrada" });
  }

  res.status(200).json({ caronas });
});


const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tjoqq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    
  )
  .then(() => {
    console.log("Conectou ao banco!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));