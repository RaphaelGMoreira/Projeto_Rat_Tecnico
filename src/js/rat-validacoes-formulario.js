// rat-validacoes-formulario.js - Modulo de validacoes e comportamento visual do formulario RAT
(function inicializarModuloValidacoes(global) {
    'use strict';

    function criarValidacoesRat(config = {}) {
        const {
            camposObrigatorios = [],
            camposSomenteNumeros = [],
            textoCampoObrigatorio = 'Campo Obrigatorio',
            mensagemErroHorario = 'Horario Termino nao pode ser menor que Horario de Inicio',
            mensagemErroKm = 'KM FINAL nao pode ser igual e nem menor que o KM INICIAL.',
            regexEmailCliente = /^[^\s@]+@[^\s@]+\.com(\.br)?$/i,
            ehSomenteNumeros = (valor) => /^\d+$/.test(String(valor ?? '').trim()),
            converterHorarioParaMinutos = () => NaN,
            converterKmParaNumero = () => NaN,
            canvasPossuiAssinatura = () => false,
            getAssinaturaTecnico = () => null,
            getAssinaturaCliente = () => null,
            canvasTecnicoId = 'assinatura',
            canvasClienteId = 'assinaturaCliente',
            botaoLimparClienteId = 'limparAssinaturaCliente'
        } = config;

        function obterOuCriarMensagemErroHorario(form) {
            let mensagem = form.querySelector('#mensagem-erro-horario');
            if (mensagem) return mensagem;

            const campoTermino = form.elements.termino;
            if (!campoTermino) return null;

            mensagem = document.createElement('p');
            mensagem.id = 'mensagem-erro-horario';
            mensagem.className = 'field-error-message';
            mensagem.style.display = 'none';
            campoTermino.insertAdjacentElement('afterend', mensagem);
            return mensagem;
        }

        function atualizarMensagemErroHorario(form, texto) {
            const mensagem = obterOuCriarMensagemErroHorario(form);
            if (!mensagem) return;

            if (texto) {
                mensagem.textContent = texto;
                mensagem.style.display = 'block';
            } else {
                mensagem.textContent = '';
                mensagem.style.display = 'none';
            }
        }

        function obterOuCriarMensagemErroKm(form) {
            let mensagem = form.querySelector('#mensagem-erro-km');
            if (mensagem) return mensagem;

            const campoKmFinal = form.elements.kmfinal;
            if (!campoKmFinal) return null;

            mensagem = document.createElement('p');
            mensagem.id = 'mensagem-erro-km';
            mensagem.className = 'field-error-message';
            mensagem.style.display = 'none';
            campoKmFinal.insertAdjacentElement('afterend', mensagem);
            return mensagem;
        }

        function atualizarMensagemErroKm(form, texto) {
            const mensagem = obterOuCriarMensagemErroKm(form);
            if (!mensagem) return;

            if (texto) {
                mensagem.textContent = texto;
                mensagem.style.display = 'block';
            } else {
                mensagem.textContent = '';
                mensagem.style.display = 'none';
            }
        }

        function obterOuCriarMensagemErroAssinaturas(form) {
            let mensagem = form.querySelector('#mensagem-erro-assinaturas');
            if (mensagem) return mensagem;

            mensagem = document.createElement('p');
            mensagem.id = 'mensagem-erro-assinaturas';
            mensagem.className = 'field-error-message';
            mensagem.style.display = 'none';

            const botaoLimparCliente = document.getElementById(botaoLimparClienteId);
            const canvasCliente = form.querySelector(`#${canvasClienteId}`);
            if (botaoLimparCliente) {
                botaoLimparCliente.insertAdjacentElement('afterend', mensagem);
            } else if (canvasCliente) {
                canvasCliente.insertAdjacentElement('afterend', mensagem);
            } else {
                form.appendChild(mensagem);
            }

            return mensagem;
        }

        function atualizarMensagemErroAssinaturas(form, texto) {
            const mensagem = obterOuCriarMensagemErroAssinaturas(form);
            if (!mensagem) return;

            if (texto) {
                mensagem.textContent = texto;
                mensagem.style.display = 'block';
            } else {
                mensagem.textContent = '';
                mensagem.style.display = 'none';
            }
        }

        function definirBordaAssinatura(canvas, valido) {
            if (!canvas || !canvas.style) return;
            canvas.style.borderColor = valido ? '#ccc' : '#d93025';
        }

        function validarCamposSomenteNumeros(form, exibirAvisoNativo = true) {
            for (const item of camposSomenteNumeros) {
                const campo = form.elements[item.nome];
                if (!campo || typeof campo.value !== 'string') continue;

                campo.setCustomValidity('');
                const valor = campo.value.trim();
                if (!valor) continue;

                if (!ehSomenteNumeros(valor)) {
                    const mensagem = `O campo ${item.rotulo} deve conter apenas numeros.`;
                    campo.setCustomValidity(mensagem);

                    if (exibirAvisoNativo) {
                        if (typeof campo.reportValidity === 'function') {
                            campo.reportValidity();
                        } else {
                            alert(mensagem);
                        }
                        campo.focus();
                    }
                    return false;
                }
            }

            return true;
        }

        function validarEmailCliente(form, exibirAvisoNativo = true) {
            const campoEmail = form.elements.email_cliente;
            if (!campoEmail || typeof campoEmail.value !== 'string') return true;

            campoEmail.setCustomValidity('');
            const valor = campoEmail.value.trim();
            if (!valor) return true;

            if (!regexEmailCliente.test(valor)) {
                const mensagem = 'Informe um e-mail valido no formato usuario@email.com ou usuario@email.com.br.';
                campoEmail.setCustomValidity(mensagem);

                if (exibirAvisoNativo) {
                    if (typeof campoEmail.reportValidity === 'function') {
                        campoEmail.reportValidity();
                    } else {
                        alert(mensagem);
                    }
                    campoEmail.focus();
                }
                return false;
            }

            return true;
        }

        function validarAssinaturasObrigatorias(form, exibirAvisoNativo = true) {
            const canvasTecnico = getAssinaturaTecnico()?.canvas || document.getElementById(canvasTecnicoId);
            const canvasCliente = getAssinaturaCliente()?.canvas || document.getElementById(canvasClienteId);

            const tecnicoAssinou = canvasPossuiAssinatura(canvasTecnico);
            const clienteAssinou = canvasPossuiAssinatura(canvasCliente);

            definirBordaAssinatura(canvasTecnico, tecnicoAssinou);
            definirBordaAssinatura(canvasCliente, clienteAssinou);

            if (tecnicoAssinou && clienteAssinou) {
                atualizarMensagemErroAssinaturas(form, '');
                return true;
            }

            const mensagem = (!tecnicoAssinou && !clienteAssinou)
                ? 'As assinaturas do tecnico e do cliente sao obrigatorias.'
                : (!tecnicoAssinou)
                    ? 'A assinatura do tecnico e obrigatoria.'
                    : 'A assinatura do cliente e obrigatoria.';

            atualizarMensagemErroAssinaturas(form, mensagem);

            if (exibirAvisoNativo) {
                alert(mensagem);
                if (canvasTecnico && typeof canvasTecnico.scrollIntoView === 'function') {
                    canvasTecnico.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
            }

            return false;
        }

        function validarHorarioInicioFim(form, exibirAvisoNativo = true) {
            const campoInicio = form.elements.inicio;
            const campoTermino = form.elements.termino;
            if (!campoInicio || !campoTermino) return true;

            campoInicio.setCustomValidity('');
            campoTermino.setCustomValidity('');

            const inicioMin = converterHorarioParaMinutos(campoInicio.value);
            const terminoMin = converterHorarioParaMinutos(campoTermino.value);

            if (Number.isNaN(inicioMin) || Number.isNaN(terminoMin)) {
                atualizarMensagemErroHorario(form, '');
                return true;
            }

            if (terminoMin < inicioMin) {
                const mensagem = mensagemErroHorario;
                campoTermino.setCustomValidity(mensagem);
                atualizarMensagemErroHorario(form, mensagem);

                if (exibirAvisoNativo) {
                    if (typeof campoTermino.reportValidity === 'function') {
                        campoTermino.reportValidity();
                    } else {
                        alert(mensagem);
                    }
                    campoTermino.focus();
                }
                return false;
            }

            atualizarMensagemErroHorario(form, '');
            return true;
        }

        function validarKmInicialFinal(form, exibirAvisoNativo = true) {
            const campoInicial = form.elements.kminicial;
            const campoFinal = form.elements.kmfinal;
            if (!campoInicial || !campoFinal) return true;

            campoInicial.setCustomValidity('');
            campoFinal.setCustomValidity('');

            const kmInicial = converterKmParaNumero(campoInicial.value);
            const kmFinal = converterKmParaNumero(campoFinal.value);

            if (Number.isNaN(kmInicial)) {
                atualizarMensagemErroKm(form, '');
                const mensagem = 'Informe KM INICIAL com um numero inteiro valido.';
                campoInicial.setCustomValidity(mensagem);
                if (exibirAvisoNativo) {
                    if (typeof campoInicial.reportValidity === 'function') {
                        campoInicial.reportValidity();
                    } else {
                        alert(mensagem);
                    }
                    campoInicial.focus();
                }
                return false;
            }

            if (Number.isNaN(kmFinal)) {
                atualizarMensagemErroKm(form, '');
                const mensagem = 'Informe KM FINAL com um numero inteiro valido.';
                campoFinal.setCustomValidity(mensagem);
                if (exibirAvisoNativo) {
                    if (typeof campoFinal.reportValidity === 'function') {
                        campoFinal.reportValidity();
                    } else {
                        alert(mensagem);
                    }
                    campoFinal.focus();
                }
                return false;
            }

            if (kmFinal <= kmInicial) {
                const mensagem = mensagemErroKm;
                campoFinal.setCustomValidity(mensagem);
                atualizarMensagemErroKm(form, mensagem);

                if (exibirAvisoNativo) {
                    if (typeof campoFinal.reportValidity === 'function') {
                        campoFinal.reportValidity();
                    } else {
                        alert(mensagem);
                    }
                    campoFinal.focus();
                }
                return false;
            }

            atualizarMensagemErroKm(form, '');
            return true;
        }

        function validarTipoEquipamentoObrigatorio(form) {
            const nomesCheckbox = ['notebook', 'desktop', 'impressora', 'mobile'];
            const algumCheckboxSelecionado = nomesCheckbox.some((nome) => Boolean(form.elements[nome]?.checked));
            const campoOutros = form.elements.outros;
            const outrosPreenchido = campoOutros && typeof campoOutros.value === 'string' && campoOutros.value.trim() !== '';

            const campoReferencia = form.elements.notebook || campoOutros;
            if (!campoReferencia) return true;

            const mensagem = 'Selecione ao menos um tipo de equipamento (NOTEBOOK, DESKTOP, IMPRESSORA, MOBILE) ou preencha OUTROS.';
            const invalido = !algumCheckboxSelecionado && !outrosPreenchido;
            campoReferencia.setCustomValidity(invalido ? mensagem : '');

            if (invalido) {
                if (typeof campoReferencia.reportValidity === 'function') {
                    campoReferencia.reportValidity();
                } else {
                    alert(mensagem);
                }
                campoReferencia.focus();
                return false;
            }

            return true;
        }

        function validarCamposObrigatorios(form) {
            for (const campoObrigatorio of camposObrigatorios) {
                const campo = form.elements[campoObrigatorio.nome];
                if (!campo || typeof campo.value !== 'string') continue;

                const vazio = campo.value.trim() === '';
                campo.setCustomValidity(vazio ? `Preencha o campo obrigatorio: ${campoObrigatorio.rotulo}.` : '');

                if (vazio) {
                    if (typeof campo.reportValidity === 'function') {
                        campo.reportValidity();
                    } else {
                        alert(`Preencha o campo obrigatorio: ${campoObrigatorio.rotulo}.`);
                    }
                    campo.focus();
                    return false;
                }
            }

            if (!validarCamposSomenteNumeros(form)) return false;
            if (!validarEmailCliente(form)) return false;
            if (!validarHorarioInicioFim(form)) return false;
            if (!validarKmInicialFinal(form)) return false;
            if (!validarTipoEquipamentoObrigatorio(form)) return false;
            if (!validarAssinaturasObrigatorias(form)) return false;

            return true;
        }

        function aplicarIndicacaoVisualCamposObrigatorios(form) {
            for (const campoObrigatorio of camposObrigatorios) {
                const campo = form.elements[campoObrigatorio.nome];
                if (!campo) continue;

                if ('required' in campo) {
                    campo.required = true;
                }

                if (!campo.id) continue;
                const label = form.querySelector(`label[for="${campo.id}"]`);
                if (!label || label.querySelector('.required-marker')) continue;

                const marcador = document.createElement('span');
                marcador.className = 'required-marker';
                marcador.textContent = '*';
                label.appendChild(marcador);
            }

            const labelAssinatura = form.querySelector(`label[for="${canvasTecnicoId}"]`);
            if (labelAssinatura && !labelAssinatura.querySelector('.required-marker')) {
                const marcadorAssinatura = document.createElement('span');
                marcadorAssinatura.className = 'required-marker';
                marcadorAssinatura.textContent = '*';
                labelAssinatura.appendChild(marcadorAssinatura);
            }
        }

        function aplicarPlaceholderCamposObrigatorios(form) {
            const nomesObrigatorios = new Set(camposObrigatorios.map((campo) => campo.nome));
            const tiposSemPlaceholder = new Set(['checkbox', 'radio', 'hidden', 'file', 'date', 'time']);

            form.querySelectorAll('input, textarea').forEach((campo) => {
                if (!campo || campo.disabled || campo.readOnly) return;
                const tipo = String(campo.type || '').toLowerCase();
                if (tiposSemPlaceholder.has(tipo)) return;
                campo.placeholder = '';
            });

            form.querySelectorAll('select').forEach((campo) => {
                const opcaoVazia = Array.from(campo.options || []).find((opcao) => opcao.value === '');
                if (opcaoVazia) {
                    opcaoVazia.textContent = '--';
                }
            });

            nomesObrigatorios.forEach((nomeCampo) => {
                const campo = form.elements[nomeCampo];
                if (!campo || campo.disabled || campo.readOnly) return;

                const tag = campo.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA') {
                    const tipo = String(campo.type || '').toLowerCase();
                    if (!tiposSemPlaceholder.has(tipo)) {
                        campo.placeholder = textoCampoObrigatorio;
                    }
                    return;
                }

                if (tag === 'SELECT') {
                    const opcaoVazia = Array.from(campo.options || []).find((opcao) => opcao.value === '');
                    if (opcaoVazia) {
                        opcaoVazia.textContent = textoCampoObrigatorio;
                    }
                }
            });
        }

        return Object.freeze({
            validarCamposSomenteNumeros,
            validarEmailCliente,
            validarAssinaturasObrigatorias,
            validarHorarioInicioFim,
            validarKmInicialFinal,
            validarTipoEquipamentoObrigatorio,
            validarCamposObrigatorios,
            aplicarIndicacaoVisualCamposObrigatorios,
            aplicarPlaceholderCamposObrigatorios
        });
    }

    global.RATValidacoesUI = Object.freeze({
        criarValidacoesRat
    });
})(window);
