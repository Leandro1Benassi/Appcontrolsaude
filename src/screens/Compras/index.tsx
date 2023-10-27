import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import fonts from '../../styles/fonts';
import { Text, Platform, ActivityIndicator, FlatList, Image, TextInput, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import { styles } from './style';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { add, format, parseISO, sub } from 'date-fns';
import api from '../../services/api';
import Card from '../../components/CardCompras';
import Header from '../../components/Header';
import Title from '../../components/Title';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RectButton } from 'react-native-gesture-handler';

const Clientes: React.FC = () => {

    

    const navigation: any = useNavigation();

    const [lista, setLista] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [busca, setBusca] = useState("");
    const [onEndReachedCalledDuringMomentum, setMT] = useState(true);


    const [date, setDate] = useState<any>(new Date());
    const [show, setShow] = useState<any>(false);

    const [date2, setDate2] = useState<any>(new Date());
    const [show2, setShow2] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

   
    async function fetchData() {
        try {
            const date1 = format(date, 'yyyy-MM-dd');
            const dates2 = format(date2, 'yyyy-MM-dd')

            const response = await api.get(`compras/listar.php?data=${date1}&data1=${dates2}`);

            if (response.data.resultado != "0") {
                setLista(response.data.resultado);
            } else {
                setLista([]);
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

            <Title title="Lista de Compras" />

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

                <View style={styles.containerFloat}>
                    <TouchableOpacity
                        style={styles.CartButton}
                        onPress={() => navigation.push("NovaCompra", { id_reg: '0' })}
                    >
                        <Ionicons name="add-outline" size={35} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default Clientes;