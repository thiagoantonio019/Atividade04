import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  SafeAreaView, Platform, ScrollView, TouchableOpacity, Animated
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../database/database';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Importando FontAwesome

const db = DatabaseConnection.getConnection();

export default function App() {
  const [todos, setTodos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0]; // Inicializando a animação

  const pesquisaFilme = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM clientes WHERE nome LIKE ?',
        [`%${pesquisa}%`],
        (_, { rows }) => {
          console.log("Filmes encontrados:", rows._array);
          setTodos(rows._array);
          Animated.timing( // Iniciando a animação
            fadeAnim,
            {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true
            }
          ).start();
        },
        (_, error) => {
          console.error('Erro ao buscar filmes:', error);
        }
      );
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <TextInput
            style={styles.input}
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Pesquisar Filme por Nome"
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity style={styles.button} onPress={pesquisaFilme}>
            <FontAwesome name="search" size={20} color="#fff" style={styles.buttonIcon}/>
            <Text style={styles.buttonText}>Pesquisar</Text>
          </TouchableOpacity>
          {todos.length > 0 ? (
            todos.map((filme, index) => (
              <Animated.View key={index} style={[styles.filmeItem, {opacity: fadeAnim}]}>
                <Text style={styles.filmeTexto}>Nome: {filme.nome}</Text>
                <Text style={styles.filmeTexto}>Gênero: {filme.genero}</Text>
                <Text style={styles.filmeTexto}>Classificação: {filme.classificacao}</Text>
                <Text style={styles.filmeTexto}>Data de Cadastro: {filme.dataCadastro}</Text>
              </Animated.View>
            ))
          ) : (
            <Text style={styles.filmeTexto}>Nenhum filme encontrado.</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


  const styles = StyleSheet.create({
    // Estilos existentes...
    buttonIcon: {
      marginRight: 10,
    },
  androidSafeArea: {
    flex: 1,
    backgroundColor: '#141414',
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  container: {
    flexGrow: 1,
    padding: 20,
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
  },
  filmeItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filmeTexto: {
    color: '#000',
    marginBottom: 5,
  },
});
