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

    };
};


const ComprarProduto: React.FC = () => {
    const navigation: any = useNavigation();

    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const id_reg = route?.params?.id_reg;

    const [quantidade, setQuantidade] = useState("");
    const [lucro, setLucro] = useState("");
    const [alterarValor, setAlterarValor] = useState("Não");
    const [valor_custo, setValorCusto] = useState("");
        
    const [lista_for, setListaFor] = useState<any[]>([]);
    const [forn, setForn] = useState("");


    const [sucess, setSucess] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);


    async function selectListaForn() {
        try {
            const response = await api.get('produtos/listar_forn.php');

            setListaFor(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }

    async function saveData() {

        const user = await AsyncStorage.getItem('@user');  

        if (quantidade == "" || valor_custo == "") {
            showMessage({
                message: "Erro ao Salvar",
                description: 'Preencha os Campos Obrigatórios!',
                type: "warning",
            });
            return;
        }
        setSucess(true);

        try {
            const obj = {
                id: id_reg,
                quantidade: quantidade,
                valor_custo: valor_custo,
                lucro: lucro,
                forn: forn,
                alterarValor: alterarValor,
                user:user
                
            }

            const res = await api.post("produtos/salvar_compra.php", obj);

            if (res.data.sucesso === false) {
                showMessage({
                    message: "Erro ao Salvar",
                    description: res.data.mensagem,
                    type: "warning",
                });

                return;
            }

            setQuantidade("");
            setValorCusto("");
            setLucro("");
            setForn("");
           
          
            showMessage({
                message: "Salvo",
                description: 'Registro Salvo com Sucesso!!',
                type: "success",
            });

            navigation.push("Produtos")

        } catch (error) {
            Alert.alert("Ops", "Alguma coisa deu errado, tente novamente.");
            setSucess(false);
        }
    }




    useEffect(() => {
        selectListaForn().then(() => setLoading(false))
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
                        <Text style={styles.TitleText}>Comprar Produto</Text>
                    </View>          

            </View>

            <ScrollView>

            <View>
                    <Text style={styles.TitleInputs}>Quantidade *</Text>

                    <TextInput
                        placeholder="Quantidade"
                        onChangeText={(text) => setQuantidade(text)}
                        value={quantidade}
                        style={styles.TextInput}
                        keyboardType='numeric'
                    />
                </View>

                <View>
                    <Text style={styles.TitleInputs}>Valor Compra *</Text>

                    <TextInput
                        placeholder="Valor Custo"
                        onChangeText={(text) => setValorCusto(text)}
                        value={valor_custo}
                        style={styles.TextInput}

                    />
                </View>

               
                <View>
                <Text style={styles.TitleInputs}>Fornecedor</Text>
                <View style={styles.TextInput}>
                    <Picker
                        selectedValue={forn}
                        onValueChange={(itemValue, itemIndex) => setForn(itemValue)}
                    >
                        
                        {lista_for.map((item: any) =>
                            <Picker.Item key={item.id} label={item.nome} value={item.id} />
                        )}
                    </Picker>
                </View>
            </View>


            <View>
                    <Text style={styles.TitleInputs}>Lucro % (Opcional)</Text>

                    <TextInput
                        placeholder="Lucro"
                        onChangeText={(text) => setLucro(text)}
                        value={lucro}
                        style={styles.TextInput}
                        keyboardType='numeric'
                    />
                </View>


            <View>
                    <Text style={styles.TitleInputs}>Alterar Custo Produto</Text>
                    <View style={styles.Picker}>
                        <Picker
                            selectedValue={alterarValor}
                            onValueChange={(itemValue, itemIndex) => setAlterarValor(itemValue)}
                            style={{ color: '#000' }}
                        >   
                            <Picker.Item label="Não" value="Não" />
                            <Picker.Item label="Sim" value="Sim" />
                            
                        </Picker>
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
                <Text style={styles.ButtonText}>Salvar Registro</Text>
            </RectButton>


            {/* <NewPacientes /> */}

        </View>
    );
}

export default ComprarProduto;