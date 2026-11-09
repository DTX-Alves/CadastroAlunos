
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Switch
} from 'react-native';

import {
  buscarAlunosAPI,
  cadastrarAlunoAPI,
  editarAlunoAPI,
  excluirAlunoAPI
} from './services/api';


export default function App() {

  // ESTADOS DO APLICATIVO

  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');

  const [alunos, setAlunos] = useState([]);

  const [idEdicao, setIdEdicao] = useState(null);

  const [carregando, setCarregando] = useState(false);

  // false = CRUD local
  // true = CRUD com API

  const [usarAPI, setUsarAPI] = useState(false);


  // READ - BUSCAR ALUNOS NA API

  async function buscarAlunos() {

    try {

      setCarregando(true);

      const dados = await buscarAlunosAPI();

      setAlunos(dados);

    } catch (erro) {

      Alert.alert('Erro');

    } finally {

      setCarregando(false);

    }

  }


  // CONSULTA INICIAL QUANDO ATIVAR A API

  useEffect(() => {

    if (usarAPI) {
      buscarAlunos();
    }

  }, [usarAPI]);


  // LIMPAR CAMPOS

  function limparCampos() {

    setNome('');
    setCurso('');
    setIdEdicao(null);

  }


  // CREATE E UPDATE - SALVAR ALUNO

  async function salvarAluno() {

    // VALIDAR CAMPOS

    if (nome.trim() === '' || curso.trim() === '') {

      Alert.alert(
        'Atenção',
        'Preencha o nome e o curso do aluno!'
      );

      return;

    }


    try {

      setCarregando(true);


      // MODO API

      if (usarAPI) {

        const aluno = {
          nome: nome.trim(),
          curso: curso.trim()
        };


        // CREATE - POST

        if (idEdicao === null) {

          await cadastrarAlunoAPI(aluno);

          Alert.alert('Sucesso', 'Aluno cadastrado!');

        }

        // UPDATE - PUT

        else {

          await editarAlunoAPI(idEdicao, aluno);

          Alert.alert('Sucesso', 'Aluno atualizado!');

        }


        // ATUALIZAR LISTA

        const dados = await buscarAlunosAPI();

        setAlunos(dados);

      }


      // MODO LOCAL

      else {

        // CREATE

        if (idEdicao === null) {

          const novoAluno = {
            id: Date.now().toString(),
            nome: nome.trim(),
            curso: curso.trim()
          };

          setAlunos(listaAtual => [...listaAtual,novoAluno]);

          Alert.alert('Sucesso', 'Aluno cadastrado!');

        }


        // UPDATE

        else {

          const novaLista = alunos.map(aluno => {

            if (aluno.id === idEdicao) {

              return {aluno,
                nome: nome.trim(),
                curso: curso.trim()
              };

            }

            return aluno;

          });

          setAlunos(novaLista);

          Alert.alert('Sucesso', 'Aluno atualizado!');

        }

      }


      limparCampos();

    } catch (erro) {

      Alert.alert('Erro');

    } finally {

      setCarregando(false);

    }

  }


  // EDITAR ALUNO

  function editarAluno(aluno) {

    setNome(aluno.nome);

    setCurso(aluno.curso);

    setIdEdicao(aluno.id);

  }


  // DELETE - EXCLUIR ALUNO

  function excluirAluno(id) {

    Alert.alert(
      'Excluir aluno',
      'Deseja realmente excluir este aluno?',

      [

        {
          text: 'Cancelar',
          style: 'cancel'
        },

        {
          text: 'Excluir',
          style: 'destructive',

          onPress: async () => {

            try {

              setCarregando(true);


              // EXCLUIR PELA API

              if (usarAPI) {

                await excluirAlunoAPI(id);

                const dados = await buscarAlunosAPI();

                setAlunos(dados);

              }


              // EXCLUIR LOCALMENTE

              else {

                const novaLista = alunos.filter(
                  aluno => aluno.id !== id
                );

                setAlunos(novaLista);

              }


              // SAIR DA EDIÇÃO SE O ALUNO FOR EXCLUÍDO

              if (idEdicao === id) {
                limparCampos();
              }

              Alert.alert('Sucesso', 'Aluno excluído!');

            } catch (erro) {

              Alert.alert('Erro', erro.message);

            } finally {

              setCarregando(false);

            }

          }

        }

      ]

    );

  }


  // MUDAR ENTRE LOCAL E API

  function mudarModo(valor) {

    if (valor && alunos.length > 0 && !usarAPI) {

      Alert.alert(
        'Atenção',
        'Ao ativar a API, a lista local será substituída pelos dados do servidor.'
      );

    }

    limparCampos();

    setAlunos([]);

    setUsarAPI(valor);

  }


  // INTERFACE DO APLICATIVO

  return (

    <View style={styles.container}>


      <Text style={styles.titulo}>
        Cadastro de Alunos
      </Text>


      {/* SELETOR DO MODO */}

      <View style={styles.modo}>

        <Text>CRUD Local</Text>

        <Switch
          value={usarAPI}
          onValueChange={mudarModo}
        />

        <Text>API</Text>

      </View>


      <Text style={styles.subtitulo}>
        Dados do aluno
      </Text>


      {/* CAMPO NOME */}

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do aluno"
        value={nome}
        onChangeText={setNome}
      />


      {/* CAMPO CURSO */}

      <TextInput
        style={styles.input}
        placeholder="Digite o curso"
        value={curso}
        onChangeText={setCurso}
      />


      {/* BOTÃO CADASTRAR OU SALVAR */}

      <Button
        title={
          idEdicao === null
            ? 'Cadastrar Aluno'
            : 'Salvar Alterações'
        }
        onPress={salvarAluno}
        disabled={carregando}
      />


      {/* BOTÃO CANCELAR EDIÇÃO */}

      {idEdicao !== null && (

        <View style={styles.cancelar}>

          <Button
            title="Cancelar Edição"
            color="gray"
            onPress={limparCampos}
          />

        </View>

      )}


      <Text style={styles.subtitulo}>
        Lista de Alunos
      </Text>


      {/* INDICADOR DE CARREGAMENTO */}

      {carregando && (

        <ActivityIndicator
          size="large"
          color="#2563eb"
        />

      )}


      {/* LISTA DE ALUNOS */}

      <FlatList

        data={alunos}

        keyExtractor={item => String(item.id)}

        ListEmptyComponent={

          !carregando && (

            <Text style={styles.vazio}>
              Nenhum aluno cadastrado.
            </Text>

          )

        }

        renderItem={({ item }) => (

          <View style={styles.card}>


            <Text style={styles.nome}>
              {item}
            </Text>


            <Text style={styles.curso}>
              Curso: {item}
            </Text>


            <View style={styles.botoes}>


              {/* EDITAR */}

              <Pressable

                style={styles.botaoEditar}

                onPress={() => editarAluno(item)}

                disabled={carregando}

              >

                <Text style={styles.textoBotao}>
                  Editar
                </Text>

              </Pressable>


              {/* EXCLUIR */}

              <Pressable

                style={styles.botaoExcluir}

                onPress={() => excluirAluno(item)}

                disabled={carregando}

              >

                <Text style={styles.textoBotao}>
                  Excluir
                </Text>

              </Pressable>


            </View>

          </View>

        )}

      />

    </View>

  );

}


// ESTILIZAÇÃO

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
    paddingTop: 60
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },

  modo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 12
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },

  cancelar: {
    marginTop: 8
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 12
  },

  nome: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  curso: {
    fontSize: 15,
    marginTop: 5
  },

  botoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12
  },

  botaoEditar: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center'
  },

  botaoExcluir: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center'
  },

  textoBotao: {
    color: '#fff',
    fontWeight: 'bold'
  },

  vazio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20
  }

});
