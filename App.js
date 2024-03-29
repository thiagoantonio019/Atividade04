import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import Home from './src/Home/Home';
import Cadastro1Item from  './src/Cadastro1Item/Cadastro1Item';
import ExibirRegistros from './src/ExibirRegistros/ExibirRegistros';
// import PesquisaFilme from '.src/PesquisaFilme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{
              title: 'Home',
              headerShown:false
            }}
          />
          <Stack.Screen
            name='Cadastro1Item'
            component={Cadastro1Item}
            options={{
              title: 'Cadastro1Item' ,
            }}
          />
          <Stack.Screen
            name='ExibirRegistros'
            component={ExibirRegistros}
            options={{
              title: 'ExibirRegistros',
            }}
          />
 
           {/* <Stack.Screen
            name="PesquisaFilme"
            component={PesquisaFilme}
            options={{
              title: 'PesquisaFilme',
              // headerLeft: () => (
              //   <View style={{ paddingHorizontal: 20 }}><Text>Ícone</Text></View>
              // )
            }}
          />      */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  alignVH: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
