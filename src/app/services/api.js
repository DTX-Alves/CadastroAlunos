
const API_URL = 'COLOQUE_A_URL_DA_API_AQUI/alunos';

// GET - Consultar alunos
export async function buscarAlunosAPI() {
  const resposta = await fetch(API_URL);

  if (!resposta.ok) {
    throw new Error('Erro ao consultar alunos.');
  }

  return await resposta.json();
}

// POST - Cadastrar aluno
export async function cadastrarAlunoAPI(aluno) {
  const resposta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(aluno)
  });

  if (!resposta.ok) {
    throw new Error('Erro ao cadastrar aluno.');
  }

  return await resposta.json();
}

// PUT - Editar aluno
export async function editarAlunoAPI(id, aluno) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(aluno)
  });

  if (!resposta.ok) {
    throw new Error('Erro ao editar aluno.');
  }

  return await resposta.json();
}

// DELETE - Excluir aluno
export async function excluirAlunoAPI(id) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!resposta.ok) {
    throw new Error('Erro ao excluir aluno.');
  }
}
