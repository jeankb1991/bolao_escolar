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

// ======================================
// JOGADORES
// ======================================

const jogadoresBrasil = [
    "Vinicius Jr.",
    "Rodrygo",
    "Endrick",
    "Neymar",
    "Raphinha",
    "Lucas Paquetá",
    "Bruno Guimarães",
    "Gabriel Martinelli",
    "Gabriel Magalhães",
    "Marquinhos"
];

const jogadoresEscocia = [
    "Scott McTominay",
    "John McGinn",
    "Andrew Robertson",
    "Billy Gilmour",
    "Che Adams",
    "Lyndon Dykes",
    "Ryan Christie",
    "Kieran Tierney",
    "Callum McGregor",
    "Lewis Ferguson"
];

let jogadorSelecionadoBrasil = "";
let jogadorSelecionadoEscocia = "";

// ======================================
// RENDERIZAR CHIPS
// ======================================

function renderizarChips() {

    const brasil =
        document.getElementById("chips-brasil");

    const escocia =
        document.getElementById("chips-escocia");

    brasil.innerHTML = "";
    escocia.innerHTML = "";

    jogadoresBrasil.forEach(jogador => {

        const chip =
            document.createElement("div");

        chip.className =
            "chip brasil";

        chip.innerText =
            jogador;

        chip.onclick = () =>
            selecionarJogador(
                "brasil",
                jogador,
                chip
            );

        brasil.appendChild(chip);
    });

    const outroBr =
        document.createElement("div");

    outroBr.className =
        "chip brasil";

    outroBr.innerText =
        "Nenhum / Outro";

    outroBr.onclick = () =>
        selecionarJogador(
            "brasil",
            "Nenhum / Outro",
            outroBr
        );

    brasil.appendChild(outroBr);

    jogadoresEscocia.forEach(jogador => {

        const chip =
            document.createElement("div");

        chip.className =
            "chip escocia";

        chip.innerText =
            jogador;

        chip.onclick = () =>
            selecionarJogador(
                "escocia",
                jogador,
                chip
            );

        escocia.appendChild(chip);
    });

    const outroEsc =
        document.createElement("div");

    outroEsc.className =
        "chip escocia";

    outroEsc.innerText =
        "Nenhum / Outro";

    outroEsc.onclick = () =>
        selecionarJogador(
            "escocia",
            "Nenhum / Outro",
            outroEsc
        );

    escocia.appendChild(outroEsc);
}

// ======================================
// SELEÇÃO DOS JOGADORES
// ======================================

function selecionarJogador(
    time,
    jogador,
    chip
) {

    if (time === "brasil") {

        jogadorSelecionadoBrasil =
            jogador;

        document
            .querySelectorAll(
                "#chips-brasil .chip"
            )
            .forEach(c =>
                c.classList.remove(
                    "selected"
                )
            );

    } else {

        jogadorSelecionadoEscocia =
            jogador;

        document
            .querySelectorAll(
                "#chips-escocia .chip"
            )
            .forEach(c =>
                c.classList.remove(
                    "selected"
                )
            );
    }

    chip.classList.add(
        "selected"
    );
}

// ======================================
// CARREGAR APOSTAS
// ======================================

async function carregarApostas() {

    const {
        data,
        error
    } = await supabaseClient
        .from("apostas")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (error) {

        console.error(error);

        return;
    }

    const lista =
        document.getElementById(
            "lista"
        );

    lista.innerHTML = "";

    data.forEach(aposta => {

        lista.innerHTML += `
        <tr>
            <td>${aposta.nome}</td>
            <td>${aposta.brasil} x ${aposta.escocia}</td>
            <td>${aposta.gol_brasil || "-"}</td>
            <td>${aposta.gol_escocia || "-"}</td>
        </tr>
        `;
    });

    document.getElementById(
        "total"
    ).innerText =
        data.length;
}

// ======================================
// REGISTRAR APOSTA
// ======================================

async function apostar() {

    const nome =
        document
        .getElementById("nome")
        .value
        .trim();

    const cpf =
        document
        .getElementById("cpf")
        .value
        .trim();

    const telefone =
        document
        .getElementById("telefone")
        .value
        .trim();

    const brasil =
        document
        .getElementById("brasil")
        .value;

    const escocia =
        document
        .getElementById("haiti")
        .value;

    if (
        !nome ||
        !cpf ||
        !telefone ||
        brasil === "" ||
        escocia === ""
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;
    }

    if (
        !jogadorSelecionadoBrasil ||
        !jogadorSelecionadoEscocia
    ) {

        alert(
            "Selecione o primeiro gol dos dois times."
        );

        return;
    }

    try {

        // CPF duplicado

        const {
            data: cpfExistente,
            error: erroCpf
        } = await supabaseClient
            .from("apostas")
            .select("id")
            .eq("cpf", cpf);

        if (erroCpf) {

            alert(
                erroCpf.message
            );

            return;
        }

        if (
            cpfExistente.length > 0
        ) {

            alert(
                "Este CPF já realizou uma aposta."
            );

            return;
        }

        // INSERIR

        const {
            error
        } = await supabaseClient
            .from("apostas")
            .insert([
                {
                    nome: nome,
                    cpf: cpf,
                    telefone: telefone,

                    brasil:
                        parseInt(
                            brasil
                        ),

                    escocia:
                        parseInt(
                            escocia
                        ),

                    gol_brasil:
                        jogadorSelecionadoBrasil,

                    gol_escocia:
                        jogadorSelecionadoEscocia
                }
            ]);

        if (error) {

            console.error(error);

            alert(
                error.message
            );

            return;
        }

        alert(
            "✅ Aposta registrada com sucesso!"
        );

        document.getElementById(
            "nome"
        ).value = "";

        document.getElementById(
            "cpf"
        ).value = "";

        document.getElementById(
            "telefone"
        ).value = "";

        document.getElementById(
            "brasil"
        ).value = "";

        document.getElementById(
            "haiti"
        ).value = "";

        jogadorSelecionadoBrasil =
            "";

        jogadorSelecionadoEscocia =
            "";

        document
            .querySelectorAll(
                ".chip"
            )
            .forEach(c =>
                c.classList.remove(
                    "selected"
                )
            );

        carregarApostas();

    } catch (erro) {

        console.error(
            erro
        );

        alert(
            "Erro ao registrar aposta."
        );
    }
}

// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderizarChips();

        carregarApostas();
    }
);