const { obterPessoas } = require('./service');

Array.prototype.meuReduce = function (callback, valorInicial) {
    let valorFinal = typeof valorInicial !== undefined ? valorInicial : this[0];
    for(let index = 0; index <= this.length - 1; index++){
        valorFinal = callback(valorFinal, this[index], this);
    }
    return valorFinal;
};

async function main() {
    try {
        const { results } = await obterPessoas('a');
        const pesos = results.map(item => isNaN(item.mass) ? 0 : parseInt(item.mass));
        
        // const total = pesos.reduce((acumulado, proximo) => acumulado + proximo, 0);

        const minhaLista = [
            ['Galdencio', 'Leorne'],
            ['NodeBR', 'Nerdzão']
        ];
        const total = minhaLista.meuReduce((acumulado, proximo) => {
            return acumulado.concat(proximo);
        }, []).join(', ');

        console.log('total', total);
    } catch (error) {
        console.error('ERRO', error);
    }
}

main();