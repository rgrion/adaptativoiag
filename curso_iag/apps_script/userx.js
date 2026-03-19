/* ===========================
   UX (Likert 1..5) – salva ux1..ux7 na aba "respostas"
   =========================== */
function corrigirUX(pacote){
  // esperado: [email, ux1..ux7] -> números 1..5
  const email = String(pacote[0] || '').trim().toLowerCase();
  const valores = pacote.slice(1).map(v => Number(v) || 0); // [ux1..ux7]

  if (!email) throw new Error('E-mail inválido.');

  let {aba, dados, cab} = getDados();
  ({aba, dados, cab} = ensureCols(cab, [
    'E-mail','ux1','ux2','ux3','ux4','ux5','ux6','ux7','Tópico Atual'
  ]));

  const idxEmail = colIndex(cab,'E-mail');
  const idxTopico = colIndex(cab,'Tópico Atual');
  const idxsUX = ['ux1','ux2','ux3','ux4','ux5','ux6','ux7'].map(n => colIndex(cab, n));

  // Atualiza linha existente
  for (let i = 1; i < dados.length; i++){
    const emailLinha = String(dados[i][idxEmail] || '').trim().toLowerCase();

    if (emailLinha === email){
      // grava ux1..ux7
      for (let j = 0; j < idxsUX.length; j++){
        if (idxsUX[j] !== -1){
          aba.getRange(i+1, idxsUX[j] + 1).setValue(valores[j]);
        }
      }
      const proximo = 'finalagradecimento.html';
      if (idxTopico !== -1) aba.getRange(i+1, idxTopico + 1).setValue(proximo);
      return proximo;
    }
  }

  // 🔒 Se não achar o e-mail, retorna erro
  // (não cria nova linha porque o aluno já deveria existir)
  return 'erro_email.html';
}