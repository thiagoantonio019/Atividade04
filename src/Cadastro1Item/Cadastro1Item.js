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
  const cadastrar = () => {
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
    cadastrar();
  }, []);

  /**
   * Função utilizada inserir um novo registro
   */
  const salvaFilme = () => {
    if (inputText.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira um texto válido para adicionar o Filme');
      return;
    }
    if (operacao === 'Incluir') {
      db.transaction(
        tx => {
          tx.executeSql(
            'INSERT INTO clientes (nome) VALUES (?)',
            [inputText],
            (_, { rowsAffected }) => {
              console.log(rowsAffected);
              setInputText('');
              cadastrar();
              console.log('Filme Cadastrado com sucesso');
              Alert.alert('Sucesso!', 'O Filme foi cadastrado com sucesso!');
            },
            (_, error) => {
              console.error('Erro ao adicionar cliente:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao adicionar o Filme.');
            }
          );
        }
      );
    } 
  };

  /**
   * Função utilizada atualizar um registro
   */
  const handleButtonPress = (nomeCLi) => {
    // Aqui você pode definir o texto que deseja adicionar ao TextInput
    setInputText(nomeCLi);
  };



  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <View style={styles.container}>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite um novo Filme"
          />
          <Button title="Adicionar" onPress={salvaFilme} />
         

      

          
        </View>
       

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    backgroundColor: '#141414', // Fundo escuro característico da Netflix
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e50914', // Cor vermelha da Netflix para bordas e destaques
    backgroundColor: '#fff', // Um fundo mais escuro para o campo de entrada
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: 'black', // Texto branco para maior legibilidade
    fontSize: 16, // Tamanho de fonte confortável
  },
  button: {
    backgroundColor: '#e50914', // Botão com o vermelho da Netflix
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', // Texto do botão em branco
    fontSize: 16,
    fontWeight: 'bold',
  },
});


