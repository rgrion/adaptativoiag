/* ===========================
   Correção genérica + Fuzzy (v2)
   =========================== */

function _corrigirComFuzzy(pacote, gabarito, meta){
  const email = String(pacote[0] || '').trim().toLowerCase();
  const respostasQuiz = pacote.slice(1, 1 + gabarito.length);

  // Likert opcionais no final do pacote (1..5)
  const possiveisLikert = pacote.slice(1 + gabarito.length);
  const difLik  = Number(possiveisLikert[0]);
  const autoLik = Number(possiveisLikert[1]);
  const temLikert = !isNaN(difLik) && !isNaN(autoLik) && difLik > 0 && autoLik > 0;

  // acertos
  let acertos = 0;
  for (let i = 0; i < gabarito.length; i++){
    if (respostasQuiz[i] === gabarito[i]) acertos++;
  }

  // === NOTA (0..100) = acertos * 20 ===
  const nota = acertos * 20;

  // garante colunas (agora com Grupo)
  let {aba, dados, cab} = getDados();
  ({aba, dados, cab} = ensureCols(cab, [
    'E-mail','Grupo','Tópico Atual',
    meta.colQuiz, meta.colNota, meta.colReforco, meta.colDesafio,
    meta.likertDif, meta.likertAutoC, meta.colTrilha, meta.colScore, meta.colRota
  ]));

  const idxEmail  = colIndex(cab, 'E-mail');
  const idxGrupo  = colIndex(cab, 'Grupo');
  const idxTopico = colIndex(cab, 'Tópico Atual');
  const idxQuiz   = colIndex(cab, meta.colQuiz);
  const idxNota   = colIndex(cab, meta.colNota);
  const idxDif    = colIndex(cab, meta.likertDif);
  const idxAutoC  = colIndex(cab, meta.likertAutoC);
  const idxTrilha = colIndex(cab, meta.colTrilha);
  const idxScore  = colIndex(cab, meta.colScore);
  const idxRota   = colIndex(cab, meta.colRota);

  for (let i = 1; i < dados.length; i++){
    const emailLinha = String(dados[i][idxEmail] || '').trim().toLowerCase();
    if (emailLinha === email){

      // grava acertos do quiz e nota
      if (idxQuiz !== -1) aba.getRange(i+1, idxQuiz+1).setValue(acertos);  // 0..5
      if (idxNota !== -1) aba.getRange(i+1, idxNota+1).setValue(nota);     // 0..100

      // grava likert se veio no pacote; senão preserva/usa neutro 3
      let dif = parseFloat(dados[i][idxDif]) || null;
      let aut = parseFloat(dados[i][idxAutoC]) || null;
      if (temLikert){
        if (idxDif   !== -1) aba.getRange(i+1, idxDif+1).setValue(difLik);
        if (idxAutoC !== -1) aba.getRange(i+1, idxAutoC+1).setValue(autoLik);
        dif = difLik;
        aut = autoLik;
      }
      if (!dif) dif = 3;
      if (!aut) aut = 3;

      // lê grupo
      const grupo = idxGrupo !== -1
        ? String(dados[i][idxGrupo] || '').trim()
        : '';

      let proximo = meta.nextTopico; // default

      if (grupo === 'Controle'){
        // 👉 GRUPO CONTROLE: trilha fixa (sem adaptação)
        if (idxTrilha !== -1) aba.getRange(i+1, idxTrilha+1).setValue('CONTROLE');
        if (idxScore  !== -1) aba.getRange(i+1, idxScore+1).setValue('');
        if (idxRota   !== -1) aba.getRange(i+1, idxRota+1).setValue(proximo);
        if (idxTopico !== -1) aba.getRange(i+1, idxTopico+1).setValue(proximo);
        return proximo;

      } else {
        // 👉 GRUPO EXPERIMENTAL (ou não definido): aplica Fuzzy
        const decisao = decidirTrilhaFuzzy(nota, dif, aut); // { trilha, score, ... }

        if (idxTrilha !== -1) aba.getRange(i+1, idxTrilha+1).setValue(decisao.trilha);          
        if (idxScore  !== -1) aba.getRange(i+1, idxScore+1).setValue(Math.round(decisao.score));

        if (idxRota !== -1){
          // escolhe próxima página por trilha
          proximo = meta.nextTopico; // REGULAR
          if (decisao.trilha === 'REFORCO') proximo = meta.pagReforco;
          else if (decisao.trilha === 'DESAFIO') proximo = meta.pagDesafio;

          aba.getRange(i+1, idxRota+1).setValue(proximo);
          if (idxTopico !== -1) aba.getRange(i+1, idxTopico+1).setValue(proximo);
          return proximo;
        }

        // fallback
        return meta.nextTopico;
      }
    }
  }
  return 'erro_email.html';
}

/* ===========================
   Tópicos 01–04 (Quiz principal)
   =========================== */
function corrigirQuiz01(pacote){
  return _corrigirComFuzzy(pacote, ['b','c','c','b','d'], {
    colQuiz:'T01', colNota:'T01_Nota', colReforco:'T01R', colDesafio:'T01D',
    likertDif:'T01_Dif', likertAutoC:'T01_AutoC',
    colTrilha:'T01_Trilha', colScore:'T01_Score', colRota:'T01_Rota',
    nextTopico:'topico02.html', pagReforco:'reforco01.html', pagDesafio:'desafio01.html'
  });
}
function corrigirQuiz02(pacote){
  return _corrigirComFuzzy(pacote, ['b','b','c','a','a'], {
    colQuiz:'T02', colNota:'T02_Nota', colReforco:'T02R', colDesafio:'T02D',
    likertDif:'T02_Dif', likertAutoC:'T02_AutoC',
    colTrilha:'T02_Trilha', colScore:'T02_Score', colRota:'T02_Rota',
    nextTopico:'topico03.html', pagReforco:'reforco02.html', pagDesafio:'desafio02.html'
  });
}
function corrigirQuiz03(pacote){
  return _corrigirComFuzzy(pacote, ['c','d','c','a','d'], {
    colQuiz:'T03', colNota:'T03_Nota', colReforco:'T03R', colDesafio:'T03D',
    likertDif:'T03_Dif', likertAutoC:'T03_AutoC',
    colTrilha:'T03_Trilha', colScore:'T03_Score', colRota:'T03_Rota',
    nextTopico:'topico04.html', pagReforco:'reforco03.html', pagDesafio:'desafio03.html'
  });
}
function corrigirQuiz04(pacote){
  return _corrigirComFuzzy(pacote, ['a','d','d','a','b'], {
    colQuiz:'T04', colNota:'T04_Nota', colReforco:'T04R', colDesafio:'T04D',
    likertDif:'T04_Dif', likertAutoC:'T04_AutoC',
    colTrilha:'T04_Trilha', colScore:'T04_Score', colRota:'T04_Rota',
    nextTopico:'avaliacaofinal.html', pagReforco:'reforco04.html', pagDesafio:'desafio04.html'
  });
}

/* ===========================
   Reforços (mantidos)
   =========================== */
function _corrigirReforcoGenerico(pacote, gabarito, colR, proxima){
  const email = String(pacote[0] || '').trim().toLowerCase();
  const respostas = pacote.slice(1);
  let acertos = 0;
  for (let i = 0; i < gabarito.length; i++){
    if (respostas[i] === gabarito[i]) acertos++;
  }

  let {aba, dados, cab} = getDados();
  ({aba, dados, cab} = ensureCols(cab, ['E-mail','Tópico Atual', colR]));
  const idxEmail  = colIndex(cab, 'E-mail');
  const idxTopico = colIndex(cab, 'Tópico Atual');
  const idxCol    = colIndex(cab, colR);

  for (let i = 1; i < dados.length; i++){
    const emailLinha = String(dados[i][idxEmail] || '').trim().toLowerCase();
    if (emailLinha === email){
      if (idxCol !== -1) aba.getRange(i+1, idxCol+1).setValue(acertos);
      if (idxTopico !== -1) aba.getRange(i+1, idxTopico+1).setValue(proxima);
      return proxima;
    }
  }
  return 'erro_email.html';
}
function corrigirReforco01(pacote){ return _corrigirReforcoGenerico(pacote, ['b','a','c'], 'T01R', 'topico02.html'); }
function corrigirReforco02(pacote){ return _corrigirReforcoGenerico(pacote, ['c','d','a'], 'T02R', 'topico03.html'); }
function corrigirReforco03(pacote){ return _corrigirReforcoGenerico(pacote, ['c','d','b'], 'T03R', 'topico04.html'); }
function corrigirReforco04(pacote){ return _corrigirReforcoGenerico(pacote, ['a','d','b'], 'T04R', 'avaliacaofinal.html'); }

/* ===========================
   Desafios 01–04 (mantidos)
   =========================== */
function _corrigirDesafio(pacote, correta, colD, proxima){
  const email = String(pacote[0] || '').trim().toLowerCase();
  const resp = (pacote[1] || '').toString();
  const acertos = resp === correta ? 1 : 0;

  let {aba, dados, cab} = getDados();
  ({aba, dados, cab} = ensureCols(cab, ['E-mail','Tópico Atual', colD]));
  const idxEmail  = colIndex(cab, 'E-mail');
  const idxTopico = colIndex(cab, 'Tópico Atual');
  const idxCol    = colIndex(cab, colD);

  for (let i = 1; i < dados.length; i++){
    const emailLinha = String(dados[i][idxEmail] || '').trim().toLowerCase();
    if (emailLinha === email){
      if (idxCol !== -1) aba.getRange(i+1, idxCol+1).setValue(acertos);
      if (idxTopico !== -1) aba.getRange(i+1, idxTopico+1).setValue(proxima);
      return proxima;
    }
  }
  return 'erro_email.html';
}
function corrigirDesafio01(pacote){ return _corrigirDesafio(pacote, 'c', 'T01D', 'topico02.html'); }
function corrigirDesafio02(pacote){ return _corrigirDesafio(pacote, 'b', 'T02D', 'topico03.html'); }
function corrigirDesafio03(pacote){ return _corrigirDesafio(pacote, 'd', 'T03D', 'topico04.html'); }
function corrigirDesafio04(pacote){ return _corrigirDesafio(pacote, 'a', 'T04D', 'avaliacaofinal.html'); }