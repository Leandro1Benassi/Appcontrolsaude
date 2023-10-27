import React, { useState, useEffect } from 'react';
import { AsyncStorage, Platform, Image, Button, Alert, Picker, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { add, format } from 'date-fns';
import { styles } from './styles';
import { Success } from '../../lotties/Success';
import { TextInputMask } from 'react-native-masked-text';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import urlImg from '../../services/urlImg';
type ParamList = {
    Detail: {
        subTotal: string;
        cliente: string;
    };
};


const NovaContaReceber: React.FC = () => {
    const navigation: any = useNavigation();



    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    let subTot = route?.params?.subTotal;
    subTot = subTot.replace(".","");
    subTot = subTot.replace(",",".");
    const cliente = route?.params?.cliente;

        
    let [subTotal, setSubTotal] = useState(subTot.toString());
    let [acrescimo, setAcrescimo] = useState("0");
    let [desconto, setDesconto] = useState("0");
    let [parcelas, setParcelas] = useState("1");
    const [totalReceb, setTotalReceb] = useState("");

    const [lista_saida, setListaSaida] = useState<any[]>([]);
    const [saida, setSaida] = useState("Caixa");

    const [doc, setDoc] = useState("Dinheiro");


    const [dataVenda, setDataVenda] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = async (event: any, selectedDate: any) => {
        const currentDate = selectedDate || dataVenda;
        setShow(Platform.OS === 'ios');
        setDataVenda(currentDate);
    };


    const [sucess, setSucess] = useState(false);

    const [loading, setLoading] = useState(false);

    const data = new FormData();


    async function calcular() {
        if (acrescimo == "") {
            acrescimo = "0";
        }

        if (desconto == "") {
            desconto = "0";
        }

               
        try {
            const obj = {
                acrescimo: acrescimo,
                desconto: desconto,
                subtotal: subTot,              
            }
            
            
            const res = await api.post("vendas/calcular.php", obj);
            setSubTotal(res.data.mensagem.toString());  
                    
                     

        } catch (error) {
            Alert.alert("Ops", "Erro no calculo");
            setSucess(false);
        }         
    }


    async function parcelar() {
        const user = await AsyncStorage.getItem('@user');
        const dataVendaF = format(dataVenda, 'yyyy-MM-dd');
        if (parcelas == "") {
            parcelas = "1";
        }

                      
        try {
            const obj = {

                user: user,
                subtotal: subTotal,
                data: dataVendaF,
                parcelas: parcelas,              
            }
            
            
            const res = await api.post("vendas/parcelar.php", obj);
            //setSubTotal(res.data.mensagem.toString());  
                    
                     

        } catch (error) {
            Alert.alert("Ops", "Erro no calculo");
            setSucess(false);
        }         
    }



    async function selectListaSaida() {
        try {
            const response = await api.get('vendas/listar_entradas.php');

            setListaSaida(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }


    async function saveData() {
        
        const user = await AsyncStorage.getItem('@user');
        const dataVendaF = format(dataVenda, 'yyyy-MM-dd');
       

        if (parcelas == "") {
            showMessage({
                message: "Erro ao Salvar",
                description: 'Preencha o número de Parcelas!',
                type: "warning",
            });
            setSucess(false);
            return;
        }

        
        setSucess(true);

        try {
            const obj = {
                
                desconto: desconto,
                acrescimo: acrescimo,
                subtotal: subTotal,
                entrada: saida,
                parcelas: parcelas,
                totalReceb: totalReceb,
                dataVenda: dataVendaF,
                pagamento: doc,
                lancamento: saida,
                cliente: cliente,
                user: user
            }

            const res = await api.post("vendas/salvar.php", obj);

            if (res.data.sucesso === false) {
                showMessage({
                    message: "Erro ao Salvar",
                    description: res.data.mensagem,
                    type: "warning",
                });
                setSucess(false);
                return;
            }

            setDesconto("");
            setAcrescimo("");
            setTotalReceb("");
            

            showMessage({
                message: "Salvo",
                description: 'Registro Salvo com Sucesso!!',
                type: "success",
            });

            navigation.push("Vendas")

        } catch (error) {
            Alert.alert("Ops", "Alguma coisa deu errado, tente novamente.");
            setSucess(false);
        }
    }



    useEffect(() => {
        selectListaSaida().then(() => setLoading(false)).then(() => parcelar())
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
                    onPress={() => navigation.push("NovaVenda")}
                >
                    <Ionicons name="md-arrow-back-circle-outline" size={35} color="#484a4d" />

                </TouchableOpacity>
                <View style={styles.Title}>
                    <Text style={styles.TitleText}>Finalizar Venda</Text>
                </View>

            </View>

            <ScrollView>



                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: "center" }}>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.TitleInputs}>Desconto</Text>

                        <TextInput
                            placeholder="Desconto "
                            onChangeText={(text) => setDesconto(text)}
                            value={desconto}
                            style={styles.TextInput}
                            onTextInput= {() => calcular()}
                        />
                    </View>

                    <View style={{ width: '50%' }}>
                        <Text style={styles.TitleInputs}>Acréscimo</Text>

                        <TextInput
                            placeholder="Acréscimo "
                            onChangeText={(text) => setAcrescimo(text)}
                            value={acrescimo}
                            style={styles.TextInput}
                            onTextInput= {() => calcular()}
                        />
                    </View>
                </View>


                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: "center" }}>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.TitleInputs}>SubTotal</Text>

                        <TextInput
                            placeholder="SubTotal "
                            onChangeText={(text) => setSubTotal(text)}
                            value={subTotal}
                            style={styles.TextInput}
                            editable={false}
                        />
                    </View>

                    <View style={{ width: '50%' }}>
                        <Text style={styles.TitleInputs}>Parcelas</Text>

                        <TextInput
                            placeholder="Parcelas "
                            onChangeText={(text) => setParcelas(text)}
                            value={parcelas}
                            style={styles.TextInput}
                            keyboardType='numeric'
                            onTextInput= {() => parcelar()}
                        />
                    </View>
                </View>

                
                <View>
                    <Text style={styles.TitleInputs}>Total Recebido</Text>

                    <TextInput
                        placeholder="Total Recebido "
                        onChangeText={(text) => setTotalReceb(text)}
                        value={totalReceb}
                        style={styles.TextInput}
                        
                    />
                </View>

                
                <View>
               
                   
                            <Text style={styles.TitleInputs}>
                                Data Venda {" "} 

                                    <TouchableOpacity                        
                        onPress={() => {
                            setDataVenda(add(new Date(), { days: 30 }));
                            }} >

                                <Text style={{fontSize:14}}>
                                ( 30 Dias {" "}  
                                </Text>

                                </TouchableOpacity>

                                <TouchableOpacity                        
                        onPress={() => {
                            setDataVenda(add(new Date(), { days: 60 }));
                            }} >

                                <Text style={{fontSize:14}}>
                                / 60 Dias {" "} 
                                </Text>

                                </TouchableOpacity>

                                <TouchableOpacity                        
                        onPress={() => {
                            setDataVenda(add(new Date(), { days: 90 }));
                            }} >

                                <Text style={{fontSize:14}}>
                                / 90 Dias ) 
                                </Text>

                                </TouchableOpacity>
                               
                                
                                </Text> 

                                

                            <TouchableOpacity
                                style={styles.pickDate}
                                onPress={() => setShow(true)}
                            >
                                <Text style={styles.date}>{format(dataVenda, 'dd/MM/yyyy')}</Text>
                                <AntDesign style={{ alignSelf: 'center', position:'absolute', right:25, }} name="caretdown" size={10} color="gray" />
                            </TouchableOpacity>
                        </View>
                        

                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={dataVenda}
                                mode="date"
                                is24Hour={true}
                                display="calendar"
                                onChange={onChange}
                            />
                        )}



                <View>
                    <Text style={styles.TitleInputs}>Entrada</Text>
                    <View style={styles.TextInput}>
                        <Picker
                            selectedValue={saida}
                            onValueChange={(itemValue, itemIndex) => setSaida(itemValue)}
                        >
                            <Picker.Item label='Caixa (Movimento)' value='Caixa' />
                            {lista_saida.map((item: any) =>
                                <Picker.Item key={item.nome} label={item.nome} value={item.nome} />
                            )}


                        </Picker>
                    </View>
                </View>




                <View>
                    <Text style={styles.TitleInputs}>Pagamento</Text>
                    <View style={styles.TextInput}>
                        <Picker
                            selectedValue={doc}
                            onValueChange={(itemValue, itemIndex) => setDoc(itemValue)}
                        >

                            <Picker.Item label='Dinheiro' value='Dinheiro' />
                            <Picker.Item label='Boleto' value='Boleto' />
                            <Picker.Item label='Cheque' value='Cheque' />
                            <Picker.Item label='Conta Corrente' value='Conta Corrente' />
                            <Picker.Item label='Conta Poupança' value='Conta Poupança' />
                            <Picker.Item label='Carnê' value='Carnê' />
                            <Picker.Item label='DARF' value='DARF' />
                            <Picker.Item label='Depósito' value='Depósito' />
                            <Picker.Item label='Transferências' value='Transferências' />
                            <Picker.Item label='Pix' value='Pix' />
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
                <Text style={styles.ButtonText}>Finalizar Venda</Text>
            </RectButton>


            {/* <NewPacientes /> */}

        </View>
    );
}

export default NovaContaReceber;