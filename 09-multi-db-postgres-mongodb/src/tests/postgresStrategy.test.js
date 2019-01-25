/*const assert = require('assert');
const Postgres = require('./../db/strategies/postgres');
const Context = require('./../db/strategies/base/contextStrategy')

const context = new Context(new Postgres());
const MOCK_HEROI_CADASTRAR = { nome: 'Gavião Negro', poder: 'Flechas' };
const MOCK_HEROI_ATUALIZAR = { nome: 'Batman', poder: 'Dinheiro' };

describe('Postgres Strategy', function(){
    this.timeout(Infinity);

    this.beforeAll(async function(){
        await context.connect();
        await context.delete();
        await context.create(MOCK_HEROI_ATUALIZAR);
    })

    it('PostgresSQL Connection', async function(){
        const result = await context.isConnected();
        assert.equal(result, true);
    });

    it('Cadastrar um item', async function(){
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
    });

    it('Listar itens', async function(){
        const [ { nome, poder } ] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
    });

    it('Atualizar um item', async function(){
        const [ itemAtualizar ] = await context.read({ nome:  MOCK_HEROI_ATUALIZAR.nome });
        const novoItem = { ...MOCK_HEROI_ATUALIZAR, nome: 'Mulher Maravilha' };
        const [ result ] = await context.update(itemAtualizar.id, novoItem);
        const [ itemAtualizado ] = await context.read({ id: itemAtualizar.id });
        assert.deepEqual(result, 1);
        assert.deepEqual(itemAtualizado.nome, novoItem.nome);
    });

    it('Remover um item', async function(){
        const [ item ] = await context.read({});
        const result = await context.delete(item.id);
        assert.deepEqual(result, 1);
    });
});*/