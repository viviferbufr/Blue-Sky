
const formulario = document.getElementById("contato-form");
const aviso = document.getElementById("aviso");
const listaMensagens = document.getElementById("listaMensagens");

// Busca as mensagens salvas no navegador
function obterMensagens() {
    const dados = localStorage.getItem("mensagensBlueSky");

    if (dados === null) {
        return [];
    }

    try {
        const mensagens = JSON.parse(dados);
        return Array.isArray(mensagens) ? mensagens : [];
    } catch {
        return [];
    }
}

// Mostra as mensagens na página
function mostrarMensagens() {
    const mensagens = obterMensagens();

    listaMensagens.replaceChildren();
    
    if (mensagens.length === 0) {
        listaMensagens.textContent =
            "Nenhuma mensagem salva ainda.";
        return;
    }

    mensagens.forEach(function(mensagem, indice) {
        const cartao = document.createElement("div");
        cartao.className = "mensagem-card";

        const nome = document.createElement("p");
        nome.textContent = "Nome: " + mensagem.nome;

        const email = document.createElement("p");
        email.textContent = "E-mail: " + mensagem.email;

        const assunto = document.createElement("p");
        assunto.textContent = "Assunto: " + mensagem.assunto;

        const texto = document.createElement("p");
        texto.textContent = "Mensagem: " + mensagem.texto;

        const data = document.createElement("p");
        data.textContent = "Data: " + mensagem.data;

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.textContent = "Excluir mensagem";

        excluir.addEventListener("click", function() {
            const confirmacao = confirm(
                "Deseja excluir esta mensagem?"
            );

            if (confirmacao) {
                const atualizadas = obterMensagens();
                atualizadas.splice(indice, 1);

                localStorage.setItem(
                    "mensagensBlueSky",
                    JSON.stringify(atualizadas)
                );

                mostrarMensagens();
            }
        });

        cartao.append(nome, email, assunto, texto, data, excluir);
        listaMensagens.appendChild(cartao);
    });
}

// Salva quando o formulário é enviado
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const assunto = document.getElementById("assunto").value;
    const texto = document.getElementById("mensagem").value.trim();

    if (nome === "" || email === "" ||
        assunto === "" || texto === "") {
        aviso.textContent = "Preencha todos os campos.";
        return;
    }

    const mensagens = obterMensagens();

    const novaMensagem = {
        nome: nome,
        email: email,
        assunto: assunto,
        texto: texto,
        data: new Date().toLocaleString("pt-BR")
    };

    mensagens.push(novaMensagem);

    try {
        localStorage.setItem(
            "mensagensBlueSky",
            JSON.stringify(mensagens)
        );

        aviso.textContent = "Mensagem salva com sucesso!";

        formulario.reset();
        mostrarMensagens();

    } catch {
        aviso.textContent =
            "Não foi possível salvar. Verifique o armazenamento do navegador.";
    }
});

// Carrega as mensagens ao abrir a página
mostrarMensagens();
