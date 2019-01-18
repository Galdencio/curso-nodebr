/*
    Obter um usuário
    Obter o número de telefone de um usuário a partir de seu id
    Obter o endereço do usuário pelo seu id
*/

/*
// 1) USO DE CALLBACKS
function obterUsuario(callback){
    setTimeout(function(){
        return callback(null, {
            id: 1,
            nome: 'Aladin',
            dataNascimento: new Date()
        });
    }, 1000);
}

function obterTelefone(idUsuario, callback){
    setTimeout(function(){
        return callback(null, {
            telefone: 1199002,
            ddd: 11
        });
    }, 2000);
}

function obterEndereco(idUsuario, callback){
    setTimeout(function(){
        return callback(null, {
            rua: 'dos bobos',
            numero: 0
        });
    }, 2000);
}

obterUsuario(function resolverUsuario(error, usuario){
    // null || "" || 0 === false
    if(error){
        console.error('ERRO', error);
        return;
    }
    obterTelefone(usuario.id, function resolverTelefone(error1, telefone){
        if(error1){
            console.error('ERRO', error1);
            return;
        }
        obterEndereco(usuario.id, function resolverEndereco(error2, endereco){
            if(error2){
                console.error('ERRO', error2);
                return;
            }

            console.log(`
                Nome: ${usuario.nome},
                Endereço: ${endereco.rua},${endereco.numero}
                Telefone: (${telefone.ddd}) ${telefone.telefone}
            `);
        });
    });
});
*/

/*
// PROMISES
function obterUsuario(){
    // Quando der algum problema -> reject
    // Quando for sucesso -> resolve
    return new Promise(function resolvePromise(resolve, reject){
        // return reject(new Error('REJECT!'));
        setTimeout(function(){
            return resolve({
                id: 1,
                nome: 'Aladin',
                dataNascimento: new Date()
            });
        }, 1000);
    });
}

function obterTelefone(idUsuario){
    return new Promise(function resolvePromise(resolve, reject){
        setTimeout(function(){
            return resolve({
                telefone: 1199002,
                ddd: 11
            });
        }, 2000);
    });
}

function obterEndereco(idUsuario, callback){
    setTimeout(function(){
        return callback(null, {
            rua: 'dos bobos',
            numero: 0
        });
    }, 2000);
}
// Forma de mudar para promise sem alterar função com callback
const util = require('util');
const obterEnderecoAsync = util.promisify(obterEndereco);

// para manipular o sucesso usamos a função .then
// para manipular erros usamos o .catch
// Funcionamento em pipe: cada ponto entrega uma saída para o próximo
obterUsuario()
    .then(function(usuario){
        return obterTelefone(usuario.id)
            .then(function resolverTelefone(telefone){
                return {
                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome
                    },
                    telefone: telefone
                }
            })
            .catch(function(error){
                console.error('ERRO', error);
            });
    })
    .then(function(resultado){
        return obterEnderecoAsync(resultado.usuario.id)
            .then(function resolverEndereco(endereco){
                return {
                    usuario: resultado.usuario,
                    telefone: resultado.telefone,
                    endereco: endereco
                }
            })
            .catch(function(error){
                console.error('ERRO', error);
            });
    })
    .then(function(resultado){
        console.log(`
            Nome: ${resultado.usuario.nome},
            Endereço: ${resultado.endereco.rua},${resultado.endereco.numero}
            Telefone: (${resultado.telefone.ddd}) ${resultado.telefone.telefone}
        `);
    })
    .catch(function(error){
        console.error('ERRO', error);
    });
*/

//ASYNC/AWAIT
function obterUsuario(){
    return new Promise(function resolvePromise(resolve, reject){
        setTimeout(function(){
            return resolve({
                id: 1,
                nome: 'Aladin',
                dataNascimento: new Date()
            });
        }, 1000);
    });
}

function obterTelefone(idUsuario){
    return new Promise(function resolvePromise(resolve, reject){
        setTimeout(function(){
            return resolve({
                telefone: 1199002,
                ddd: 11
            });
        }, 2000);
    });
}

function obterEndereco(idUsuario, callback){
    setTimeout(function(){
        return callback(null, {
            rua: 'dos bobos',
            numero: 0
        });
    }, 2000);
}

// Forma de mudar para promise sem alterar função com callback
const util = require('util');
const obterEnderecoAsync = util.promisify(obterEndereco);

// Adicionar palavra async na função -> automaticamente ela retornará uma Promise
async function main(){
    try{
        console.time('medida-promise');
        const usuario = await obterUsuario();
        // const telefone = await obterTelefone(usuario.id);
        // const endereco = await obterEnderecoAsync(usuario.id);

        const resultado = await Promise.all([
            obterTelefone(usuario.id),
            obterEnderecoAsync(usuario.id)
        ]);

        const endereco = resultado[1];
        const telefone = resultado[0];

        console.log(`
            Nome: ${usuario.nome},
            Endereço: ${endereco.rua},${endereco.numero}
            Telefone: (${telefone.ddd}) ${telefone.telefone}
        `);

        console.timeEnd('medida-promise');
    }catch(error){
        console.error('ERRO', error);
    }
}

main();