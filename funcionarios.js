let funcionarios = [];

function adicionarFuncionario() {
    let nome = document.getElementById("nomeFuncionario").value;

    if (nome === "") {
        alert("Digite um nome");
        return;
    }

    funcionarios.push({
        nome: nome,
        salario: 2000,
        horasExtras: 0,
        ferias: []
    });

    document.getElementById("nomeFuncionario").value = "";

    atualizarTudo();
}

function atualizarTudo() {
    atualizarLista();
    atualizarSelect();
}

// LISTA
function atualizarLista() {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    funcionarios.forEach(f => {
        let li = document.createElement("li");
        li.textContent = f.nome;
        lista.appendChild(li);
    });
}

// SELECT
function atualizarSelect() {
    let select = document.getElementById("selectFuncionario");
    select.innerHTML = "";

    funcionarios.forEach((f, i) => {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = f.nome;
        select.appendChild(option);
    });
}

// pegar funcionário selecionado
function getFuncionario() {
    let select = document.getElementById("selectFuncionario");

    if (select.value === "") return null;

    return funcionarios[select.value];
}

// ✔ HOLERITE
function verHolerite() {
    let f = getFuncionario();

    if (!f) {
        alert("Selecione um funcionário");
        return;
    }

    let total = f.salario + (f.horasExtras * 20);

    alert(
        "HOLERITE\n\n" +
        "Nome: " + f.nome +
        "\nSalário base: R$ " + f.salario +
        "\nHoras extras: " + f.horasExtras +
        "\nTotal: R$ " + total
    );
}

// ✔ HORA EXTRA
function adicionarHoraExtra() {
    let f = getFuncionario();

    if (!f) {
        alert("Selecione um funcionário");
        return;
    }

    f.horasExtras += 1;

    alert("Hora extra registrada para " + f.nome);
}

// ✔ FÉRIAS
function agendarFerias() {
    let f = getFuncionario();
    let data = document.getElementById("dataFerias").value;

    if (!f) {
        alert("Selecione um funcionário");
        return;
    }

    if (data === "") {
        alert("Escolha uma data");
        return;
    }

    f.ferias.push(data);

    alert("Férias agendadas para " + f.nome);
}