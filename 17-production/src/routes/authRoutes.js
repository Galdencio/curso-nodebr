const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const boom = require('boom');
const failAction = (request, headers, erro) => {
    throw erro;
}
const USER = {
    username: 'galdenciolsn',
    password: '123456'
}

// npm i jsonwebtoken
const JWT = require('jsonwebtoken');

const PasswordHelper = require('./../helpers/passwordHelper');

class AuthRoutes extends BaseRoute{
    constructor(db, secret){
        super();
        this.db = db;
        this.secret = secret;
    }

    login(){
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obtém token JWT',
                notes: 'Faz login com usuário e senha do banco de dados',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                try{
                    const { username, password } = request.payload;

                    // if(username.toLowerCase() !== USER.username || password !== USER.password)
                    //     return boom.unauthorized();

                    const [ usuario ] = await this.db.read({
                        username: username.toLowerCase()
                    });

                    if(!usuario) return boom.unauthorized('O usuário informado não existe')
                    
                    const match = await PasswordHelper.compare(password, usuario.password);
                    if(!match) return boom.unauthorized('Usuário ou senha inválidos');

                    const token = JWT.sign({
                        username: usuario.username,
                        id: usuario.id
                    }, this.secret);

                    return { token }
                }catch(error){
                    console.log('ERRO', error);
                    return boom.internal();
                }
            }
        }
    }

}

module.exports = AuthRoutes;