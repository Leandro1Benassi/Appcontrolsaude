import React, { useState, useEffect } from 'react';
import {AsyncStorage, Alert, Picker, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { Success } from '../../lotties/Success';
import { TextInputMask } from 'react-native-masked-text';
import { showMessage, hideMessage } from "react-native-flash-message";

import api from '../../services/api';

type ParamList = {
    Detail: {
        id_reg: string;
        valor_conta: string;
    };
};


const BaixarPagar: React.FC = () => {
    const navigation: any = useNavigation();
    

    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const id_reg = route?.params?.id_reg;
    const valor_conta = route?.params?.valor_conta;

    
    let [valor, setValor] = useState(valor_conta);
    const [saida, setSaida] = useState("Caixa");
    let [multa, setMulta] = useState("0");
    let [juros, setJuros] = useState("0");
    let [desconto, setDesconto] = useState("0");
    let [subtotal, setSubtotal] = useState(valor_conta);
        
    const [lista_for, setListaFor] = useState<any[]>([]);
    


    const [sucess, setSucess] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);


    async function selectListaForn() {
        try {
            const response = await api.get('pagar/listar_saida.php');

            setListaFor(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }

    async function calcular() {
        if (valor == "") {
            valor = "0";
        }

        if (juros == "") {
            juros = "0";
        }

        if (multa == "") {
            multa = "0";
        }

        if (desconto == "") {
            desconto = "0";
        }
        try {
            const obj = {
                valor: valor,
                multa: multa,
                juros: juros,
                desconto: desconto,
                              
            }

            const res = await api.post("pagar/calcular.php", obj);
            setSubtotal(res.data.mensagem.toString());  
                    
                     

        } catch (error) {
            Alert.alert("Ops", "Erro no calculo");
            setSucess(false);
        }         
    }

    async function saveData() {

        const user = await AsyncStorage.getItem('@user');  

        if (valor == "" || valor == "0" || parseFloat(valor) > parseFloat(valor_conta)) {
            showMessage({
                message: "Erro ao Salvar",
                description: 'Preencha os Valor Corretamente!',
                type: "warning",
            });
            return;
        }
        setSucess(true);

        try {
            const obj = {
                id: id_reg,
                valor: valor,
                saida: saida,
                multa: multa,
                juros: juros,
                desconto: desconto,
                subtotal: subtotal,
                user:user
                
            }

            const res = await api.post("pagar/baixar.php", obj);

            if (res.data.sucesso === false) {
                showMessage({
                    message: "Erro ao Baixar",
                    description: res.data.mensagem,
                    type: "warning",
                });

                return;
            }

            setValor(valor_conta);
            setMulta("");
            setJuros("");
            setDesconto("");
            setSubtotal(valor_conta);
           
          
            showMessage({
                message: "Salvo",
                description: 'Registro Salvo com Sucesso!!',
                type: "success",
            });

            navigation.push("Pagar")

        } catch (error) {
            Alert.alert("Ops", "Alguma coisa deu errado, tente novamente.");
            setSucess(false);
        }
    }




    useEffect(() => {
        selectListaForn().then(() => setLoading(false)).then(() => calcular())
    }, [])

    if (loading === true) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ActivityIndicator style={{ marginTop: 100 }} color="#000" size="large" />
            </View>
        )
    }

    if (sucess) {
        return <Success />
    }


    return (
        <View style={{ flex: 1, marginTop: 20 }}>
            <View style={styles.Header}>
                <TouchableOpacity
                    style={styles.BackButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="md-arrow-back-circle-outline" size={35} color="#484a4d" />

                </TouchableOpacity>
                
                    <View style={styles.Title}>
                        <Text style={styles.TitleText}>Baixar Conta - R$ {valor_conta}</Text>
                    </View>          

            </View>

            <ScrollView>

            <View>
                    <Text style={styles.TitleInputs}>Valor *</Text>

                    <TextInput
                        placeholder="Valor"
                        onChangeText={(text) => setValor(text)}
                        value={valor}
                        style={styles.TextInput}
                        onTextInput= {() => calcular()}
                    />
                </View>

                             
                <View>
                <Text style={styles.TitleInputs}>Saída</Text>
                <View style={styles.TextInput}>
                    <Picker
                        selectedValue={saida}
                        onValueChange={(itemValue, itemIndex) => setSaida(itemValue)}
                    >
                        <Picker.Item label="Caixa (Movimento)" value="Caixa" />
                        {lista_for.map((item: any) =>
                            <Picker.Item key={item.nome} label={item.nome} value={item.nome} />
                        )}
                    </Picker>
                </View>
            </View>


            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf: "center"}}>
                    <View style={{width:'50%'}}>
                    <Text style={styles.TitleInputs}>Multa em R$</Text>

                    <TextInput
                        placeholder="Valor da Multa"
                        onChangeText={(text) => setMulta(text)}
                        value={multa}
                        style={styles.TextInput}
                        onTextInput= {() => calcular()}
                    />
                </View>


                <View style={{width:'50%'}}>
                    <Text style={styles.TitleInputs}>Júros em R$</Text>

                    <TextInput
                        placeholder="Valor do Júros"
                        onChangeText={(text) => setJuros(text)}
                        value={juros}
                        style={styles.TextInput}
                        onTextInput= {() => calcular()}
                       
                    />
                </View>
                </View>

                
                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf: "center"}}>
                    <View style={{width:'50%'}}>
                    <Text style={styles.TitleInputs}>Desconto em R$</Text>

                    <TextInput
                        placeholder="Desconto"
                        onChangeText={(text) => setDesconto(text)}
                        value={desconto}
                        style={styles.TextInput}
                        onTextInput= {() => calcular()}
                    />
                </View>

                <View style={{width:'50%'}}>
                    <Text style={styles.TitleInputs}>SubTotal</Text>

                    <TextInput
                        placeholder="Subtotal"
                        onChangeText={(text) => setSubtotal(text)}
                        value={subtotal}
                        style={styles.TextInput}
                        editable={false}
                       
                    />
                </View>
                </View>

            </ScrollView>



            <RectButton
                style={styles.Button}
                onPress={() => {
                    setSucess(true);
                    saveData();
                    setSucess(false);
                }}
            >
                <Text style={styles.ButtonText}>Dar Baixa</Text>
            </RectButton>


            {/* <NewPacientes /> */}

        </View>
    );
}

export default BaixarPagar;