import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Image, Animated, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Home() {
    const navigation = useNavigation();

    const cadastrar = () => {
        navigation.navigate('Cadastro1Item');
    };

    const ExibirRegistros = () => {
        navigation.navigate('ExibirRegistros');
    };

    const EditarFilme = () => {
        navigation.navigate('PesquisaFilme');
    };

    // Estados para controlar as animações
    const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim, setScaleAnim] = useState(new Animated.Value(0.5)); // Inicia com a escala 0.5

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();

        Animated.spring(scaleAnim, { // Usaremos Animated.spring para a animação de escala
            toValue: 1,
            friction: 4, // Controle de "fricção" da animação de mola
            useNativeDriver: true,
        }).start();
    }, [fadeAnim, scaleAnim]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.Image
                source={require('../assets/estrelaCine.webp')}
                style={[styles.logo, {transform: [{scale: scaleAnim}]}]} // Aplicando a animação de escala
                resizeMode="contain"
            />
            <Animated.Text style={[styles.welcomeText, {opacity: fadeAnim}]}>
                Seja bem-vindo ao EsstrelaCine !
            </Animated.Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={ExibirRegistros}>
                    <FontAwesome5 name="film" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Exibir todos os Filmes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={cadastrar}>
                    <FontAwesome5 name="plus" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Cadastrar um filme</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={EditarFilme}>
                    <FontAwesome5 name="search" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Pesquise um Filme</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141414',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop:30
    },
    welcomeText: {
        color: '#ffffff',
        fontSize: 24,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#e50914',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        width: 300,
        height: 150,
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    buttonIcon: {
        marginRight: 10,
    },
    button: {
        flexDirection: 'row', // Para alinhar ícone e texto horizontalmente
        backgroundColor: '#e50914',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
});
