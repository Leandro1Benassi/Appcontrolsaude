import React, { useRef, useEffect, useState } from 'react';

import { TextInput, Picker, AsyncStorage, Linking, ActivityIndicator, Modal, Image, Alert, FlatList, Platform, Text, TouchableOpacity, View } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { add, format, parseISO, sub } from 'date-fns';
import { styles } from './style';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../components/Header';
import Load from '../../components/Load';
import Title from '../../components/Title';
import api from '../../services/api';
import fonts from '../../styles/fonts';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import SwipeableRow from './../../components/SwipeableRow/pagar';
import urlImg from '../../services/urlImg';
import { showMessage } from 'react-native-flash-message';

//import { Modalize } from 'react-native-modalize';
//import ArrowSvg from '../../assets/arrow.svg';


function Pagar() {
    const [abrirModal, setAbrirModal] = useState(false);
    const [abrirModalParc, setAbrirModalParc] = useState(false);

    const [lista_freq, setListaFreq] = useState<any[]>([]);
    const [frequencia, setFrequencia] = useState("Mensal");

    const [parcela, setParcela] = useState("");
    const [idConta, setIdConta] = useState("");

    const [valor, setValor] = useState("");
    const [forn, setForn] = useState("");
    const [saida, setSaida] = useState("");
    const [venc, setVenc] = useState("");
    const [doc, setDoc] = useState("");
    const [plano, setPlano] = useState("");
    const [emissao, setEmissao] = useState("");
    const [freq, setFreq] = useState("");
    const [arq, setArq] = useState("");
    const [usu, setUsu] = useState("");
    const [tumb, setTumb] = useState("");

    const [loading, setLoading] = useState(false);

   
    const navigation: any = useNavigation();
    const [contas, setContas] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [date, setDate] = useState<any>(new Date());
    const [show, setShow] = useState<any>(false);

    const [date2, setDate2] = useState<any>(new Date());
    const [show2, setShow2] = useState(false);

    async function selectListaFreq() {
        try {
            const response = await api.get('pagar/listar_freq.php');

            setListaFreq(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchData() {
        try {
            const date1 = format(date, 'yyyy-MM-dd');
            const dates2 = format(date2, 'yyyy-MM-dd')

            const response = await api.get(`pagar/listar.php?data=${date1}&data1=${dates2}`);

            if (response.data.resultado != "0") {
                setContas(response.data.resultado);
            } else {
                setContas([]);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onChange = async (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onChange2 = async (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date2;
        setShow2(Platform.OS === 'ios');
        setDate2(currentDate);
    };



    async function loadData(id_reg:string) {       
        try {   
                setLoading(true);
                const res = await api.get(`pagar/listar_id.php?id=${id_reg}`);
                setValor(res.data.dados.valor);
                setForn(res.data.dados.fornF);
                setPlano(res.data.dados.plano);
                setSaida(res.data.dados.saida);
                setDoc(res.data.dados.doc);                
                setVenc(res.data.dados.vencF);
                setEmissao(res.data.dados.emissao);
                setFreq(res.data.dados.freq);
                setArq(res.data.dados.arq);
                setUsu(res.data.dados.usu);
                setTumb(res.data.dados.tumb);

                setAbrirModal(true);
                setLoading(false);
                              
                           
        } catch (error) {
            console.log('Error ao carregar os Dados');
        }
    }



    async function modalParcelar(id_reg:string) {   
        setIdConta(id_reg);    
        try {   
                //setLoading(true);
                const res = await api.get(`pagar/listar_id.php?id=${id_reg}`);
                setValor(res.data.dados.valor);
                selectListaFreq();
                setAbrirModalParc(true);
                //setLoading(false);
                              
                           
        } catch (error) {
            console.log('Error ao carregar os Dados');
        }
    }



    async function gerarParcelas() {
        try {
        const obj = {
            id: idConta,
            parcelas: parcela,            
            frequencia: frequencia,
          }

        const res = await api.post("pagar/parcelar.php", obj);

        if (res.data.sucesso === false) {
            showMessage({
                message: "Erro ao Salvar",
                description: res.data.mensagem,
                type: "warning",
            });

            return;
        }
        
        
        setFrequencia("Mensal");
        setParcela("");
             
        showMessage({
            message: "Parcelado",
            description: 'Parcelado com Sucesso!!',
            type: "success",
        });

        setAbrirModalParc(false);
        fetchData();

    } catch (error) {
        Alert.alert("Ops", "Alguma coisa deu errado, tente novamente.");
       
    }
    }



    async function excluir(nome:string, id:string) {
        const user = await AsyncStorage.getItem('@user');
        Alert.alert('Sair', `Você tem certeza que deseja excluir a Conta de valor : ` + nome, [
            {
                text: 'Não',
                style: 'cancel',
            },

            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        const res = await api.get(`pagar/excluir.php?id=${id}&user=${user}`);
                        
                        if (res.data.sucesso === false) {
                            showMessage({
                                message: "Restrição ao Excluir",
                                description: res.data.mensagem,
                                type: "warning",
                            });
            
                            return;
                        }

                        showMessage({
                            message: "Exclusão",
                            description: 'Registro '+nome+' Excluído com Sucesso',
                            type: "info",
                          });  
                        navigation.push('Pagar');
                    } catch (error) {
                        Alert.alert('Não foi possivel excluir, tente novamente!')
                    }
                }
            }
        ])
    }



    const Headers = ({ item }: any) => {
        return (
            <View style={{ marginBottom: 10, }}>
                <View style={styles.dates}>
                    <RectButton
                        style={styles.ButtonDates}
                        onPress={() => {
                            setDate(sub(new Date(), { years: 1 }));
                            setDate2(sub(new Date(), { days: 1 }));
                        }}
                    >
                        <Text style={styles.ButtonDatesText}>Vencidas</Text>
                    </RectButton>

                    <RectButton
                        style={styles.ButtonDates}
                        onPress={() => {
                            setDate(new Date());
                            setDate2(new Date());
                        }}
                    >
                        <Text style={styles.ButtonDatesText}>Hoje</Text>
                    </RectButton>

                    <RectButton
                        style={styles.ButtonDates}
                        onPress={() => {
                            setDate(add(new Date(), { days: 1 }));
                            setDate2(add(new Date(), { days: 1 }))
                        }}
                    >
                        <Text style={styles.ButtonDatesText}>Amanhã</Text>
                    </RectButton>
                </View>

                <View style={styles.Dates}>
                    <TouchableOpacity
                        style={styles.pickDate}
                        onPress={() => setShow(true)}
                    >
                        <Text style={{ fontFamily: fonts.text, fontSize: 16 }}>DE</Text>
                        <Text style={styles.date}>{format(date, 'dd/MM/yyyy')}</Text>
                    </TouchableOpacity>

                    <View style={{ alignSelf: 'center' }}>
                         <Ionicons name="md-arrow-forward-outline" size={30} color="#484a4d" />
                    </View>

                    <TouchableOpacity
                        style={styles.pickDate}
                        onPress={() => setShow2(true)}
                    >
                        <Text style={{ fontFamily: fonts.text, fontSize: 16 }}>ATÉ</Text>
                        <Text style={styles.date}>{format(date2, 'dd/MM/yyyy')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    const renderItem = ({ item }: any) => {
        const valor = String(item.valor).replace(".", ',');
        const data = parseISO(item.vencimento) || item.vencimento;
        const vencimento = format(data, 'dd/MM/yyyy');

        return (

            <View 
            style={
                (() => {
                    if (item.status == 'Pendente') {
                        return (
                            styles.CardContainer
                        )
                    } else {
                        return (
                            styles.CardContainerVerde
                        )
                    }
                })()
            }
            
           >
                    <SwipeableRow 
                        onPressWhatsapp={async () => {
                            navigation.push('BaixarPagar', { id_reg: item.id, valor_conta: item.valor });
                        }}

                        onPressEdit={async () => {
                            navigation.push('NovaContaPagar', { id_reg: item.id });
                        }}

                        onPressDelete={async () => {
                            excluir(item.valor, item.id);
                        }}

                        onPressParcelar={async () => {
                            modalParcelar(item.id)
                        }}
                    >

                    <TouchableOpacity
                           onPress={() => {
                            loadData(item.id)
                        }}
                        >
                       
                <Text style={styles.Cliente}>{item.cliente}</Text>
                <Text style={styles.Valor}>R$ {valor} <Text style={styles.ValorRes}>{item.valor_antigo}</Text></Text>

                <View style={styles.Section}>
                    <MaterialIcons style={styles.Icon} name="attach-money" size={22} color="#c1c1c1" />
                    <Text style={styles.Entrada}>{item.saida}</Text>
                      
                    {(() => {
                        if (item.arquivo != 'sem-foto.jpg' && item.arquivo != '' && tumb != null) {
                            if(item.tumb == 'pdf.png'){
                                return(
                                    <Image style={styles.Vencimento2} source={require('../../assets/pdf.png')} />
                                )
                            }else if(item.tumb == 'rar.png'){
                                return(
                                    <Image style={styles.Vencimento2} source={require('../../assets/rar.png')} />
                                )
                            }
                            else{
                                return (
                                    <Image style={styles.Vencimento2} source={{uri:(urlImg +'contas/'+ item.arquivo)}} />
                                )
                            }
                            
                        }
                    })()}
                    
                    <Text style={styles.Vencimento}>{vencimento}</Text>
                </View>

                <View style={styles.Footer}>
                    <Text style={styles.FooterText}>Frequência: <Text style={{ color: 'gray' }}>{item.frequencia}</Text></Text>
                </View>

                </TouchableOpacity>

                </SwipeableRow>
               
            </View>
        )
    }
    
    const isEmpty = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>
                <Text style={{ fontFamily: fonts.text, fontSize: 16 }}>Não tem nenhuma conta para este dia.</Text>
            </View>
        )
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        Promise.all([date, date2]).then(() => {
            setIsLoading(true);
            fetchData()
        })
    }, [date, date2]);



    if (loading === true) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ActivityIndicator style={{ marginTop: 100 }} color="#000" size="large" />
            </View>
        )
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="calendar"
                    onChange={onChange}
                />
            )}

            {show2 && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date2}
                    mode="date"
                    is24Hour={true}
                    display="calendar"
                    onChange={onChange2}
                />
            )}

            <Header />

            <Title title="Contas a Pagar" />

            {isLoading ?
                <Load />

                :

                <FlatList
                    data={contas}
                    renderItem={renderItem}
                    keyExtractor={(item) => (item.id)}
                    ListHeaderComponent={Headers}
                    initialNumToRender={5}
                    ListEmptyComponent={isEmpty}
                />

            }

                <View style={styles.containerFloat}>
                    <TouchableOpacity
                        style={styles.CartButton}
                        onPress={() => navigation.push("NovaContaPagar", { id_reg: '0' })}
                    >
                        <Ionicons name="add-outline" size={35} color="#fff" />
                    </TouchableOpacity>
                </View>

            
      <Modal 
        visible={abrirModal}
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => {
          setAbrirModal(!abrirModal)
        }}
      >
          <View style={styles.centralizarModal}>
         <View style={styles.CardContainerModal}>
         <TouchableOpacity
              style={styles.removeItem}
              onPress={() => setAbrirModal(false)}
            >
              <EvilIcons name="close" size={25} color="black" />
            </TouchableOpacity>
         <Text style={styles.Cliente}>{forn}</Text>
                <Text style={styles.Valor}>R$ {valor}</Text>

                <View style={styles.Section}>
                    <MaterialIcons style={styles.Icon} name="attach-money" size={22} color="#c1c1c1" />
                    <Text style={styles.Entrada}>{saida}</Text>
                    <Text style={styles.Vencimento}>Vencimento: {venc}</Text>
                </View>

                <View style={styles.Section}>
                    <MaterialIcons style={styles.Icon} name="money" size={22} color="#c1c1c1" />
                    <Text style={styles.Entrada}>{doc}</Text>
                    <Text style={styles.Vencimento}>{plano}</Text>
                </View>

                <View style={styles.Section}>
                    <MaterialIcons style={styles.Icon} name="date-range" size={22} color="#c1c1c1" />
                    <Text style={styles.Entrada}>Emissão {emissao}</Text>
                    <Text style={styles.Vencimento}>{usu}</Text>
                </View>

                <View style={styles.Footer}>
                    <Text style={styles.FooterText}>Frequência: <Text style={{ color: 'gray' }}>{freq}</Text></Text>
                </View>

                <TouchableOpacity onPress={() => Linking.openURL(urlImg + 'contas/' + arq)}>
                {(() => {
                        if (tumb != 'sem-foto.jpg' && tumb != '' && tumb != null) {
                            if(tumb == 'pdf.png'){
                                return(
                                    <View style={styles.viewImg}>
                                    <Image style={styles.ImagemModal} source={require('../../assets/pdf.png')} />
                                    <Text style={styles.textoAbrir}>(Clique para Abrir)</Text>
                                    </View>
                                )
                            }else if(tumb == 'rar.png'){
                                return(
                                    <View style={styles.viewImg}>
                                    <Image style={styles.ImagemModal} source={require('../../assets/rar.png')} />
                                    <Text style={styles.textoAbrir}>(Clique para Abrir)</Text>
                                    </View>
                                )
                            }
                            else{
                                return (
                                    <View style={styles.viewImg}>
                                    <Image style={styles.ImagemModal} source={{uri:(urlImg +'contas/'+ tumb)}} />
                                    <Text style={styles.textoAbrir}>(Clique para Abrir)</Text>
                                    </View>
                                )
                            }   
                                                    
                        }
                        
                    })()}
                    </TouchableOpacity>               

             </View>
             </View>
          </Modal>




          <Modal 
        visible={abrirModalParc}
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => {
          setAbrirModalParc(!abrirModalParc)
        }}
      >
          <View style={styles.centralizarModal}>
         <View style={styles.CardContainerModal}>
         <TouchableOpacity
              style={styles.removeItem}
              onPress={() => setAbrirModalParc(false)}
            >
              <EvilIcons name="close" size={25} color="black" />
            </TouchableOpacity>
            <Text style={styles.tituloModal}>Parcelar Conta - Valor: {valor}</Text>
            

            <View>
                    <Text style={styles.TitleInputs}>Parcelas *</Text>

                    <TextInput
                        placeholder="Número de Parcelas "
                        onChangeText={(text) => setParcela(text)}
                        value={parcela}
                        style={styles.TextInput}
                        keyboardType='numeric'
                    />
                </View>
                

            <View>
                <Text style={styles.TitleInputs}>Frequência</Text>
                <View style={styles.TextInput}>
                    <Picker
                        selectedValue={frequencia}
                        onValueChange={(itemValue, itemIndex) => setFrequencia(itemValue)}
                    >
                        
                        {lista_freq.map((item: any) =>
                            <Picker.Item key={item.nome} label={item.nome} value={item.nome} />
                        )}
                    </Picker>
                </View>
            </View>


            <TouchableOpacity
                style={styles.Button}
                onPress={() => {                   
                    gerarParcelas();                   
                }}
            >
                <Text style={styles.ButtonText}>Parcelar</Text>
            </TouchableOpacity>            

             </View>
             </View>
          </Modal>

        </View>
    );
}

export default Pagar;