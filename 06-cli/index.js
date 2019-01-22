const Commander = require('commander');
const Database = require('./database');
const Heroi = require('./heroi');

async function main(){
    Commander
        .version('v1')
        
        .option('-n, --nome [value]', "Nome do herói")
        .option('-p, --poder [value]', "Poder do herói")
        .option('-i, --id [value]', "Id do herói")

        .option('-c, --cadastrar', "Cadastra um novo herói")
        .option('-l, --listar', "Lista um herói")
        .option('-r, --remover', "Remove um herói pelo id")
        .option('-a, --atualizar [value]', "Atualiza um herói pelo id")

        .parse(process.argv);

    const heroi = new Heroi(Commander);
    
    try{
        if(Commander.cadastrar){
            delete heroi.id;
            const resultado = await Database.cadastrar(heroi);
            if(!resultado){
                console.error('Erro ao cadastrar herói');
                return;
            }
            console.log('Herói cadastrado com sucesso!');
        }else if(Commander.listar){
            const resultado = await Database.listar();
            console.log(resultado);
            return;
        }else if(Commander.remover){
            const resultado = await Database.remover(heroi.id);
            if(!resultado){
                console.error('Erro ao remover herói');
                return;
            }
            console.log('Herói removido com sucesso!');
        }else if(Commander.atualizar){
            const idParaAtualizar = parseInt(Commander.atualizar);
            delete heroi.id;

            //remove todas as chaves que estiverem com undefined, null
            const dado = JSON.stringify(heroi);
            const heroiAtualizar = JSON.parse(dado);

            const resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar);
            if(!resultado){
                console.error('Erro ao atualizar herói');
                return;
            }
            console.log('Herói atualizado com sucesso!');
        }
    }catch(error){
        console.error('ERRO', error);
    }
}

main();