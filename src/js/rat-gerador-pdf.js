// rat-gerador-pdf.js - Modulo de geracao de PDF do RAT
(function inicializarModuloPdf(global) {
    'use strict';

// --- GERAR PDF ---
function gerarPdfRat(config = {}) {
    const { form, obterValorCampo, assinaturaTecnico, assinaturaCliente, canvasPossuiAssinatura } = config;
    if (!form || typeof obterValorCampo !== 'function') return false;
    if (!global.jspdf) return false;
const { jsPDF } = global.jspdf;
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });

    const vermelho = [200, 0, 0];

    const valorCampo = (nomeCampo) => obterValorCampo(form, nomeCampo);
    const marcado = (nomeCampo) => Boolean(form.elements[nomeCampo]?.checked);

    const escreverValorLinha = (valor, x, y, maxWidth, fontSize = 8.5) => {
        const texto = String(valor || '').trim();
        if (!texto) return;

        const fonteOriginal = doc.getFontSize();
        doc.setFontSize(fontSize);

        let textoFinal = texto;
        if (maxWidth && doc.getTextWidth(textoFinal) > maxWidth) {
            const sufixo = '...';
            while (textoFinal.length > 0 && doc.getTextWidth(`${textoFinal}${sufixo}`) > maxWidth) {
                textoFinal = textoFinal.slice(0, -1);
            }
            textoFinal = `${textoFinal}${sufixo}`;
        }

        doc.text(textoFinal, x, y);
        doc.setFontSize(fonteOriginal);
    };

    const escreverAreaTexto = (valor, x, y, largura, altura, lineHeight, fontSize = 8.5) => {
        const texto = String(valor || '').trim();
        if (!texto) return;

        const fonteOriginal = doc.getFontSize();
        doc.setFontSize(fontSize);
        const linhas = doc.splitTextToSize(texto, largura - 2);
        const maxLinhas = Math.max(1, Math.floor((altura - 2) / lineHeight));
        const render = linhas.slice(0, maxLinhas);
        render.forEach((linha, idx) => {
            doc.text(linha, x + 1, y + 3.5 + (idx * lineHeight));
        });
        doc.setFontSize(fonteOriginal);
    };

    const desenharCheckbox = (x, y, selecionado) => {
        doc.rect(x, y, 3, 3);
        if (selecionado) {
            const larguraOriginal = doc.getLineWidth();
            doc.setLineWidth(0.45);
            doc.line(x + 0.5, y + 1.6, x + 1.2, y + 2.4);
            doc.line(x + 1.2, y + 2.4, x + 2.5, y + 0.6);
            doc.setLineWidth(larguraOriginal);
        }
    };

    const desenharTituloBarra = (x, y, w, h, titulo, tamanhoFonte = 9) => {
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, w, h);
        doc.setFillColor(vermelho[0], vermelho[1], vermelho[2]);
        doc.rect(x, y, w, h, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(tamanhoFonte);
        doc.setTextColor(255, 255, 255);
        doc.text(titulo, x + (w / 2), y + 3.5, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
    };

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    // Titulo principal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.text('RAT (RELATÓRIO ATENDIMENTO TÉCNICO)', 105, 20, { align: 'center' });

    // Bloco superior
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);

    doc.rect(10, 30, 95, 5);
    doc.setFillColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.rect(10, 30, 38, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('NOME DO TÉCNICO:', 12, 34.7);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    escreverValorLinha(valorCampo('tecnico'), 49, 34.7, 54, 8.5);

    doc.rect(105, 30, 95, 5);
    doc.setFillColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.rect(105, 30, 38, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('EMPRESA PARCEIRA:', 107, 34.7);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    escreverValorLinha(valorCampo('empresa'), 144, 34.7, 54, 8.5);

    doc.rect(10, 37, 51.3, 5);
    doc.setFillColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.rect(10, 37, 20.52, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CHAMADO:', 11, 41.7);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    escreverValorLinha(valorCampo('chamado'), 31, 41.7, 29, 8.5);

    doc.rect(61.3, 37, 72.2, 5);
    doc.setFillColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.rect(61.3, 37, 43.32, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DATA DO ATENDIMENTO:', 63.3, 41.7);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    escreverValorLinha(valorCampo('data'), 105, 41.7, 27, 8.5);

    doc.rect(133.5, 37, 66.5, 5);
    doc.setFillColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.rect(133.5, 37, 20, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('HORARIO:', 135.5, 41.7);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text('INICIO :', 154.5, 41.7);
    doc.text('FIM :', 177.8, 41.7);
    escreverValorLinha(valorCampo('inicio'), 165.6, 41.7, 9.8, 8.5);
    escreverValorLinha(valorCampo('termino'), 186.8, 41.7, 11.2, 8.5);

    doc.setFontSize(9);
    doc.text('ASSINATURA DO TÉCNICO / RESPONSÁVEL:', 56.2, 51);
    doc.setLineWidth(0.2);
    doc.line(123.8, 51, 188.8, 51);
    if (assinaturaTecnico?.canvas && canvasPossuiAssinatura(assinaturaTecnico.canvas)) {
        doc.addImage(assinaturaTecnico.canvas.toDataURL('image/png'), 'PNG', 123.8, 42.2, 30, 9.5);
    }

    // DADOS DO CLIENTE
    doc.setLineWidth(0.3);
    doc.rect(10, 53, 190, 33);
    desenharTituloBarra(10, 53, 190, 5, 'DADOS DO CLIENTE');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('RAZAO SOCIAL / NOME FANTASIA:  ', 12, 62);
    escreverValorLinha(valorCampo('razao_social'), 72, 62, 126, 8.5);
    doc.text('NOME DO RESPONSAVEL: ', 12, 69);
    escreverValorLinha(valorCampo('nome_responsavel'), 53, 69, 145, 8.5);
    doc.text('TELEFONE:', 12, 76);
    escreverValorLinha(valorCampo('telefone_cliente'), 31, 76, 52, 8.5);
    doc.text('E-MAIL:', 86, 76);
    escreverValorLinha(valorCampo('email_cliente'), 101, 76, 97, 8.5);
    doc.text('CARGO:', 12, 83);
    escreverValorLinha(valorCampo('cargo_cliente'), 25, 83, 56, 8.5);
    doc.text('DEPARTAMENTO:', 84, 83);
    escreverValorLinha(valorCampo('depto_cliente'), 113, 83, 85, 8.5);

    // Bloco equipamento / servico
    const retiradoLab = valorCampo('retirado_lab').toUpperCase();
    const yLinhaServicos1 = 95;
    const yCheckboxServicos1 = 91.3;
    const yLinhaServicos2 = 102;
    const yCheckboxServicos2 = 98.3;

    doc.text('RETIRADO PARA LABORATORIO:', 16, yLinhaServicos1);
    escreverValorLinha(retiradoLab, 68.5, yLinhaServicos1, 7, 8.5);

    doc.text('SUBSTITUICAO OU TROCA:', 74.5, yLinhaServicos1);
    desenharCheckbox(120.8, yCheckboxServicos1, marcado('substituicao_troca'));

    doc.text('UPGRADE (ATUALIZACAO SSD, MEMORIA):', 127.5, yLinhaServicos1);
    desenharCheckbox(195.2, yCheckboxServicos1, marcado('upgrade'));

    doc.text('NOTEBOOK:', 16, yLinhaServicos2);
    desenharCheckbox(35.5, yCheckboxServicos2, marcado('notebook'));
    doc.text('DESKTOP:', 44, yLinhaServicos2);
    desenharCheckbox(61.4, yCheckboxServicos2, marcado('desktop'));
    doc.text('IMPRESSORA:', 69.5, yLinhaServicos2);
    desenharCheckbox(92.9, yCheckboxServicos2, marcado('impressora'));
    doc.text('MOBILE:', 100.8, yLinhaServicos2);
    desenharCheckbox(115.2, yCheckboxServicos2, marcado('mobile'));
    doc.text('OUTROS:', 123.5, yLinhaServicos2);
    escreverValorLinha(valorCampo('outros'), 138, yLinhaServicos2, 58, 8.5);

    // DADOS DOS EQUIPAMENTOS
    desenharTituloBarra(10, 105.4, 190, 5, 'DADOS DO (S) EQUIPAMENTO (S)');

    doc.rect(10, 110.8, 190, 5);
    doc.setFillColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.rect(10, 110.8, 95, 5, 'F');
    doc.rect(105, 110.8, 95, 5, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.line(105, 110.8, 105, 115.8);
    doc.setDrawColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('EQUIPAMENTO ANTIGO', 57.5, 115.3, { align: 'center' });
    doc.text('EQUIPAMENTO NOVO', 152.5, 115.3, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    doc.rect(10, 117.3, 190, 35);
    doc.line(105, 117.3, 105, 152.3);

    const linhasEquip = [
        { y: 121.3, label: 'MODELO: ', antigo: valorCampo('modelo_a'), novo: valorCampo('modelo_b') },
        { y: 127.3, label: 'N° PATRIMONIO: ', antigo: valorCampo('patrimonio_a'), novo: valorCampo('patrimonio_b') },
        { y: 133.3, label: 'N° SÉRIE: ', antigo: valorCampo('serie_a'), novo: valorCampo('serie_b') },
        { y: 139.3, label: 'HOSTNAME: ', antigo: valorCampo('hostname_a'), novo: valorCampo('hostname_b') },
        { y: 145.3, label: 'N° ETIQUETA: ', antigo: valorCampo('etiqueta_a'), novo: valorCampo('etiqueta_b') },
        { y: 151.3, label: 'IMEI: ', antigo: valorCampo('imei_a'), novo: valorCampo('imei_b') }
    ];

    linhasEquip.forEach((linha) => {
        const labelXEsquerda = 14;
        const labelXDireita = 109;
        const limiteDireitaColunaEsquerda = 103;
        const limiteDireitaColunaDireita = 198;
        const espacamento = 1.8;

        doc.text(linha.label, labelXEsquerda, linha.y);
        doc.text(linha.label, labelXDireita, linha.y);

        const valorXEsquerda = Math.min(
            limiteDireitaColunaEsquerda - 12,
            labelXEsquerda + doc.getTextWidth(linha.label) + espacamento
        );
        const valorXDireita = Math.min(
            limiteDireitaColunaDireita - 12,
            labelXDireita + doc.getTextWidth(linha.label) + espacamento
        );

        const larguraValorEsquerda = Math.max(8, limiteDireitaColunaEsquerda - valorXEsquerda);
        const larguraValorDireita = Math.max(8, limiteDireitaColunaDireita - valorXDireita);

        escreverValorLinha(linha.antigo, valorXEsquerda, linha.y, larguraValorEsquerda, 8.5);
        escreverValorLinha(linha.novo, valorXDireita, linha.y, larguraValorDireita, 8.5);
    });

    // BACKUP / ACESSORIOS
    doc.rect(10, 153.8, 190, 5);
    doc.setFillColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.rect(10, 153.8, 95, 5, 'F');
    doc.rect(105, 153.8, 95, 5, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.line(105, 153.8, 105, 158.8);
    doc.setDrawColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('BACKUP', 57.5, 158.3, { align: 'center' });
    doc.text('ACESSORIOS OU PERIFERICOS', 152.5, 158.3, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    doc.rect(10, 159.3, 190, 10);
    doc.line(105, 159.3, 105, 169.3);

    doc.text('BACKUP REALIZADO: ', 13, 163.3);
    escreverValorLinha(valorCampo('backup_a'), 45, 163.3, 51, 8.5);
    doc.text('NOME PERFIL USUÁRIO: ', 13, 168.3);
    escreverValorLinha(valorCampo('usuario_a'), 53, 168.3, 43, 8.5);
    doc.text('DETALHAR / PATRIMONIO: ', 108, 163.3);
    escreverValorLinha(valorCampo('patrimonio_b1'), 145, 163.3, 46, 8.5);
    doc.text('DETALHAR / PATRIMONIO: ', 108, 168.3);
    escreverValorLinha(valorCampo('patrimonio_b2'), 145, 168.3, 46, 8.5);
    desenharCheckbox(99, 160.2, marcado('check_backup_a'));
    desenharCheckbox(99, 165.2, marcado('check_usuario_a'));
    desenharCheckbox(194, 160.2, marcado('check_patrimonio_b1'));
    desenharCheckbox(194, 165.2, marcado('check_patrimonio_b2'));

    // VALIDACAO
    desenharTituloBarra(10, 170.8, 190, 5, 'VALIDAÇÃO SOFTWARE DE GESTÃO:');
    doc.rect(10, 176.2, 190, 7);
    const yValidacaoTexto = 180.2;
    const yValidacaoCheckbox = 176.9;

    const xAim = 16;
    doc.text('AIM:', xAim, yValidacaoTexto);
    desenharCheckbox(xAim + doc.getTextWidth('AIM:') + 1, yValidacaoCheckbox, marcado('aim'));

    const xKace = 34.5;
    doc.text('KACE:', xKace, yValidacaoTexto);
    desenharCheckbox(xKace + doc.getTextWidth('KACE:') + 1, yValidacaoCheckbox, marcado('kace'));

    const xOutros = 56;
    doc.text('OUTROS:', xOutros, yValidacaoTexto);
    desenharCheckbox(xOutros + doc.getTextWidth('OUTROS:') + 1, yValidacaoCheckbox, marcado('v_outros'));

    doc.text('OBSERVAÇÕES: ', 77.92, yValidacaoTexto);
    escreverValorLinha(valorCampo('observacoes'), 101, 180.2, 96, 8.5);

    // Sintoma
    desenharTituloBarra(10, 185.2, 190, 5, 'SINTOMA DO PROBLEMA RELATADO');
    doc.rect(10, 190.6, 190, 16);
    escreverAreaTexto(valorCampo('sintoma'), 10, 190.6, 190, 16, 3.5, 8.5);

    // Relatorio tecnico
    desenharTituloBarra(10, 207.6, 190, 5, 'RELATÓRIO TÉCNICO - FECHAMENTO');
    doc.rect(10, 213, 190, 30);
    escreverAreaTexto(valorCampo('relatorio'), 10, 213, 190, 30, 3.8, 8.5);

    // Assinatura cliente
    doc.setLineWidth(0.2);
    doc.line(65, 255, 145, 255);
    doc.setFontSize(9);
    doc.text('ASSINATURA DO CLIENTE / RESPONSÁVEL', 72.11, 260);
    if (assinaturaCliente?.canvas && canvasPossuiAssinatura(assinaturaCliente.canvas)) {
        doc.addImage(assinaturaCliente.canvas.toDataURL('image/png'), 'PNG', 80, 247.2, 50, 7.9);
    }

    // Rodape / LGPD
    doc.setFontSize(8);
    doc.setTextColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.text('ESTE TÉCNICO ARKLOK NÃO ESTÁ AUTORIZADO A REALIZAR A RETIRADA DE EQUIPAMENTOS OU PERIFÉRICOS.', 26.19, 265);
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text('ATENDIMENTO À LGPD: AO INSERIR SEUS DADOS ACIMA, VOCÊ ESTARÁ DE ACORDO COM A UTILIZAÇÃO DE SUAS INFORMAÇÕES', 26.62, 269);
    doc.text('ÚNICA E EXCLUSIVAMENTE PARA O PROCESSO DE ATENDIMENTO TÉCNICO DA ARKLOK. SEUS DADOS NÃO SERÃO PROCESSADOS', 25.76, 273);
    doc.text('E NEM DIVULGADOS PARA NENHUM OUTRO MEIO FORA O ESCLARECIDO ACIMA.', 56.33, 278);
    doc.setFontSize(8);
    doc.setTextColor(vermelho[0], vermelho[1], vermelho[2]);
    doc.text('ESTE DOCUMENTO É PROPRIEDADE DA ARKLOK, TODOS OS DIREITOS SÃO RESERVADOS.', 41.78, 283);

    const chamadoNum = valorCampo('chamado') || 'sem_numero';
    doc.save(`RAT ${chamadoNum}.pdf`);
}


    global.RATPdf = Object.freeze({
        gerarPdfRat
    });
})(window);

