import { useNavigation } from "@react-navigation/core";
import React, {useEffect, useState} from "react";
import {styles} from './style';
import {
    TouchableOpacity,
    View,
    Text,
    TextInput,
    Image,
    StatusBar,
    Alert,
    AsyncStorage,
  } from 'react-native';

  
  import { Splash } from '../../lotties/Splash';
  import api from '../../services/api';

  export default function Login() {

  // 0 - carregando, 1 - logado, 2 - deslogado
  

    const navigation: any = useNavigation();

    const [logged, setLogged] = useState(0);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    
    async function login(){
      const obj = { email, senha };
  
      const res = await api.post('login/login.php', obj);
      
      if(res.data.success === 'Dados Incorretos!'){
        Alert.alert('Ops!', 'Dados Incorretos!');
      }else{
        await AsyncStorage.setItem('@user', JSON.stringify(res.data.result[0].id));
                
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }]
        });
      }
    }


    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('@user');
     
      if(user){
        setLogged(1);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        setLogged(2)
      }
    }
  
    useEffect(() => {
      checkLogin();
    }, []);
  
    if(logged === 0){
      return <Splash />
    }


      return(
        <View style={styles.container}>
        <StatusBar translucent hidden />
  
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
  
        <View style={styles.form}>
          <TextInput
            style={styles.login}
            placeholder="Email"
            value={email}
            onChangeText={ (email) => setEmail(email)}
          />
  
          <TextInput
            secureTextEntry={true}
            style={styles.login}
            placeholder="Senha"
            value={senha}
            onChangeText={ (senha) => setSenha(senha)}
          />
  
          <TouchableOpacity
            style={styles.loginSave}
            onPress={login}
          >
            <Text style={styles.text}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
      )
  }