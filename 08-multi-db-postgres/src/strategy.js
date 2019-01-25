class NotImplementedException extends Error {
    constructor() {
        super("Not Implemented Exception");
    }
}

class ICRUD {
    create(item) {
        throw new NotImplementedException();
    }

    read(query){
        throw new NotImplementedException();
    }

    update(id, item) {
        throw new NotImplementedException();
    }

    delete(id){
        throw new NotImplementedException();
    }
}

class MongoDB extends ICRUD {
    constructor(){
        super();
    }

    create(item) {
        console.log('O item foi salvo em MongoDB');
    }
}

class Postgres extends ICRUD {
    constructor(){
        super();
    }

    create(item) {
        console.log('O item foi salvo em Postgres');
    }
}

class ContextStrategy {
    constructor(strategy){
        this._database = strategy;
    }

    create(item) {
        return this._database.create(item);
    }

    read(query) {
        return this._database.read(query);
    }

    update(id, item) {
        return this._database.update(id, item);
    }

    delete(id) {
        return this._database.delete(id);
    }
}

const contextMongo = new ContextStrategy(new MongoDB());
contextMongo.create();
contextMongo.read();

const contextPostgres = new ContextStrategy(new Postgres());
contextPostgres.create();