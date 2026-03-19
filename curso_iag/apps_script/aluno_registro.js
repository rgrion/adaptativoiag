/* ============================================================
   VERIFICAR OU REGISTRAR ALUNO  
   – Identificação: E-mail (chave única)
   – Grupo: Controle | Experimental (balanceado)
   – Tópico Atual: rota HTML
   ============================================================ */
function verificarAluno(email) {

  const key = String(email || '').trim().toLowerCase();
  if (!key) return 'introducao.html';

  // garante que a planilha e colunas necessárias existem
  let {aba, dados, cab} = getDados();
  ({aba, dados, cab} = ensureCols(cab, [
    'E-mail', 'Grupo', 'Tópico Atual'
  ]));

  const idxEmail       = cab.indexOf('E-mail');
  const idxGrupo       = cab.indexOf('Grupo');
  const idxTopicoAtual = cab.indexOf('Tópico Atual');

  // 🔎 1) Já existe aluno? → apenas retorna o "Tópico Atual"
  for (let i = 1; i < dados.length; i++) {
    const emailLinha = String(dados[i][idxEmail] || '').trim().toLowerCase();
    if (emailLinha === key) {
      return dados[i][idxTopicoAtual] || 'introducao.html';
    }
  }

  // 🔢 2) Não existe → decide grupo balanceado
  let totalControle = 0, totalExperimental = 0;
  for (let i = 1; i < dados.length; i++) {
    const g = String(dados[i][idxGrupo] || '').trim();
    if (g === 'Controle') totalControle++;
    else if (g === 'Experimental') totalExperimental++;
  }

  const grupoNovo =
    totalControle <= totalExperimental ? 'Controle' : 'Experimental';

  // 🆕 3) Criar registro inicial
  const nova = new Array(cab.length).fill('');
  nova[idxEmail]       = key;
  nova[idxGrupo]       = grupoNovo;
  nova[idxTopicoAtual] = 'introducao.html';

  aba.appendRow(nova);

  return 'introducao.html';
}