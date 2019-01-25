const ICrud = require('./interfaces/interfaceCrud');
const Mongoose = require('mongoose');
const STATUS = { 0: 'Disconectado', 1: 'Conectado', 2: 'Conectando', 3: 'Disconectado' };

class MongoDB extends ICrud {
    constructor(){
        super();
        this._driver = null;
        this._herois = null;
    }

    connect(){
        Mongoose.connect('mongodb://galdenciolsn:minhasenha@localhost:27017/herois', 
            { useNewUrlParser: true }, function(error){
                if(!error) return;
                console.log('Falha na conexão!', error);
            });

        this._driver = Mongoose.connection;
        this.defineModel();
    }

    async isConnected(){
        const state = STATUS[this._driver.readyState];
        if(state === 'Conectado') return state;
        if(state !== 'Conectando') return state;
        await new Promise(resolve => setTimeout(resolve, 1000))
        return STATUS[this._driver.readyState]
    }

    defineModel(){
        const heroiSchema = new Mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        });
        this._herois = Mongoose.model('herois') || Mongoose.model('herois', heroiSchema);
    }

    async create(item) {
        return await this._herois.create(item);
    }

    async read(query, skip = 0, limit = 10) {
        return this._herois.find(query).skip(skip).limit(limit);
    }

    async update(id, item) {
        return this._herois.updateOne({ _id: id }, { $set: item });
    }

    async delete(id){
        const query = id ? { id } : {};
        return this._herois.deleteOne({ _id: id });
    }
}

module.exports = MongoDB;