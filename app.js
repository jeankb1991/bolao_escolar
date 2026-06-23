// ======================================
// CONFIGURAÇÃO SUPABASE
// ======================================

const supabaseUrl =
"https://nzwvrmfbdhrzhbfcxkwk.supabase.co";

const supabaseKey =
"sb_publishable_iCVOA8ScMYfzsO4H4Ow8_A_ije9adsH";

const supabaseClient =
supabase.createClient(
    supabaseUrl,
    supabaseKey
);

console.log("Supabase conectado!");

// ======================================
// LISTA DE JOGADORES (10 principais de cada país)
// ======================================

const jogadoresBrasil = [
    "Vinicius Jr.", "Rodrygo", "Endrick", "Neymar", "Raphinha", 
    "Lucas Paquetá", "Bruno Guimarães", "Gabriel Martinelli", "Gabriel Magalhães", "Marquinhos"
];

const jogadoresEscocia = [
    "Scott McTominay", "John McGinn", "Andrew Robertson", "Billy Gilmour", "Che Adams", 
    "Lyndon Dykes", "Ryan Christie", "Kieran Tierney", "Callum McGregor", "Lewis Ferguson"
];

let jogadorSelecionadoBrasil = "";
let jogadorSelecionadoEscocia = "";

// ======================================
// RENDERIZAR CHIPS DOS JOGADORES
// ======================================

function renderizarChips() {
    const containerBrasil = document.getElementById("chips-brasil");
    const containerEscocia = document.getElementById("chips-escocia");

    if (!containerBrasil || !containerEscocia) return;

    containerBrasil.innerHTML = "";
    containerEscocia.innerHTML = "";

    // Chips Brasil
    jogadoresBrasil.forEach(jogador => {
        const chip = document.createElement("div");
        chip.className = "chip brasil";
        chip.innerText = jogador;
        chip.onclick = () => selecionarJogador("brasil", jogador, chip);
        containerBrasil.appendChild(chip);
    });

    const chipOutroBr = document.createElement("div");
    chipOutroBr.className = "chip brasil";
    chipOutroBr.innerText = "Nenhum / Outro";
    chipOutroBr.onclick = () => selecionarJogador("brasil", "Nenhum / Outro", chipOutroBr);
    containerBrasil.appendChild(chipOutroBr);

    // Chips Escócia
    jogadoresEscocia.forEach(jogador => {
        const chip = document.createElement("div");
        chip.className = "chip escocia";
        chip.innerText = jogador;
        chip.onclick = () => selecionarJogador("escocia", jogador, chip);
        containerEscocia.appendChild(chip);
    });

    const chipOutroEsc = document.createElement("div");
    chipOutroEsc.className = "chip escocia";
    chipOutroEsc.innerText = "Nenhum / Outro";
    chipOutroEsc.onclick = () => selecionarJogador("escocia", "Nenhum / Outro", chipOutroEsc);
    containerEscocia.appendChild(chipOutroEsc);
}

function selecionarJogador(time, jogador, elementoChip) {
    if (time === "brasil") {
        jogadorSelecionadoBrasil = jogador;
        document.querySelectorAll("#chips-brasil .chip").forEach(c => c.classList.remove("selected"));
    } else {
        jogadorSelecionadoEscocia = jogador;
        document.querySelectorAll("#chips-escocia .chip").forEach(c => c.classList.remove("selected"));
    }
    elementoChip.classList.add("selected");
}

// ======================================
// TESTE DE CONEXÃO
// ======================================

async function testarConexao() {
    const { data, error } =
    await supabaseClient
        .from("apostas")
        .select("*");

    console.log("Dados conexão teste:", data);
    console.log("Erro conexão teste:", error);
}

testarConexao();

// ======================================
// CARREGAR APOSTAS
// ======================================

async function carregarApostas() {
    const { data, error } =
    await supabaseClient
        .from("apostas")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        document.getElementById("mensagem").innerHTML =
            "❌ Erro ao carregar apostas.";
        return;
    }

    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";

    data.forEach(aposta => {
        let nomeExibido = aposta.nome;
        let golBr = "Sem palpite";
        let golEsc = "Sem palpite";

        // Verifica se os palpites de gols foram concatenados no campo nome
        if (aposta.nome && aposta.nome.includes(" | ")) {
            const partes = aposta.nome.split(" | ");
            nomeExibido = partes[0]; // Nome real do participante
            
            // Procura por palpite do Brasil
            const parteBr = partes.find(p => p.startsWith("Gol BR:"));
            if (parteBr) {
                golBr = parteBr.replace("Gol BR:", "").trim();
            }

            // Procura por palpite da Escócia
            const parteEsc = partes.find(p => p.startsWith("Gol ESC:"));
            if (parteEsc) {
                golEsc = parteEsc.replace("Gol ESC:", "").trim();
            }
        }

        lista.innerHTML += `
            <tr>
                <td class="participante-nome">${nomeExibido}</td>
                <td class="palpite-placar">${aposta.brasil} x ${aposta.haiti}</td>
                <td class="marcador-nome marcador-br">${golBr}</td>
                <td class="marcador-nome marcador-esc">${golEsc}</td>
            </tr>
        `;
    });

    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.innerText = data.length;
    }
}

// ======================================
// REGISTRAR APOSTA
// ======================================

async function apostar() {
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const brasilInput = document.getElementById("brasil");
    const haitiInput = document.getElementById("haiti");
    const brasilVal = brasilInput.value.trim();
    const haitiVal = haitiInput.value.trim();

    // Validação robusta: verifica cada campo individualmente
    const camposFaltando = [];
    if (!nome) camposFaltando.push("Nome Completo");
    if (!cpf) camposFaltando.push("CPF");
    if (!telefone) camposFaltando.push("Telefone");
    if (brasilVal === "" || brasilVal === null) camposFaltando.push("Placar do Brasil");
    if (haitiVal === "" || haitiVal === null) camposFaltando.push("Placar da Escócia");

    if (camposFaltando.length > 0) {
        alert("Preencha os seguintes campos:\n• " + camposFaltando.join("\n• "));
        return;
    }

    const brasil = brasilVal;
    const haiti = haitiVal;

    if (!jogadorSelecionadoBrasil || !jogadorSelecionadoEscocia) {
        alert("Por favor, selecione quem fará o primeiro gol de cada time (ou selecione 'Nenhum / Outro').");
        return;
    }

    // Cria a string composta para salvar no banco de dados de forma compatível
    const nomeComposto = `${nome} | Gol BR: ${jogadorSelecionadoBrasil} | Gol ESC: ${jogadorSelecionadoEscocia}`;

    try {
        // Verifica se o CPF já existe
        const { data: existente, error: erroBusca } =
            await supabaseClient
                .from("apostas")
                .select("cpf")
                .eq("cpf", cpf);

        if (erroBusca) {
            console.error(erroBusca);
            alert(erroBusca.message);
            return;
        }

        if (existente.length > 0) {
            alert("Este CPF já realizou uma aposta.");
            return;
        }

        // Salvar aposta no banco
        const { error } =
            await supabaseClient
                .from("apostas")
                .insert([
                    {
                        nome: nomeComposto,
                        cpf: cpf,
                        telefone: telefone,
                        brasil: parseInt(brasil),
                        haiti: parseInt(haiti) // Placar da Escócia
                    }
                ]);

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        document.getElementById("mensagem").innerHTML =
            "✅ Aposta registrada com sucesso! Boa sorte!";

        // Limpar inputs
        document.getElementById("nome").value = "";
        document.getElementById("cpf").value = "";
        document.getElementById("telefone").value = "";
        document.getElementById("brasil").value = "";
        document.getElementById("haiti").value = "";

        // Resetar seleções de jogadores
        jogadorSelecionadoBrasil = "";
        jogadorSelecionadoEscocia = "";
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));

        carregarApostas();

    } catch (erro) {
        console.error(erro);
        alert("Erro inesperado ao registrar aposta.");
    }
}

// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    renderizarChips();
    carregarApostas();
});