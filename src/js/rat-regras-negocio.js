// rat-regras-negocio.js - Regras centrais de negocio do RAT
(function inicializarRegrasNegocio(global) {
    'use strict';

    const TEXTO_CAMPO_OBRIGATORIO = 'Campo Obrigatório';

    const CAMPOS_OBRIGATORIOS_RAT = [
        { nome: 'tecnico', rotulo: 'NOME DO TECNICO' },
        { nome: 'empresa', rotulo: 'EMPRESA PARCEIRA' },
        { nome: 'chamado', rotulo: 'CHAMADO' },
        { nome: 'endereco', rotulo: 'ENDERECO DO CHAMADO' },
        { nome: 'cidade', rotulo: 'CIDADE DO CHAMADO' },
        { nome: 'UF', rotulo: 'UF' },
        { nome: 'data', rotulo: 'DATA DO ATENDIMENTO' },
        { nome: 'inicio', rotulo: 'HORARIO INICIO' },
        { nome: 'termino', rotulo: 'HORARIO FIM' },
        { nome: 'kminicial', rotulo: 'KM INICIAL' },
        { nome: 'kmfinal', rotulo: 'KM FINAL' },
        { nome: 'razao_social', rotulo: 'RAZAO SOCIAL / NOME FANTASIA' },
        { nome: 'nome_responsavel', rotulo: 'NOME DO RESPONSAVEL' },
        { nome: 'patrimonio_a', rotulo: 'N. PATRIMONIO DO EQUIPAMENTO ANTIGO' },
        { nome: 'modelo_a', rotulo: 'MODELO DO EQUIPAMENTO ANTIGO' },
        { nome: 'sintoma', rotulo: 'SINTOMA DO PROBLEMA RELATADO' },
        { nome: 'status_chamado', rotulo: 'STATUS DO CHAMADO' },
        { nome: 'relatorio', rotulo: 'RELATORIO TECNICO - FECHAMENTO' }
    ];

    const CAMPOS_SOMENTE_NUMEROS_RAT = [
        { nome: 'telefone_cliente', rotulo: 'TELEFONE' },
        { nome: 'patrimonio_a', rotulo: 'N. PATRIMONIO DO EQUIPAMENTO ANTIGO' },
        { nome: 'patrimonio_b', rotulo: 'N. PATRIMONIO DO EQUIPAMENTO NOVO' },
        { nome: 'serie_a', rotulo: 'N. SERIE DO EQUIPAMENTO ANTIGO' },
        { nome: 'serie_b', rotulo: 'N. SERIE DO EQUIPAMENTO NOVO' }
    ];

    const MENSAGEM_ERRO_HORARIO = 'HORÁRIO TÉRMINO não pode ser menor que HORÁRIO de Início';
    const MENSAGEM_ERRO_KM = 'KM FINAL não pode ser igual e nem menor que o KM INICIAL.';
    const REGEX_EMAIL_CLIENTE = /^[^\s@]+@[^\s@]+\.com(\.br)?$/i;

    function ehSomenteNumeros(valor) {
        return /^\d+$/.test(String(valor ?? '').trim());
    }

    function removerNaoNumericos(valor) {
        return String(valor ?? '').replace(/\D+/g, '');
    }

    function converterKmParaNumero(valor) {
        const texto = String(valor ?? '').trim();
        if (!ehSomenteNumeros(texto)) return NaN;

        const numero = Number(texto);
        return Number.isSafeInteger(numero) ? numero : NaN;
    }

    function converterHorarioParaMinutos(valor) {
        const texto = String(valor ?? '').trim();
        const match = texto.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
        if (!match) return NaN;

        const horas = Number(match[1]);
        const minutos = Number(match[2]);
        return (horas * 60) + minutos;
    }

    global.RATRegrasNegocio = Object.freeze({
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
    });
})(window);

