const ICrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
    constructor(connection, schema){
        super();
        this._connection = connection;
        this._schema = schema;
    }

    static async connect(){
        const connection = new Sequelize(
            'heroes', 
            'heroe', 
            'heroe123', 
            { 
                host: 'localhost', 
                dialect: 'postgres', 
                quoteIdentifiers: false, 
                operatorsAliases: false,
                logging: false
            }
        );
        return connection;
    }

    static async defineModel(connection, schema){
        const Model = connection.define(schema.name, schema.schema, schema.options);
        await Model.sync();
        return Model;
    }

    async isConnected(){
        try{
            await this._connection.authenticate();
            return true;
        }catch(error){
            console.log('ERRO', error);
            return false;
        }
    }

    async create(item) {
        return this._schema.create(item, {raw: true});
    }

    async read(query = {}) {
        return this._schema.findAll({where: query, raw: true});
    }

    async update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update';
        return this._schema[fn](item, {where: {id: id}});
    }

    async delete(id){
        const query = id ? { id } : {};
        return this._schema.destroy({where: query});
    }
}

module.exports = Postgres;