import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Alert, TextInput,
  SafeAreaView, Platform, ScrollView, TouchableOpacity
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../database/database';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const db = DatabaseConnection.getConnection();

export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [genero, setGenero] = useState('');
  const [classificacao, setClassificacao] = useState('');
  const [dataCadastro, setDataCadastro] = useState('');
  const [id, setId] = useState(null);
  const [isCadastro, setIsCadastro] = useState(true); // Adicionado para controle do modo de cadastro

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS clientes (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          nome TEXT NOT NULL,
          genero TEXT, 
          classificacao TEXT, 
          dataCadastro TEXT
        )`,
        [],
        () => console.log('Tabela criada com sucesso'),
        (_, error) => console.error(error)
      );
    });
    ExibirRegistros();
  }, []);

  const ExibirRegistros = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM clientes',
        [],
        (_, { rows }) => setTodos(rows._array),
        (_, error) => console.error('Erro ao buscar todos:', error)
      );
    });
  };

  useEffect(() => {
    ExibirRegistros();
  }, []);

  const cadastrarFilme = () => {
    if (inputText.trim() === '' || genero.trim() === '' || classificacao.trim() === '' || dataCadastro.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos para cadastrar o filme.');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO clientes (nome, genero, classificacao, dataCadastro) VALUES (?, ?, ?, ?)',
        [inputText, genero, classificacao, dataCadastro],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            Alert.alert('Sucesso', 'Filme cadastrado com sucesso.');
            ExibirRegistros();
            setInputText('');
            setGenero('');
            setClassificacao('');
            setDataCadastro('');
          } else {
            Alert.alert('Erro', 'Não foi possível cadastrar o filme.');
          }
        },
        (_, error) => console.error('Erro ao cadastrar filme:', error)
      );
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputIconGroup}>
            <FontAwesome6 name="film" size={20} color="#e50914" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Nome do Filme"
              placeholderTextColor="#ccc"
              value={inputText}
              onChangeText={setInputText}
            />
          </View>
          
          <View style={styles.inputIconGroup}>
            <FontAwesome6 name="venus-mars" size={20} color="#e50914" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Gênero do Filme"
              placeholderTextColor="#ccc"
              value={genero}
              onChangeText={setGenero}
            />
          </View>
          
          <View style={styles.inputIconGroup}>
            <FontAwesome6 name="star" size={20} color="#e50914" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Classificação do Filme"
              placeholderTextColor="#ccc"
              value={classificacao}
              onChangeText={setClassificacao}
            />
          </View>
          
          <View style={styles.inputIconGroup}>
            <FontAwesome6 name="calendar-alt" size={20} color="#e50914" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Data de Cadastro (YYYY-MM-DD)"
              placeholderTextColor="#ccc"
              value={dataCadastro}
              onChangeText={setDataCadastro}
            />
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={cadastrarFilme}
          >
            <FontAwesome6 name="plus-circle" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cadastrar Filme</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


// Estilos permanecem inalterados...

// Atualizando os estilos para incluir os novos elementos:
const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    backgroundColor: '#141414',
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  inputIconGroup: {
    flexDirection: 'row', // Organiza ícone e campo de texto horizontalmente
    alignItems: 'center', // Centraliza verticalmente ícone e campo de texto
    marginBottom: 20,
    backgroundColor: '#333', // Fundo para o grupo, para se parecer com o TextInput
    borderRadius: 5, // Borda arredondada como no TextInput
  },
  inputIcon: {
    marginLeft: 10, // Adiciona espaço dentro do grupo, antes do ícone
    color: '#e50914', // Cor do ícone
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingLeft: 10, // Espaçamento entre o ícone e o texto
    // As outras propriedades do estilo do TextInput foram movidas para o grupo
  },
  button: {
    flexDirection: 'row', // Alinha ícone e texto do botão horizontalmente
    justifyContent: 'center', // Centraliza ícone e texto do botão
    backgroundColor: '#e50914',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 10, // Adiciona
    }
  });





