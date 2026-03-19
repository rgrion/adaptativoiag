/* ===========================
   Avaliação Final (10 questões)
   -> Pontuação Final = Prova Final (0..10)
   =========================== */
function corrigirAvaliacaoFinal(pacote){
  const email = String(pacote[0] || '').trim().toLowerCase();
  const respostas = pacote.slice(1).map(r => String(r || '').toLowerCase());

  const gabarito = ['c','a','d','c','a','b','d','b','c','a'];

  let acertos = 0;
  for (let i = 0; i < gabarito.length; i++){
    if (respostas[i] === gabarito[i]) acertos++;
  }

  let {aba, dados, cab} = getDados();
  ({aba, dados, cab} = ensureCols(cab, [
    'E-mail','Prova Final','Pontuação Final','Tópico Atual',
    // mantém colunas antigas se você usa em outros fluxos
    'T01','T01R','T02','T02R','T03','T03R','T04','T04R'
  ]));

  const idxEmail = colIndex(cab,'E-mail');
  const idxProva  = colIndex(cab,'Prova Final');
  const idxPontos = colIndex(cab,'Pontuação Final');
  const idxTopico = colIndex(cab,'Tópico Atual');

  for (let i = 1; i < dados.length; i++){
    const emailLinha = String(dados[i][idxEmail] || '').trim().toLowerCase();

    if (emailLinha === email){
      // Prova Final (0..10)
      if (idxProva  !== -1) aba.getRange(i+1, idxProva+1).setValue(acertos);
      if (idxPontos !== -1) aba.getRange(i+1, idxPontos+1).setValue(acertos);

      // Armazena o último email 
      CacheService.getScriptCache().put('ultimoEmail', email, 60*60);

      // fluxo: avaliacao final -> ux -> finalagradecimento
      const proximo = 'ux.html';
      if (idxTopico !== -1) aba.getRange(i+1, idxTopico+1).setValue(proximo);

      return proximo;
    }
  }
  return 'erro_email.html';
}

/* ===========================
   Resultado Final (0..10)
   =========================== */
function obterPontuacaoFinal(email){
  let {dados, cab} = getDados();
  const idxEmail = colIndex(cab,'E-mail');
  const idxProva  = colIndex(cab,'Prova Final');
  const idxPontos = colIndex(cab,'Pontuação Final');

  if (!email){
    email = CacheService.getScriptCache().get('ultimoEmail') || '';
  }
  if (!email) return 0;

  const emailStr = String(email).trim().toLowerCase();

  for (let i = 1; i < dados.length; i++){
    const emailLinha = String(dados[i][idxEmail] || '').trim().toLowerCase();

    if (emailLinha === emailStr){
      const prova  = Number(dados[i][idxProva])  || 0;
      const pontos = Number(dados[i][idxPontos]) || 0;
      return prova || pontos || 0;
    }
  }
  return 0;
}