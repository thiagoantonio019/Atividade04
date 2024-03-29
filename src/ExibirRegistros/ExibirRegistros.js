import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../database/database';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// Abra ou crie o banco de dados SQLite
const db = new DatabaseConnection.getConnection; 

export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [operacao, setOperacao] = useState('Incluir');
  const [id, setId] = useState(null);

  /**
   * Função dentro do useEffect que cria a tabela caso ela não exista
   */
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL)',
        [], //[]: Este é o array de parâmetros. Como não estamos usando nenhum parâmetro na consulta SQL, deixamos esse array vazio.
        () => console.log('Tabela criada com sucesso'),//retorno de  sucesso
        // '_' É um parâmetro que representa o resultado da transação SQL, por convenção utiliza-se o underscore. para indicar que estamos ignorando esse valor.
        (_, error) => console.error(error) //retorno de  erro
      );
    });
  }, [todos]);

  /**
   * Função utilizada para atualizar os registros
   */
  const ExibirRegistros = () => {
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM clientes',
          //'_array' é uma propriedade do objeto rows retornado pela consulta SQL, em rows._array, o '_' não se refere diretamente a rows, mas sim ao objeto retornado pela transação SQL. 
          [], (_, { rows }) =>
          // O '_array' é uma propriedade desse objeto que contém os resultados da consulta em forma de array.
          setTodos(rows._array),
        );
      });
    } catch (error) {
      console.error('Erro ao buscar todos:', error);
    }
  };

  /**
   * useEffect que chama a função para atualizar os registros
   */
  useEffect(() => {
    ExibirRegistros();
  }, []);

 

  /**
   * Função utilizada atualizar um registro
   */
  const handleButtonPress = (nomeCLi) => {
    // Aqui você pode definir o texto que deseja adicionar ao TextInput
    setInputText(nomeCLi);
  };

  /**
   * Função utilizada para excluir um registro
   */
  const excluiCliente = id => {
    db.transaction(
      tx => {
        tx.executeSql(
          'DELETE FROM clientes WHERE id = ?',
          [id], (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              ExibirRegistros(); // Atualiza a lista de todos
              Alert.alert('Sucesso', 'Registro excluído com sucesso.');
            } else {
              Alert.alert('Erro', 'Nenhum registro foi excluído, vertifique e tente novamente!');
            }
          },
          (_, error) => {
            console.error('Erro ao excluir cliente:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir o cliente.');
          }
        );
      }
    );
  };

  /**
   * Função utilizada para deletar as tabelas e a base de dados
   */
  const deleteDatabase = () => {
    db.transaction(
      tx => {
        tx.executeSql(
          //Seleciona todas as tabelas do banco
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
          [],
          (_, { rows }) => {
            rows._array.forEach(table => {
              tx.executeSql(
                //Deleta as tabelas selecionadas uma a uma através do laço forEach
                `DROP TABLE IF EXISTS ${table.name}`,
                [],
                () => {
                  console.log(`Tabela ${table.name} excluída com sucesso`);
                  setTodos([]);
                },
                (_, error) => {
                  console.error(`Erro ao excluir a tabela ${table.name}:`, error);
                  Alert.alert('Erro', `Ocorreu um erro ao excluir a tabela ${table.name}.`);
                }
              );
            });
          },
          (_, error) => {
            console.error('Erro ao buscar as tabelas:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao buscar as tabelas.');
          }
        );
      }
    );
  };


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <View style={styles.container}>

        
          
          
          <Text style={styles.title}>Clientes Cadastrados</Text>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.containerScroll}>
            {/* A propriedade key é usada pelo React para identificar de forma única cada elemento na lista, o que é crucial para que o React possa otimizar a renderização e o desempenho. */}
            {todos.map(cliente => (
              <View key={cliente.id} style={styles.clienteItem}>
                <Text>{cliente.id}</Text>
                <Text>{cliente.nome}</Text>
                {/* Dentro do onPress do botão, colocamos um alert perguntando ao usuário se deseja excluir o registro selecionado */}
                <View style={styles.buttonTable}>
                  <TouchableOpacity onPress={() => {
                    Alert.alert(
                      "Atenção!",
                      'Deseja excluir o registro selecionado?',
                      [
                        {
                          text: 'OK',
                          onPress: () => excluiCliente(cliente.id)
                        },
                        {
                          text: 'Cancelar',
                          onPress: () => { return },
                          style: 'cancel',
                        }
                      ],
                    )
                  }}>
                    <FontAwesome6 name='trash-can' color={'red'} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { handleButtonPress(cliente.nome), setOperacao('Editar'), setId(cliente.id) }}>
                    <FontAwesome6 name='pen-to-square' color={'silver'} size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>


      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    backgroundColor: '#141414', // Preto como plano de fundo principal
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#e50914', // Vermelho Netflix para títulos
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  clienteItem: {
    backgroundColor: '#fff', // Branco para itens da lista
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop:-250
  },
  text: {
    color: '#fff', // Texto em branco para contraste
    fontSize: 16,
  },
  buttonTable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 5,
  },
  input: {
    borderColor: '#e50914', // Bordas em vermelho Netflix
    backgroundColor: '#333', // Fundo cinza escuro para input
    color: '#fff', // Texto em branco
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  containerScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

