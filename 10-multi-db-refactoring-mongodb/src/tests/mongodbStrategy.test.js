const assert = require('assert');
const MongoDB = require('./../db/strategies/mongodb/mongodb');
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = { nome: 'Mulher Maravilha', poder: 'Laço' };
const MOCK_HEROI_DEFAULT = { nome: `Homem Aranha ${Date.now()}`, poder: 'Super teia' };
const MOCK_HEROI_ATUALIZAR = { nome: 'Patolino ${Date.now()}', poder: 'Velocidade' };
let MOCK_HEROI_ID = '';

let context = {};

describe.only('MongoDB Strategy', function(){
    this.timeout(Infinity);

    this.beforeAll(async function(){
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroiSchema));
        await context.create(MOCK_HEROI_DEFAULT);
        const result = await context.create(MOCK_HEROI_ATUALIZAR);
        MOCK_HEROI_ID = result._id;
        //await context.delete();
    })

    it('MongoDB Connection', async function(){
        const result = await context.isConnected();
        assert.deepEqual(result, 'Conectado');
    });

    it('Cadastrar um item', async function(){
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
    });

    it('Listar itens', async function(){
        const [ { nome, poder } ] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome });
        assert.deepEqual({ nome, poder }, MOCK_HEROI_DEFAULT);
    });

    it('Atualizar um item', async function(){
        const result = await context.update(MOCK_HEROI_ID, { nome: 'Pernalonga' });
        assert.deepEqual(result.nModified, 1);
    });

    it('Remover um item', async function(){
        const result = await context.delete(MOCK_HEROI_ID);
        assert.deepEqual(result.n, 1);
    });
});