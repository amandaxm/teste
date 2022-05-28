const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const caronaController = require('../controllers/carona-controller');

router.get('/:id', caronaController.EncontrarCarona);
router.post('/', login.required, caronaController.CadastrarCarona);
router.put('/', login.required, caronaController.AtualizarCarona);
router.get('/', login.required,  caronaController.Caronas);
router.delete('/', login.required,  caronaController.DeleteCarona);
module.exports = router;