(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor(mil % 60000) / 1000;
        return `${min}m e ${sec}s`;
    }
    // Funcao principal que contem todos os metodos que serao executados durante a execucao da solucao
    function patio() {
        // Recupera os dados dos veiculos que estao nas vagas
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        // Salva as informacoes alteradas durante o processo
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        // Adciona novos dados utilizando as informacoes passadas como parametro
        function adcicionar(veiculo, salva, placa, id) {
            var _a, _b;
            placa = veiculo.placa;
            const row = document.createElement("tr");
            // Seta os dados na var. row 
            row.innerHTML = `
            <td> - </td>
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}"> X </button>
            </td> `;
            // Listener de delete dos dados já inseridos
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            // Adiciona os dados na pagina principal utilizando os parametros passados em row
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                salvar([...ler(), veiculo]);
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach(veiculo => adcicionar(veiculo));
            }
        }
        // TODO - Gerar emissao de comprovante para os periodos finalizados
        function comprovante(nome, placa, entrada, tempo) {
            var _a;
            const comprovanteRow = document.createElement("tr");
            comprovanteRow.innerHTML = `
            <td>${nome}</td>
            <td>${placa}</td>
            <td>${entrada}</td>
            <td>${tempo}</td> `;
            (_a = $("#comprovante")) === null || _a === void 0 ? void 0 : _a.appendChild(comprovanteRow);
            //${'#comprovante'}
            print();
        }
        // Remover um veículo que utiliza o estacionamento
        function remover(placa) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veículo ${placa} permaneceu por ${tempo}. Deseja finalizar?`))
                return;
            var comprovanteVeiculo = (ler().filter(veiculo => veiculo.placa));
            comprovante(comprovanteVeiculo[0].nome, comprovanteVeiculo[0].placa, comprovanteVeiculo[0].entrada, tempo);
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        return { ler, adcicionar, remover, salvar, render };
    }
    patio().render();
    // Adicionando evento de click e validando os dados inseridos pelo operador
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("Os campos Nome e Placa são obrigatórios");
            return;
        }
        // Valida se o veiculo(placa) ja se encontra no estacionamento
        let i = 0, placaJaAcicionada = false;
        const placas = patio().ler();
        console.log(`Placa nova ${placa} ${placas.length}`);
        if ((placas.length > 0)) {
            for (i = 0; i < placas.length; i++) {
                if ((placas[i].placa) == placa) {
                    alert(`Placa ${placa} já adicionada! Finalize o período e tente novamente!`);
                    return placaJaAcicionada = true;
                }
            }
        }
        if (!placaJaAcicionada) {
            patio().adcicionar({ nome, placa, entrada: new Date().toISOString() }, true);
        }
    });
})();
