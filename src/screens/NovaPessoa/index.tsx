import React, { useState, useEffect } from 'react';
import { Alert, Picker, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';

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


const NovoCliente: React.FC = () => {
    const navigation: any = useNavigation();

    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const id_reg = route?.params?.id_reg;

    const [nome, setNome] = useState("");
    const [celular, setCelular] = useState("");
    const [endereco, setEndereco] = useState("");
    const [email, setEmail] = useState("");
    const [ativo, setAtivo] = useState("Sim");
    const [cpf, setCPF] = useState("");
    const [pessoa, setPessoa] = useState("Física");
    const [obs, setObs] = useState("");
    const [agencia, setAgencia] = useState("");
    const [conta, setConta] = useState("");
    const [lista_banco, setListaBanco] = useState<any[]>([]);
    const [banco, setBanco] = useState("");


    const [sucess, setSucess] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);


    async function selectListaBancos() {
        try {
            const response = await api.get('clientes/listar_bancos.php');

            setListaBanco(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }

    async function saveData() {

        if (nome == "" || cpf == "" || pessoa == "" || ativo == '') {
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
                nome: nome,
                celular: celular,
                endereco: endereco,
                email: email,
                ativo: ativo,
                obs: obs,
                cpf: cpf,
                pessoa: pessoa,
                conta: conta,
                agencia: agencia,
                banco: banco,
            }

            const res = await api.post("clientes/salvar.php", obj);

            if (res.data.sucesso === false) {
                showMessage({
                    message: "Erro ao Salvar",
                    description: res.data.mensagem,
                    type: "warning",
                });

                return;
            }

            setNome("");
            setCelular("");
            setEndereco("");
            setEmail("");
            setObs("");
            setCPF("");
            setAgencia("");
            setConta("");

            showMessage({
                message: "Salvo",
                description: 'Registro Salvo com Sucesso!!',
                type: "success",
            });

            navigation.push("Pessoas")

        } catch (error) {
            Alert.alert("Ops", "Alguma coisa deu errado, tente novamente.");
            setSucess(false);
        }
    }



    async function loadData() {
        try {
            setLoading(true);
            if (id_reg != "0") {
                const res = await api.get(`clientes/listar_id.php?id=${id_reg}`);

                setNome(res.data.dados.nome);
                setCelular(res.data.dados.telefone);
                setCPF(res.data.dados.cpf);
                setEndereco(res.data.dados.endereco);
                setPessoa(res.data.dados.pessoa);
                setEmail(res.data.dados.email);
                setAtivo(res.data.dados.ativo);
                setAgencia(res.data.dados.agencia);
                setConta(res.data.dados.conta);
                setBanco(res.data.dados.banco);
                setObs(res.data.dados.obs);
                setEdit(false);
               

            } else {
                setEdit(true);
            }
        } catch (error) {
            console.log('Error ao carregar os Dados');
        }
    }



    useEffect(() => {
        loadData().then(() => {
            selectListaBancos().then(() => setLoading(false))
        })
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
                {edit ?
                    <View style={styles.Title}>
                        <Text style={styles.TitleText}>Inserir Registro</Text>
                    </View>

                    :

                    <View style={styles.Title}>
                        <Text style={styles.TitleText}>Editar Registro</Text>
                    </View>
                }

            </View>

            <ScrollView>
                <View>
                    <Text style={styles.TitleInputs}>Nome completo *</Text>

                    <TextInput
                        placeholder="Nome completo"
                        onChangeText={(text) => setNome(text)}
                        value={nome}
                        style={styles.TextInput}

                    />
                </View>


                <View>
                    <Text style={styles.TitleInputs}>Física / Jurídica *</Text>
                    <View style={styles.Picker}>
                        <Picker
                            selectedValue={pessoa}
                            onValueChange={(itemValue, itemIndex) => setPessoa(itemValue)}
                            style={{ color: '#000' }}
                        >
                            <Picker.Item label="Física" value="Física" />
                            <Picker.Item label="Jurídica" value="Jurídica" />

                        </Picker>
                    </View>
                </View>


                <View>
                    <Text style={styles.TitleInputs}>CPF / CNPJ *</Text>

                    {(() => {
                        if (pessoa == 'Física') {
                            return (
                                <TextInputMask
                                    style={styles.TextInput}
                                    type={'cpf'}
                                    value={cpf}
                                    onChangeText={text => setCPF(text)}
                                    placeholder="CPF"
                                />
                            )
                        } else {
                            return (
                                <TextInputMask
                                    style={styles.TextInput}
                                    type={'cnpj'}
                                    value={cpf}
                                    onChangeText={text => setCPF(text)}
                                    placeholder="CNPJ"
                                />
                            )
                        }
                    })()}


                </View>

                <View>
                    <Text style={styles.TitleInputs}>Celular</Text>

                    <TextInputMask
                        style={styles.TextInput}
                        type={'cel-phone'}
                        options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(31) '
                        }}
                        value={celular}
                        onChangeText={text => setCelular(text)}
                        placeholder="Telefone Celular"
                    />
                </View>

                <View>
                    <Text style={styles.TitleInputs}>Endereço</Text>

                    <TextInput
                        placeholder="Rua A Nº 50 Bairro Teste"
                        onChangeText={(text) => setEndereco(text)}
                        value={endereco}
                        style={styles.TextInput}

                    />
                </View>

                <View>
                    <Text style={styles.TitleInputs}>Email</Text>

                    <TextInput
                        placeholder="Email"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        style={styles.TextInput}

                    />
                </View>

                <View>
                    <Text style={styles.TitleInputs}>Ativo *</Text>
                    <View style={styles.Picker}>
                        <Picker
                            selectedValue={ativo}
                            onValueChange={(itemValue, itemIndex) => setAtivo(itemValue)}
                            style={{ color: '#000' }}
                        >
                            <Picker.Item label="Sim" value="Sim" />
                            <Picker.Item label="Não" value="Não" />

                        </Picker>
                    </View>
                </View>


                <View>
                    <Text style={styles.TitleInputs}>Observações</Text>

                    <TextInput
                        placeholder="Observações"
                        onChangeText={(text) => setObs(text)}
                        value={obs}
                        style={styles.TextInputArea}
                        multiline={true}
                        numberOfLines={6}
                    />
                </View>


                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf: "center"}}>
                    <View style={{width:'50%'}}>
                    <Text style={styles.TitleInputs}>Conta</Text>
                    <TextInput
                        placeholder="Conta"
                        onChangeText={(text) => setConta(text)}
                        value={conta}
                        style={styles.TextInput}

                    />
                    </View>

                    <View style={{width:'50%'}}>
                    <Text style={styles.TitleInputs}>Agencia</Text>
                    <TextInput
                        placeholder="Agencia"
                        onChangeText={(text) => setAgencia(text)}
                        value={agencia}
                        style={styles.TextInput}

                    />
                    </View>    
                </View>


                <View>
                <Text style={styles.TitleInputs}>Lista de Bancos</Text>
                <View style={styles.TextInput}>
                    <Picker
                        selectedValue={banco}
                        onValueChange={(itemValue, itemIndex) => setBanco(itemValue)}
                    >
                        <Picker.Item label="Selecionar Banco" value="" />
                        {lista_banco.map((item: any) =>
                            <Picker.Item key={item.nome} label={item.nome} value={item.nome} />
                        )}
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

export default NovoCliente;