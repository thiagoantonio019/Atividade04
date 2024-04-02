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

  const excluiCliente = id => {
    Alert.alert(
      "Excluir Filme",
      "Você realmente tem certeza disso?",
      [
        {
          text: "Não",
          onPress: () => console.log("Ação de excluir cancelada"),
          style: "cancel"
        },
        { text: "Sim", onPress: () => realmenteExcluirCliente(id) }
      ],
      { cancelable: false }
    );
  };

  const realmenteExcluirCliente = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM clientes WHERE id = ?',
        [id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            Alert.alert('Sucesso', 'Registro excluído com sucesso.');
            ExibirRegistros();
            if (id === id) {
              setInputText('');
              setGenero('');
              setClassificacao('');
              setDataCadastro('');
              setId(null);
            }
          } else {
            Alert.alert('Erro', 'Nenhum registro foi excluído, verifique e tente novamente!');
          }
        },
        (_, error) => console.error('Erro ao excluir cliente:', error)
      );
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Inputs e botão de atualização... */}
          
          <View style={styles.containerScroll}>
            {todos.map((cliente) => (
              <View key={cliente.id} style={styles.clienteItem}>
                <Text style={styles.text}>Nome: {cliente.nome}</Text>
                <Text style={styles.text}>Gênero: {cliente.genero}</Text>
                <Text style={styles.text}>Classificação: {cliente.classificacao}</Text>
                <Text style={styles.text}>Data Cadastro: {cliente.dataCadastro}</Text>
                <View style={styles.buttonTable}>
                  <View style={styles.edit}>
                    <TouchableOpacity onPress={() => handleButtonPress(cliente)}>
                      <FontAwesome6 name="pen-to-square" size={24} color="silver" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.lixo}>
                    <TouchableOpacity onPress={() => excluiCliente(cliente.id)}>
                      <FontAwesome6 name="trash-can" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
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
    backgroundColor: '#141414',
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  containerScroll: {
    marginTop: 20,
  },
  clienteItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    color: '#000',
    marginBottom: 5,
  },
  input: {
    borderColor: '#e50914',
    backgroundColor: '#333',
    color: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20
  },
  buttonTable: {
    flexDirection: 'row', // Isso alinha os itens em linha
    justifyContent: 'space-between', // Isso coloca espaço máximo entre os itens, empurrando-os para os lados opostos
    marginTop: 10, // Adiciona um pouco de espaço acima dos botões para separá-los do texto
  },

});


