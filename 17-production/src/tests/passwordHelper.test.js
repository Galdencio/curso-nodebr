const assert = require('assert');
const PasswordHelper = require('./../helpers/passwordHelper')
const SENHA = 'SenhaDeTeste';
const HASH = '$2b$04$6wamVFgs/9X7MoxaXyzZEuWAyzyicxl1Wi0GBjmRSdqp7zk35U59y';

describe('Suíte de testes de Usuário', function (){
    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA);
        assert.ok(result.length > 10);
    });

    it('Deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.compare(SENHA, HASH);
        assert.ok(result);
    });
});