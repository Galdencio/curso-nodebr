const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || "dev";

ok(env === 'prod' || env === 'dev', 'Env deve ser prod ou dev');

const configPath = join(__dirname, './../config', `.env.${env}`);
config({
    path: configPath
});

const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroisSchema')
const HeroeRoute = require('./routes/heroeRoutes');
const AuthRoute = require('./routes/authRoutes');
const UtilRoute = require('./routes/utilRoutes');

const Postgres = require('./db/strategies/postgres/postgres');
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema');

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const HapiJWT = require('hapi-auth-jwt2');
const JWT_SECRET = process.env.JWT_KEY;

const app = new Hapi.Server({
    port: process.env.PORT
});

function mapRoutes(instance, methods){
    return methods.map(method => instance[method]());
}

async function main(){
    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, HeroiSchema));

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema);
    const contextPostgres = new Context(new Postgres(connectionPostgres, model));

    const swaggerOptions = {
        info: {
            title: 'API Heróis',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([
        HapiJWT,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // }
        validate: async (dado, request) => {
            const result = await contextPostgres.read({
                username: dado.username.toLowerCase()
            });
            if(!result) return { isValid: false }
            return {
                isValid: true
            }
        }
    });

    app.auth.default('jwt');

    app.route([
        ...mapRoutes(new HeroeRoute(context), HeroeRoute.methods()),
        ...mapRoutes(new AuthRoute(contextPostgres, JWT_SECRET), AuthRoute.methods()),
        ...mapRoutes(new UtilRoute(), UtilRoute.methods())
    ]);

    await app.start();
    console.log('Servidor rodando na porta', app.info.port)
    return app;
}

module.exports = main();