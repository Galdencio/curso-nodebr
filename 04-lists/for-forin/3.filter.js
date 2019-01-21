const { obterPessoas } = require('./service');

Array.prototype.meuFilter = function (callback) {
    const lista = [];
    for(index in this) {
        const item = this[index];
        const resultado = callback(item, index, this);
        if(!resultado) continue;
        lista.push(item);
    }
    return lista;
}

async function main() {
    try {
        const { results } = await obterPessoas('a');
        
        // const familiaLars = results.filter(function (item) {
        //     // por padrão precisa retornar um booleano para informar se deve manter ou remover
        //     // false => remove da lista
        //     // true => mantém
        //     return item.name.toLowerCase().indexOf('lars') !== -1;
        // });

        const familiaLars = results.meuFilter((item, index, lista) => {
            console.log(`index: ${index}`, lista.length);
            return item.name.toLowerCase().indexOf('lars') !== -1;
        });

        const names = familiaLars.map(pessoa => pessoa.name);

        console.log('familiaLars', names);
    } catch (error) {
        console.error('ERRO', error);
    }
}

main();