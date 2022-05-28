const express = require('express');
const router = express.Router();
const login = require('../middleware/login');
const usuarioController = require('../controllers/usuario-controller');

router.post('/', usuarioController.criarUsuario);
router.post('/login', usuarioController.Login);
router.get('/:id/caronas',login.required, usuarioController.caronasUsuario); 
router.get('/:id', login.required, usuarioController.GetUsuarioEspecifico); 
router.get('/', login.required,usuarioController.GetTodosUsuarios); 
module.exports = router;