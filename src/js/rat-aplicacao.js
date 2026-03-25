// rat-aplicacao.js - Orquestracao principal do RAT ARKLOK

// --- CONSTANTES ---
const FORM_ID = 'chamadoForm';
const CANVAS_TECNICO_ID = 'assinatura';
const CANVAS_CLIENTE_ID = 'assinaturaCliente';
const BOTAO_PDF_ID = 'btnPDF';
const BOTAO_SCRIPT_ID = 'btnScript';
const LIMPAR_TECNICO_ID = 'limparAssinatura';
const LIMPAR_CLIENTE_ID = 'limparAssinaturaCliente';
const BREAKPOINT_MOBILE = 900;
const QUERY_TELA_MOBILE = '(max-width: ' + BREAKPOINT_MOBILE + 'px)';

if (!window.RATRegrasNegocio) {
    throw new Error('Arquivo de regras de negocio nao carregado: src/js/rat-regras-negocio.js');
}

const {
    TEXTO_CAMPO_OBRIGATORIO,
    CAMPOS_OBRIGATORIOS_RAT,
    CAMPOS_SOMENTE_NUMEROS_RAT,
    MENSAGEM_ERRO_HORARIO,
    MENSAGEM_ERRO_KM,
    REGEX_EMAIL_CLIENTE,
    ehSomenteNumeros,
    removerNaoNumericos,
    converterKmParaNumero,
    converterHorarioParaMinutos
} = window.RATRegrasNegocio;
let temporizadorResizeTela = null;
let deteccaoTelaInicializada = false;
let mediaQueryTelaMobile = null;
function obterLarguraViewport() {
    return window.innerWidth || document.documentElement.clientWidth || 0;
}
function dispositivoProvavelMobile() {
    const suportaMatchMedia = typeof window.matchMedia === 'function';
    const ponteiroGrosso = suportaMatchMedia && window.matchMedia('(pointer: coarse)').matches;
    const semHover = suportaMatchMedia && window.matchMedia('(hover: none)').matches;
    const touchPoints = Number(navigator.maxTouchPoints || 0);
    const userAgentDataMobile = typeof navigator.userAgentData?.mobile === 'boolean'
        ? navigator.userAgentData.mobile
        : false;
    const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return userAgentDataMobile || uaMobile || (ponteiroGrosso && semHover) || touchPoints > 1;
}
function detectarTipoTela() {
    const larguraViewport = obterLarguraViewport();
    const emViewportMobile = larguraViewport <= BREAKPOINT_MOBILE
        || (typeof window.matchMedia === 'function' && window.matchMedia(QUERY_TELA_MOBILE).matches);
    const emDispositivoMobile = dispositivoProvavelMobile();
    if (emViewportMobile) {
        return 'mobile';
    }
    if (emDispositivoMobile && larguraViewport <= 1100) {
        return 'mobile';
    }
    return 'desktop';
}
function aplicarContextoTelaResponsiva() {
    const body = document.body;
    if (!body) return;
    const tipoTela = detectarTipoTela();
    body.dataset.view = tipoTela;
    body.classList.toggle('view-mobile', tipoTela === 'mobile');
    body.classList.toggle('view-desktop', tipoTela === 'desktop');
    document.documentElement.dataset.view = tipoTela;
    const form = document.getElementById(FORM_ID);
    if (form) {
        form.dataset.view = tipoTela;
    }
}
function reagirMudancaViewport() {
    clearTimeout(temporizadorResizeTela);
    temporizadorResizeTela = setTimeout(aplicarContextoTelaResponsiva, 120);
}
function inicializarContextoTelaResponsiva() {
    if (deteccaoTelaInicializada) {
        aplicarContextoTelaResponsiva();
        return;
    }
    deteccaoTelaInicializada = true;
    aplicarContextoTelaResponsiva();
    if (typeof window.matchMedia === 'function') {
        mediaQueryTelaMobile = window.matchMedia(QUERY_TELA_MOBILE);
        if (typeof mediaQueryTelaMobile.addEventListener === 'function') {
            mediaQueryTelaMobile.addEventListener('change', aplicarContextoTelaResponsiva);
        } else if (typeof mediaQueryTelaMobile.addListener === 'function') {
            mediaQueryTelaMobile.addListener(aplicarContextoTelaResponsiva);
        }
    }
    window.addEventListener('resize', reagirMudancaViewport);
    window.addEventListener('orientationchange', aplicarContextoTelaResponsiva);
}

function configurarAberturaAutomaticaPicker(form) {
    if (!form) return;

    const seletorCamposPicker = [
        'input[type="date"]',
        'input[type="time"]',
        'input[type="datetime-local"]',
        'input[type="month"]',
        'input[type="week"]'
    ].join(', ');

    const camposPicker = form.querySelectorAll(seletorCamposPicker);

    const tentarAbrirPicker = (campo) => {
        if (!campo || campo.disabled || campo.readOnly) return;
        if (typeof campo.showPicker !== 'function') return;

        const agora = Date.now();
        const ultimaAbertura = Number(campo.dataset.ultimaAberturaPicker || 0);
        if (agora - ultimaAbertura < 160) return;

        campo.dataset.ultimaAberturaPicker = String(agora);

        try {
            campo.showPicker();
        } catch (_erro) {
            // Alguns navegadores exigem gesto especifico ou nao suportam showPicker.
        }
    };

    camposPicker.forEach((campo) => {
        if (campo.dataset.pickerAutoConfigurado === '1') return;
        campo.dataset.pickerAutoConfigurado = '1';

        const abrirPicker = () => tentarAbrirPicker(campo);

        if (window.PointerEvent) {
            campo.addEventListener('pointerdown', abrirPicker);
        } else {
            campo.addEventListener('mousedown', abrirPicker);
            campo.addEventListener('touchstart', abrirPicker, { passive: true });
        }

        campo.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                tentarAbrirPicker(campo);
            }
        });
    });
}
// --- CONTADORES DE CARACTERES ---
function configurarContador(inputId, contadorId, maxLength) {
    const input = document.getElementById(inputId);
    const contador = document.getElementById(contadorId);

    if (!input || !contador) return;

    const atualizarContador = () => {
        contador.textContent = `${input.value.length} / ${maxLength} caracteres`;
    };

    input.addEventListener('input', atualizarContador);
    atualizarContador();
}

configurarContador('outros', 'contador-outros', 15);
configurarContador('observacoes', 'contador', 15);
configurarContador('sintoma', 'contador-sintoma', 200);
configurarContador('relatorio', 'contador-relatorio', 900);

// --- HELPERS ---
function obterValorCampo(form, nomeCampo) {
    const campo = form.elements[nomeCampo];
    if (!campo || typeof campo.value !== 'string') return '';
    return campo.value.trim();
}

function canvasPossuiAssinatura(canvas) {
    if (!canvas) return false;
    const contexto = canvas.getContext('2d');
    if (!contexto) return false;

    const pixels = contexto.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] !== 0) return true;
    }
    return false;
}

let validacoesUIRat = null;

function inicializarValidacoesUIRat() {
    if (!window.RATValidacoesUI || typeof window.RATValidacoesUI.criarValidacoesRat !== 'function') {
        throw new Error('Arquivo de validacoes nao carregado: src/js/rat-validacoes-formulario.js');
    }

    validacoesUIRat = window.RATValidacoesUI.criarValidacoesRat({
        camposObrigatorios: CAMPOS_OBRIGATORIOS_RAT,
        camposSomenteNumeros: CAMPOS_SOMENTE_NUMEROS_RAT,
        textoCampoObrigatorio: TEXTO_CAMPO_OBRIGATORIO,
        mensagemErroHorario: MENSAGEM_ERRO_HORARIO,
        mensagemErroKm: MENSAGEM_ERRO_KM,
        regexEmailCliente: REGEX_EMAIL_CLIENTE,
        ehSomenteNumeros,
        converterHorarioParaMinutos,
        converterKmParaNumero,
        canvasPossuiAssinatura,
        getAssinaturaTecnico: () => assinaturaTecnico,
        getAssinaturaCliente: () => assinaturaCliente,
        canvasTecnicoId: CANVAS_TECNICO_ID,
        canvasClienteId: CANVAS_CLIENTE_ID,
        botaoLimparClienteId: LIMPAR_CLIENTE_ID
    });
}

function obterValidacoesUIRat() {
    if (!validacoesUIRat) {
        throw new Error('Validacoes do formulario nao inicializadas.');
    }
    return validacoesUIRat;
}

function validarCamposSomenteNumeros(form, exibirAvisoNativo = true) {
    return obterValidacoesUIRat().validarCamposSomenteNumeros(form, exibirAvisoNativo);
}

function validarEmailCliente(form, exibirAvisoNativo = true) {
    return obterValidacoesUIRat().validarEmailCliente(form, exibirAvisoNativo);
}

function validarAssinaturasObrigatorias(form, exibirAvisoNativo = true) {
    return obterValidacoesUIRat().validarAssinaturasObrigatorias(form, exibirAvisoNativo);
}

function validarHorarioInicioFim(form, exibirAvisoNativo = true) {
    return obterValidacoesUIRat().validarHorarioInicioFim(form, exibirAvisoNativo);
}

function validarKmInicialFinal(form, exibirAvisoNativo = true) {
    return obterValidacoesUIRat().validarKmInicialFinal(form, exibirAvisoNativo);
}

function validarCamposObrigatorios(form) {
    return obterValidacoesUIRat().validarCamposObrigatorios(form);
}

function aplicarIndicacaoVisualCamposObrigatorios(form) {
    return obterValidacoesUIRat().aplicarIndicacaoVisualCamposObrigatorios(form);
}

function aplicarPlaceholderCamposObrigatorios(form) {
    return obterValidacoesUIRat().aplicarPlaceholderCamposObrigatorios(form);
}

// --- FUNCAO PARA GERAR SCRIPT DE FECHAMENTO ---
function gerarScriptFechamento() {
    const form = document.getElementById(FORM_ID);
    if (!form) return;
    if (!validarCamposObrigatorios(form)) return;

    const dados = {
        tecnico: obterValorCampo(form, 'tecnico'),
        parceiro: obterValorCampo(form, 'empresa'),
        kminicial: obterValorCampo(form, 'kminicial'),
        kmfinal: obterValorCampo(form, 'kmfinal'),
        cliente: obterValorCampo(form, 'razao_social'),
        endereco: obterValorCampo(form, 'endereco'),
        chamado: obterValorCampo(form, 'chamado'),
        data: obterValorCampo(form, 'data'),
        inicio: obterValorCampo(form, 'inicio'),
        termino: obterValorCampo(form, 'termino'),
        problema: obterValorCampo(form, 'sintoma'),
        atividade: obterValorCampo(form, 'relatorio'),
        patrimonio: obterValorCampo(form, 'patrimonio_a'),
        serie: obterValorCampo(form, 'serie_a'),
        modelo: obterValorCampo(form, 'modelo_a'),
        status: obterValorCampo(form, 'status_chamado'),
        acompanhante: obterValorCampo(form, 'nome_responsavel')
    };

    const texto = `
SCRIPT DE FECHAMENTO
E OBRIGATORIO EM TODO AGENDAMENTO TECNICO O ENVIO DO SCRIPT PREENCHIDO VIA WHATSAPP, JUNTO COM A RAT ASSINADA.

TECNICO: ${dados.tecnico}
PARCEIRO: ${dados.parceiro}
KM INICIAL: ${dados.kminicial}
KM FINAL: ${dados.kmfinal}
CLIENTE: ${dados.cliente}
ENDERECO: ${dados.endereco}
CHAMADO: ${dados.chamado}
DATA DO ATENDIMENTO: ${dados.data}
INICIO DA ATIVIDADE: ${dados.inicio}
TERMINO DA ATIVIDADE: ${dados.termino}
PROBLEMA IDENTIFICADO: ${dados.problema}
ATIVIDADE REALIZADA: ${dados.atividade}
OBS.: NAO FOI RETIRADO NENHUM EQUIPAMENTO OU PERIFERICO DO CLIENTE.
N. PATRIMONIO/SERIAL: ${dados.patrimonio} / ${dados.serie}
MODELO DO EQUIPAMENTO: ${dados.modelo}
STATUS DO CHAMADO: ${dados.status}
NOME DE QUEM ACOMPANHOU A ATIVIDADE: ${dados.acompanhante}
    `.toUpperCase().trim();

    const emCelular = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (emCelular) {
        exibirModalCelular(texto);
    } else {
        abrirJanelaDesktop(texto);
    }
}

function exibirModalCelular(texto) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.6); display: flex; align-items: center;
        justify-content: center; z-index: 9999;
    `;

    const balao = document.createElement('div');
    balao.style.cssText = `
        background-color: white; padding: 20px; border-radius: 15px;
        max-width: 90%; max-height: 85%; overflow-y: auto; font-size: 12px;
        font-family: monospace; white-space: pre-wrap;
    `;
    balao.textContent = texto;

    const botaoCompartilhar = criarBotao('COMPARTILHAR', () => compartilharTexto(texto));
    const botaoFechar = criarBotao('FECHAR', () => document.body.removeChild(overlay));

    balao.appendChild(botaoCompartilhar);
    balao.appendChild(botaoFechar);
    overlay.appendChild(balao);
    document.body.appendChild(overlay);
}

function abrirJanelaDesktop(texto) {
    const novaJanela = window.open('', 'ScriptFechamento', 'width=700,height=600');
    if (!novaJanela) {
        alert('Nao foi possivel abrir a janela do script. Verifique o bloqueador de pop-up.');
        return;
    }

    const docJanela = novaJanela.document;
    docJanela.title = 'SCRIPT DE FECHAMENTO';
    if (!docJanela.body) {
        docJanela.documentElement.appendChild(docJanela.createElement('body'));
    }

    while (docJanela.body.firstChild) {
        docJanela.body.removeChild(docJanela.body.firstChild);
    }

    docJanela.body.style.margin = '20px';
    docJanela.body.style.backgroundColor = '#ffffff';

    const pre = docJanela.createElement('pre');
    pre.style.fontFamily = 'monospace';
    pre.style.fontSize = '16px';
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.margin = '0';
    pre.textContent = texto;

    docJanela.body.appendChild(pre);
}

function criarBotao(texto, onClick) {
    const botao = document.createElement('button');
    botao.textContent = texto;
    botao.style.cssText = `
        margin-top: 15px; font-size: 18px; background-color: #007bff;
        color: white; border: none; border-radius: 8px; padding: 10px 15px;
        display: block; margin-left: auto; margin-right: auto; cursor: pointer;
    `;
    botao.addEventListener('click', onClick);
    return botao;
}

async function compartilharTexto(texto) {
    if (navigator.share) {
        try {
            await navigator.share({ title: 'Script de Fechamento', text: texto });
        } catch (_err) {
            alert('Compartilhamento cancelado ou nao suportado.');
        }
    } else {
        alert('Este dispositivo nao suporta compartilhamento direto.');
    }
}

// --- CONFIGURACAO DE ASSINATURAS ---
class AssinaturaCanvas {
    constructor(canvasId, limparId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas?.getContext('2d');
        this.desenhando = false;
        this.lastX = 0;
        this.lastY = 0;

        if (this.canvas && this.ctx) {
            this.inicializar();
            this.configurarEventos();
            this.configurarLimpar(limparId);
        }
    }

    inicializar() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = 150;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
    }

    configurarEventos() {
        this.canvas.addEventListener('mousedown', (e) => this.iniciarDesenho(e));
        this.canvas.addEventListener('mouseup', () => this.pararDesenho());
        this.canvas.addEventListener('mouseout', () => this.pararDesenho());
        this.canvas.addEventListener('mousemove', (e) => this.desenhar(e));

        this.canvas.addEventListener('touchstart', (e) => this.iniciarDesenhoToque(e), { passive: false });
        this.canvas.addEventListener('touchend', () => this.pararDesenho());
        this.canvas.addEventListener('touchmove', (e) => this.desenhar(e), { passive: false });
    }

    iniciarDesenho(e) {
        this.desenhando = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    iniciarDesenhoToque(e) {
        this.desenhando = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.touches[0].clientX - rect.left;
        this.lastY = e.touches[0].clientY - rect.top;
        e.preventDefault();
    }

    pararDesenho() {
        this.desenhando = false;
    }

    desenhar(e) {
        if (!this.desenhando) return;

        if (e.touches) {
            e.preventDefault();
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        const dx = x - this.lastX;
        const dy = y - this.lastY;
        if (Math.sqrt(dx * dx + dy * dy) > 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.lastX = x;
            this.lastY = y;
        }
    }

    configurarLimpar(limparId) {
        const botaoLimpar = document.getElementById(limparId);
        if (botaoLimpar) {
            botaoLimpar.addEventListener('click', () => this.limpar());
        }
    }

    limpar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const assinaturaTecnico = new AssinaturaCanvas(CANVAS_TECNICO_ID, LIMPAR_TECNICO_ID);
const assinaturaCliente = new AssinaturaCanvas(CANVAS_CLIENTE_ID, LIMPAR_CLIENTE_ID);
inicializarValidacoesUIRat();

// --- GERAR PDF ---
function gerarPDF() {
    const form = document.getElementById(FORM_ID);
    if (!form) return;
    if (!validarCamposObrigatorios(form)) return;
    if (!window.RATPdf || typeof window.RATPdf.gerarPdfRat !== 'function') {
        alert('Modulo de PDF nao carregado.');
        return;
    }
    if (!window.jspdf) {
        alert('Biblioteca jsPDF nao encontrada.');
        return;
    }

    window.RATPdf.gerarPdfRat({
        form,
        obterValorCampo,
        assinaturaTecnico,
        assinaturaCliente,
        canvasPossuiAssinatura
    });
}
// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    inicializarContextoTelaResponsiva();

    const form = document.getElementById(FORM_ID);
    if (form) {
        configurarAberturaAutomaticaPicker(form);
        aplicarIndicacaoVisualCamposObrigatorios(form);
        aplicarPlaceholderCamposObrigatorios(form);

        const campoInicio = form.elements.inicio;
        const campoTermino = form.elements.termino;
        if (campoInicio && campoTermino) {
            const validarHorarioEmTempoReal = () => validarHorarioInicioFim(form, false);
            campoInicio.addEventListener('input', validarHorarioEmTempoReal);
            campoInicio.addEventListener('change', validarHorarioEmTempoReal);
            campoTermino.addEventListener('input', validarHorarioEmTempoReal);
            campoTermino.addEventListener('change', validarHorarioEmTempoReal);
        }

        const nomesCamposSomenteNumeros = [
            'telefone_cliente',
            'patrimonio_a',
            'patrimonio_b',
            'serie_a',
            'serie_b'
        ];
        const sanitizarCampoSomenteNumeros = (campo) => {
            if (!campo || typeof campo.value !== 'string') return;
            const somenteDigitos = removerNaoNumericos(campo.value);
            if (campo.value !== somenteDigitos) {
                campo.value = somenteDigitos;
            }
        };
        nomesCamposSomenteNumeros.forEach((nomeCampo) => {
            const campo = form.elements[nomeCampo];
            if (!campo) return;

            const validarEmTempoReal = () => {
                sanitizarCampoSomenteNumeros(campo);
                validarCamposSomenteNumeros(form, false);
            };
            campo.addEventListener('input', validarEmTempoReal);
            campo.addEventListener('change', validarEmTempoReal);
        });

        const campoEmailCliente = form.elements.email_cliente;
        if (campoEmailCliente) {
            const validarEmailEmTempoReal = () => validarEmailCliente(form, false);
            campoEmailCliente.addEventListener('input', validarEmailEmTempoReal);
            campoEmailCliente.addEventListener('change', validarEmailEmTempoReal);
        }

        const revalidarAssinaturasAposEdicao = () => {
            const mensagemAssinaturas = form.querySelector('#mensagem-erro-assinaturas');
            if (mensagemAssinaturas) {
                validarAssinaturasObrigatorias(form, false);
            }
        };
        if (assinaturaTecnico?.canvas) {
            assinaturaTecnico.canvas.addEventListener('mouseup', revalidarAssinaturasAposEdicao);
            assinaturaTecnico.canvas.addEventListener('touchend', revalidarAssinaturasAposEdicao);
        }
        if (assinaturaCliente?.canvas) {
            assinaturaCliente.canvas.addEventListener('mouseup', revalidarAssinaturasAposEdicao);
            assinaturaCliente.canvas.addEventListener('touchend', revalidarAssinaturasAposEdicao);
        }

        const campoKmInicial = form.elements.kminicial;
        const campoKmFinal = form.elements.kmfinal;
        if (campoKmInicial && campoKmFinal) {
            const sanitizarKm = (campo) => {
                if (!campo || typeof campo.value !== 'string') return;
                const somenteDigitos = removerNaoNumericos(campo.value);
                if (campo.value !== somenteDigitos) {
                    campo.value = somenteDigitos;
                }
            };

            campoKmInicial.addEventListener('input', () => {
                sanitizarKm(campoKmInicial);
                validarKmInicialFinal(form, false);
            });
            campoKmInicial.addEventListener('change', () => {
                sanitizarKm(campoKmInicial);
                validarKmInicialFinal(form, false);
            });
            campoKmFinal.addEventListener('input', () => {
                sanitizarKm(campoKmFinal);
                validarKmInicialFinal(form, false);
            });
            campoKmFinal.addEventListener('change', () => {
                sanitizarKm(campoKmFinal);
                validarKmInicialFinal(form, false);
            });
        }
    }

    const botaoScript = document.getElementById(BOTAO_SCRIPT_ID);
    if (botaoScript) {
        botaoScript.addEventListener('click', gerarScriptFechamento);
    }

    const botaoPDF = document.getElementById(BOTAO_PDF_ID);
    if (botaoPDF) {
        botaoPDF.addEventListener('click', gerarPDF);
    }
});









