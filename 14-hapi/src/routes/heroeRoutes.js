const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const boom = require('boom');
const failAction = (request, headers, erro) => {
    throw erro;
}

class HeroRoutes extends BaseRoute{
    constructor(db){
        super();
        this.db = db;
    }

    list(){
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    //payload, headers, params, query
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        name: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, headers) => {
                try{
                    const { skip, limit, name } = request.query;
                    let query = name ? { nome: { $regex: `.*${name}*.` } } : {};
                    return this.db.read(query, skip, limit);
                }catch(error){
                    console.log('ERRO', error);
                    return boom.internal();
                }
            }
        }
    }

    create(){
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    //payload, headers, params, query
                    failAction,
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100),
                    }
                }
            },
            handler: async (request, headers) => {
                try{
                    const { nome, poder } = request.payload;
                    const result = await this.db.create({ nome, poder });
                    return { message: 'Herói cadastrado com sucesso!', _id: result._id };
                }catch(error){
                    console.log('ERRO', error);
                    return boom.internal();
                }
            }
        }
    }

    update(){
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    //payload, headers, params, query
                    failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100),
                    }
                }
            },
            handler: async (request, headers) => {
                try{
                    const { id } = request.params;
                    const { payload } = request;
                    const dadosString = JSON.stringify(payload);
                    const dados = JSON.parse(dadosString);
                    const result = await this.db.update(id, dados);
                    if(result.nModified !== 1) return boom.preconditionFailed('Id não encontrado no banco');
                    return { message: 'Herói editado com sucesso!' };
                }catch(error){
                    console.log('ERRO', error);
                    return boom.internal();
                }
            }
        }
    }

    delete(){
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    //payload, headers, params, query
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                try{
                    const { id } = request.params;
                    const result = await this.db.delete(id);
                    if(result.n !== 1) return boom.preconditionFailed('Id não encontrado no banco');
                    return { message: 'Herói removido com sucesso!' };
                }catch(error){
                    console.log('ERRO', error);
                    return boom.internal();
                }
            }
        }
    }
}

module.exports = HeroRoutes;