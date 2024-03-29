import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
    const navigation = useNavigation();

    const cadastrar = () => {
        navigation.navigate('Cadastro1Item');
    };

    const ExibirRegistros = () => {
        navigation.navigate('ExibirRegistros');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcomeText}>Seja bem-vindo ao HubFlix !</Text>
            <TouchableOpacity style={styles.button} onPress={ExibirRegistros}>
                <Text style={styles.buttonText}>Exibir todos os Filmes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={cadastrar}>
                <Text style={styles.buttonText}>Cadastrar um filme</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141414', // Alterando o fundo para preto
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop:30
    },
    welcomeText: {
        color: '#ffffff', // Texto em branco
        fontSize: 24,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#e50914', // Botão com o vermelho Netflix
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#ffffff', // Texto do botão em branco
        fontSize: 16,
        fontWeight: 'bold',
    },
});
