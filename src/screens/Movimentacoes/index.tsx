import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import fonts from '../../styles/fonts';
import { SectionList, Picker, Text, Platform, ActivityIndicator, FlatList, Image, TextInput, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { add, format, parseISO, sub } from 'date-fns';
import api from '../../services/api';
import Card from '../../components/CardMovimentacoes';
import Header from '../../components/Header';
import Title from '../../components/Title';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { showMessage, hideMessage } from "react-native-flash-message";

const Clientes: React.FC = () => {



    const navigation: any = useNavigation();

    const [lista, setLista] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [busca, setBusca] = useState("");
    const [onEndReachedCalledDuringMomentum, setMT] = useState(true);

    const [lista_lanc, setListaLanc] = useState<any[]>([]);
    const [lanc, setLanc] = useState("Caixa");

    let [total, setTotal] = useState("0");
    let [corTotal, setCorTotal] = useState("");

    const [date, setDate] = useState<any>(new Date());
    const [show, setShow] = useState<any>(false);

    const [date2, setDate2] = useState<any>(new Date());
    const [show2, setShow2] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    async function Lancar(lan:string){
        setLanc(lan);
        const date1 = format(date, 'yyyy-MM-dd');
        const dates2 = format(date2, 'yyyy-MM-dd')
        const response = await api.get(`mov/listar.php?data=${date1}&data1=${dates2}&lanc=${lan}`);
        setLista(response.data.resultado);
        setTotal(response.data.total)
        setCorTotal(response.data.classeSaldo)
        
    }


    async function fetchData() {
        try {
            const date1 = format(date, 'yyyy-MM-dd');
            const dates2 = format(date2, 'yyyy-MM-dd')

            const response = await api.get(`mov/listar.php?data=${date1}&data1=${dates2}&lanc=${lanc}`);
            
            if (response.data.resultado != "0") {
                setTotal(response.data.total)
                setCorTotal(response.data.classeSaldo)
                
                setLista(response.data.resultado);
            } else {
                setLista([]);
                showMessage({
                    message: "Sem Dados",
                    description: 'Nenhum Registro Encontrado no Periodo!',
                    type: "warning",
                });
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function selectListaLanc() {
        try {
            const response = await api.get('mov/listar_lanc.php');

            setListaLanc(response.data.resultado);
        } catch (error) {
            console.log(error);
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


    const renderItem = function ({ item }: any) {
        return (
            <Card
                data={item}
            />
        )
    }

    function Footer(load: any) {
        if (!load) return null;

        return (
            <View style={styles.loading}>
                <ActivityIndicator size={25} color="#000" />
            </View>
        )
    }

    useEffect(() => {
        Promise.all([date, date2]).then(() => {
            setIsLoading(true);
            fetchData()
            selectListaLanc()
        })
    }, [date, date2]);

    return (
        <View style={styles.container}>

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

           
            <View style={styles.Container}>
        <Text style={styles.Title}>{lanc + " (Extrato) "} <Text style={{color:corTotal }}> {"R$ " +total}</Text></Text>
    </View>

            <View style={{ marginBottom: 10, }}>
                <View style={styles.dates}>
                    <RectButton
                        style={styles.ButtonDates}
                        onPress={() => {
                            setDate(sub(new Date(), { days: 1 }));
                            setDate2(sub(new Date(), { days: 1 }));
                        }}
                    >
                        <Text style={styles.ButtonDatesText}>Ontem</Text>
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
                            setDate(sub(new Date(), { days: 30 }));
                            setDate2(add(new Date(), { days: 1 }))
                        }}
                    >
                        <Text style={styles.ButtonDatesText}>30 Dias</Text>
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

            <View style={{ marginHorizontal: 5, height: 40, backgroundColor: '#FFF', marginBottom:15 }}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: "center", }}>
                            <TouchableOpacity onPress={() => Lancar("Caixa")} >
                            <Text style={ (() => { 
                                if(lanc == "Caixa"){
                                    return(
                                        { padding: 5, fontSize: 15, color: '#ab3824' }
                                    )
                                }else{
                                    return(
                                        { padding: 5, fontSize: 15, color: '#247bab' }
                                    )
                                }
                            })()                            
                            }>Caixa</Text>
                            </TouchableOpacity>
                            <Text style={{ padding: 5, fontSize: 15, color: '#247bab' }}>/</Text>
                        

                            <TouchableOpacity onPress={() => Lancar("Cartão de Débito")} >
                            <Text style={ (() => { 
                                if(lanc == "Cartão de Débito"){
                                    return(
                                        { padding: 5, fontSize: 15, color: '#ab3824' }
                                    )
                                }else{
                                    return(
                                        { padding: 5, fontSize: 15, color: '#247bab' }
                                    )
                                }
                            })()                            
                            }>Cartão de Débito</Text>
                            </TouchableOpacity>
                        <Text style={{ padding: 5, fontSize: 15, color: '#247bab' }}>/</Text>

                        <TouchableOpacity onPress={() => Lancar("Cartão de Crédito")} >
                            <Text style={ (() => { 
                                if(lanc == "Cartão de Crédito"){
                                    return(
                                        { padding: 5, fontSize: 15, color: '#ab3824' }
                                    )
                                }else{
                                    return(
                                        { padding: 5, fontSize: 15, color: '#247bab' }
                                    )
                                }
                            })()                            
                            }>Cartão de Crédito</Text>
                            </TouchableOpacity>
                        <Text style={{ padding: 5, fontSize: 15, color: '#247bab' }}>/</Text>
                    </View>

                    {lista_lanc.map((item: any) =>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: "center", }}>
                            <TouchableOpacity onPress={() => Lancar(item.nome)} >
                            <Text style={ (() => { 
                                if(lanc == item.nome){
                                    return(
                                        { padding: 5, fontSize: 15, color: '#ab3824' }
                                    )
                                }else{
                                    return(
                                        { padding: 5, fontSize: 15, color: '#247bab' }
                                    )
                                }
                            })()                            
                            }>{item.nome}</Text>
                            </TouchableOpacity>
                            <Text style={{ padding: 5, fontSize: 15, color: '#247bab' }}>/</Text>
                        </View>
                    )}
                </ScrollView>
            </View>



            <View style={{ paddingHorizontal: 15, flex: 1, }}>


                <View style={{ flex: 1, height: Dimensions.get('window').height + 30, }}>
                    <FlatList
                        data={lista}
                        renderItem={renderItem}
                        keyExtractor={item => String(item.id)}
                        onEndReachedThreshold={0.1}
                        removeClippedSubviews
                        initialNumToRender={10}
                        onEndReached={(distanceFromEnd) => {
                            if (!onEndReachedCalledDuringMomentum) {
                                fetchData().then(() => setLoading(false));
                                setMT(true);
                            }
                        }}
                        ListFooterComponent={(distanceFromEnd) => {
                            if (!onEndReachedCalledDuringMomentum) {
                                return <Footer load={loading} />
                            } else {
                                return <View></View>
                            }
                        }}
                        onMomentumScrollBegin={() => setMT(false)}
                        windowSize={10}
                        getItemLayout={(data, index) => (
                            { length: 50, offset: 50 * index, index }
                        )}
                    />
                </View>

               {/*
                <View style={styles.containerFloat}>
                    <TouchableOpacity
                        style={styles.CartButton}
                        onPress={() => navigation.push("NovaCompra", { id_reg: '0' })}
                    >
                        <Ionicons name="remove-circle-outline" size={35} color="#fff" />
                    </TouchableOpacity>
                </View>
               */}
            </View>
        </View>
    );
}

export default Clientes;