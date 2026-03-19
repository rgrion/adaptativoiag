/* ===================================================
   Roteamento e Diagnóstico — Fundamentos de IA Generativa
   (compatível com incluir(...) e com doGet?p=...)
   =================================================== */

function doGet(e) {
  let page = (e && e.parameter && e.parameter.p) ? String(e.parameter.p) : 'index';
  page = page.trim().replace(/\.html?$/i, '');
  let output;
  try {
    output = HtmlService.createHtmlOutputFromFile(page);
  } catch (err) {
    console.warn('⚠️ Página não encontrada:', page, '| Erro:', err && err.message);
    output = HtmlService.createHtmlOutputFromFile('index');
  }
  return output
    .setTitle('Fundamentos de IA Generativa')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ===================================================
   incluir(nomePagina)
   - Mantido para compatibilidade com os HTMLs que chamam
   - Retorna o conteúdo HTML da página solicitada
   =================================================== */
function incluir(nomePagina) {
  var nome = String(nomePagina || '').trim().replace(/\.html?$/i, '');
  if (!nome) throw new Error('Página inválida.');

  try {
    HtmlService.createHtmlOutputFromFile(nome); // lança se não existir
  } catch (err) {
    throw new Error('Página "' + nome + '" não encontrada no projeto.');
  }

  try {
    return HtmlService
      .createHtmlOutputFromFile(nome)
      .setTitle('Fundamentos de IA Generativa')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .getContent();
  } catch (e) {
    console.error('❌ incluir("' + nome + '") falhou:', e && e.message ? e.message : e);
    throw new Error('incluir("' + nome + '") falhou: ' + (e && e.message ? e.message : e));
  }
}

/* ===================================================
   Diagnóstico Inicial (IA Generativa)
   pacote esperado:
   [ email,
     idade,
     genero,
     escolaridade,
     area,
     usoIA,
     estudoIA,
     familiaridadeTec,
     interesseIA,
     "Sim",            // Consentimento
     notaPre_0_10 ]    // Nota do pré-teste
   => total 11 itens
   =================================================== */
function registrarDiagnostico(pacote) {
  try {
    var email = String(pacote && pacote[0] || '').trim().toLowerCase();
    if (!email) {
      console.warn('⚠️ E-mail vazio no registrarDiagnostico');
      return 'introducao';
    }

    // 1 (email) + 8 perfil + 1 consentimento + 1 nota
    if (!Array.isArray(pacote) || pacote.length < 11) {
      throw new Error(
        'Pacote inválido. Esperado 11 itens (email + 8 perfil + consentimento + nota). Recebido: ' +
        JSON.stringify(pacote)
      );
    }

    var proxima = 'topico01'; // rota lógica após diagnóstico (sem .html)

    var ctx = getDados();
    var aba = ctx.aba, dados = ctx.dados, cab = ctx.cab;

    // nomes das colunas na planilha para o NOVO diagnóstico
    var camposPerfil = [
      'idade',
      'genero',
      'escolaridade',
      'area',
      'usoIA',
      'estudoIA',
      'familiaridadeTec',
      'interesseIA'
    ];

    // Garantimos colunas necessárias
    var need = ['E-mail', 'Grupo', 'Tópico Atual']
      .concat(camposPerfil)
      .concat(['Consentimento', 'NotaPre_0_10']);

    var fixed = ensureCols(cab, need);
    aba   = fixed.aba;
    dados = fixed.dados;
    cab   = fixed.cab;

    var iEmail    = colIndex(cab, 'E-mail');
    var iTop      = colIndex(cab, 'Tópico Atual');
    var iNota     = colIndex(cab, 'NotaPre_0_10');
    var iConsent  = colIndex(cab, 'Consentimento');

    if (iEmail === -1 || iTop === -1) {
      throw new Error('Cabeçalhos "E-mail" ou "Tópico Atual" ausentes após ensureCols.');
    }

    // Mapeia o pacote nas variáveis esperadas
    var respostasPerfil = pacote.slice(1, 1 + camposPerfil.length);   // [1..8]
    var consentimento   = pacote[1 + camposPerfil.length];            // posição 9
    var notaPre         = Number(pacote[2 + camposPerfil.length]);    // posição 10

    var linha = -1;

    // Procura linha do aluno pelo E-mail (chave atual do curso)
    for (var i = 1; i < dados.length; i++) {
      var eLinha = String(dados[i][iEmail] || '').trim().toLowerCase();
      if (eLinha === email) { linha = i; break; }
    }

    // Se não existe, cria linha nova com E-mail e Tópico Atual
    if (linha === -1) {
      linha = dados.length;
      var nova = new Array(cab.length).fill('');
      nova[iEmail] = email;
      nova[iTop]   = proxima;
      aba.appendRow(nova);
    }

    // Grava os 8 campos de perfil
    for (var j = 0; j < camposPerfil.length; j++) {
      var nomeCol = camposPerfil[j];
      var idxCol = colIndex(cab, nomeCol);
      if (idxCol !== -1) {
        aba.getRange(linha + 1, idxCol + 1).setValue(respostasPerfil[j] || '');
      }
    }

    // Grava o consentimento explicitamente
    if (iConsent !== -1) {
      aba.getRange(linha + 1, iConsent + 1).setValue(consentimento || '');
    } else {
      console.warn('⚠️ Coluna "Consentimento" não encontrada após ensureCols.');
    }

    // Nota do pré-teste
    if (iNota !== -1) {
      aba.getRange(linha + 1, iNota + 1).setValue(isNaN(notaPre) ? '' : notaPre);
    } else {
      console.warn('⚠️ Coluna NotaPre_0_10 não encontrada após ensureCols.');
    }

    // Atualiza Tópico Atual com a próxima página lógica
    aba.getRange(linha + 1, iTop + 1).setValue(proxima);

    console.log('✅ Diagnóstico salvo para', email, '→', proxima, '| Consentimento =', consentimento, '| NotaPre_0_10 =', notaPre);
    return proxima;

  } catch (e) {
    console.error('❌ registrarDiagnostico:', e && e.message ? e.message : e);
    throw new Error('registrarDiagnostico: ' + (e && e.message ? e.message : e));
  }
}

/* ===================================================
   Utilitários / Debug
   =================================================== */
function ping() { return 'pong ' + new Date(); }

function debugIncluirTodos() {
  const paginas = [
    'index', 'introducao', 'diagnostico',
    'topico01', 'topico02', 'topico03', 'topico04',
    'reforco01','reforco02','reforco03','reforco04',
    'desafio01','desafio02','desafio03','desafio04',
    'avaliacaofinal','finalagradecimento','ux'
  ];
  const res = {};
  paginas.forEach(n => {
    try {
      HtmlService.createHtmlOutputFromFile(n);
      res[n] = 'OK';
    } catch (e) {
      res[n] = 'ERRO: ' + (e && e.message ? e.message : e);
    }
  });
  Logger.log(JSON.stringify(res, null, 2));
  return res;
}

// opcional: você pode comentar essa linha se não quiser rodar sempre
debugIncluirTodos();

/** Monta a URL correta do WebApp (exec ou dev) para a página pedida */
function makeUrl(page) {
  page = String(page || 'introducao').trim().replace(/\.html?$/i, '');
  var base = ScriptApp.getService().getUrl(); // resolve /exec ou /dev automaticamente
  var ts = Date.now();
  return base + '?p=' + encodeURIComponent(page) + '&ts=' + ts;
}

function debugHeaders() {
  const { aba } = getDados();
  const lastCol = aba.getLastColumn();
  const headers = aba.getRange(1,1,1,lastCol).getValues()[0];

  Logger.log('Total de colunas: ' + lastCol);
  headers.forEach((h, i) => {
    const txt = String(h);
    const codes = txt.split('').map(ch => ch.charCodeAt(0)).join(',');
    Logger.log( (i+1) + ' → "' + txt + '"  [codes: ' + codes + ']' );
  });
}