docker ps
docker exec -it a77973337753 \
    mongo -u galdenciolsn -p minhasenha --authenticationDatabase herois

// mostra database
show dbs

// usa database herois
use herois

// mostrar coleções (tabelas)
show collections

// Insere um registro
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

//busca registros
db.herois.find()
db.herois.find().pretty() // exibe de forma mais visual
db.herois.findOne() // busca apenas um registro
db.herois.find({nome: 'Flash'}) // Busca com uma característica específica
db.herois.find().limit(10).sort({ nome: -1 }) // limita quantidade por ordem decrescente
db.herois.find({}, { poder: 1, _id: 0 }) // busca apenas alguns atributos. Para não vir o id (padrão) deve-se colocar o 0

// executando javascript no mongodb
for(let i = 0; i <= 100; i++){
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'
    })
}

// retorna quantidade de linhas
db.herois.count();

//create
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

//read
db.herois.find()

//update
//---- substitui outros dados, deixando apenas o enviado
db.herois.update({ _id: ObjectId("5c4b08b8ad997b86f51fa00c") }, { nome: 'Mulher Maravilha' }) 
//---- somente altera valor passado, se não existir o atributo, será adicionado
db.herois.update({ _id: ObjectId("5c4b094dad997b86f51fa01a") }, { $set: { nome: 'Lanterna Verde' }}) 
//---- altera apenas o primeiro que encontrar
db.herois.update({ poder: 'Velocidade' }, { $set: { poder: 'Super força' }}) 

//delete
db.herois.remove() // não remove por não ter um where
db.herois.remove({}) // remove todos da base
db.herois.remove({ nome: 'Lanterna Verde' })