const ICrud = require('./../interfaces/interfaceCrud');
const Mongoose = require('mongoose');
const STATUS = { 0: 'Disconectado', 1: 'Conectado', 2: 'Conectando', 3: 'Disconectado' };

class MongoDB extends ICrud {
    constructor(connection, schema){
        super();
        this._connection = connection;
        this._schema = schema;
    }

    static connect(){
        Mongoose.connect('mongodb://galdenciolsn:minhasenha@localhost:27017/herois', 
            { useNewUrlParser: true }, function(error){
                if(!error) return;
                console.log('Falha na conexão!', error);
            });
        return Mongoose.connection;
    }

    async isConnected(){
        const state = STATUS[this._connection.readyState];
        if(state === 'Conectado') return state;
        if(state !== 'Conectando') return state;
        await new Promise(resolve => setTimeout(resolve, 1000))
        return STATUS[this._connection.readyState]
    }
    
    async create(item) {
        return await this._schema.create(item);
    }

    async read(query, skip = 0, limit = 10) {
        return this._schema.find(query).skip(skip).limit(limit);
    }

    async update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item });
    }

    async delete(id){
        const query = id ? { id } : {};
        return this._schema.deleteOne({ _id: id });
    }
}

module.exports = MongoDB;