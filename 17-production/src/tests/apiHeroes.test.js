const assert = require('assert');
const api = require('./../api');
let app = {};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdhbGRlbmNpb2xzbiIsImlkIjoxLCJpYXQiOjE1NDg4NDkzMTd9.3J46I1g9N6l5wUFiz8Tu6D-x_3euvSXFyIk1ntCT2wQ';
const headers = {
    Authorization: TOKEN
}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Biônica'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'A mira'
}

let MOCK_ID = '';

describe('Suíte de testes da API Heroes', function () {
    this.beforeAll(async () => {
        app = await api;
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: MOCK_HEROI_INICIAL
        });
        const dados = JSON.parse(result.payload);
        MOCK_ID = dados._id;
    });
    
    it('GET Listar /herois', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=10'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    });

    it('GET Listar /herois - deve retornar somente 10 registros', async() => {
        const TAMANHO_LIMITE = 3;
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(dados.length === TAMANHO_LIMITE);
    });

    it('GET Listar /herois - deve retornar erro com limit incorreto', async() => {
        const TAMANHO_LIMITE = 'AEEE';
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        });

        assert.deepEqual(result.statusCode, 400);
    });

    it('GET Listar /herois - deve retornar filtrar um item', async() => {
        const NOME_ITEM = MOCK_HEROI_INICIAL.nome;
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=1000&name=${NOME_ITEM}`
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.deepEqual(dados[0].nome, NOME_ITEM);
    });

    it('POST Cadastrar /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: `/herois`,
            payload: MOCK_HEROI_CADASTRAR
        });

        const statusCode = result.statusCode;
        const { message, _id } = JSON.parse(result.payload);
        assert.ok(statusCode === 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepEqual(message, 'Herói cadastrado com sucesso!');
    });

    it('PATCH Atualizar /herois/:id', async () => {
        const _id = MOCK_ID;
        const expected = { poder: 'Super Mira' };
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        });

        const statusCode = result.statusCode;
        const { message } = JSON.parse(result.payload);
        assert.ok(statusCode === 200);
        assert.deepEqual(message, 'Herói editado com sucesso!');
    });

    it('PATCH Atualizar /herois/:id - não deve atualizar com id incorreto', async () => {
        const _id = `5c4b3361dd0fa0006904c2fd`;
        const expected = { poder: 'Super Mira' };
        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        });

        const dados = JSON.parse(result.payload);
        const expectedResult = { statusCode: 412, error: 'Precondition Failed', message: 'Id não encontrado no banco' }
        assert.deepEqual(dados, expectedResult);
    });

    it('DELETE Deletar /herois/:id', async () => {
        const _id = MOCK_ID;
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        });

        const statusCode = result.statusCode;
        const { message } = JSON.parse(result.payload);
        assert.ok(statusCode === 200);
        assert.deepEqual(message, 'Herói removido com sucesso!');
    });

    it('DELETE Remover /herois/:id - não deve remover com id incorreto', async () => {
        const _id = `5c4b3361dd0fa0006904c2fd`;
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}`
        });

        const dados = JSON.parse(result.payload);
        const expectedResult = { statusCode: 412, error: 'Precondition Failed', message: 'Id não encontrado no banco' }
        assert.deepEqual(dados, expectedResult);
    });

});