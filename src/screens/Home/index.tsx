import React, { useEffect, useState } from 'react';

import {
    SafeAreaView,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    AsyncStorage,
    Alert,

} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './style';
import { DrawerActions, useNavigation } from '@react-navigation/core';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import api from '../../services/api';
import Load from '../../components/Load';
import { useIsFocused } from '@react-navigation/native';

export default function Home() {
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();

    const [dados, setDados] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [usu, setUsu] = React.useState('');

    async function listarDados() {
        try {
            const response = await api.get('dashboard/ListAllCards.php');
            setDados(response.data);

        } catch (error) {
            console.log("Error");
        } finally {
            setIsLoading(false);
            setRefreshing(false);

        }
    }

    useEffect(() => {
        listarDados();
    }, []);

    useEffect(() => {
        listarDados();
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(true);
        listarDados();

    };

    const porcent = (dados.contasRecebidas / dados.contasaReceber) * 100;


    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View style={styles.containerHeader}>

                        <TouchableOpacity
                            style={styles.menu}
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        >
                            <MaterialIcons name="menu" size={35} color="black" />
                        </TouchableOpacity>

                        <Image style={styles.logo} source={require('../../assets/logo2.png')} />

                    </View>
                </View>

                {isLoading ?
                    <Load /> :

                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >

                        <View style={styles.circleProgressView}>
                            <View style={styles.textProgressContainer}>
                                <Text style={styles.textProgressTitle}>Contas à Receber Hoje</Text>
                                <Text style={styles.textProgress}>{dados.contasRecebidas} de {dados.contasaReceber} Recebidas</Text>
                            </View>

                            <AnimatedCircularProgress
                                size={100}
                                width={10}
                                fill={porcent}
                                tintColor="#00e0ff"
                                backgroundColor="#e0e0e0"
                                lineCap={"round"}
                            >
                                {
                                    (fill) => (
                                        <Text style={styles.numberInside}>{dados.contasRecebidas}</Text>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </View>





                        <View style={styles.containerBox}>

                            <TouchableOpacity onPress={() => navigation.push("Receber")}>
                                <View>
                                    <View style={styles.box}>
                                        <MaterialIcons style={styles.iconRegistered} name="monetization-on" size={70} color="#28a745" />
                                        <View style={styles.textos}>
                                            <Text style={styles.rText}>Receber Hoje</Text>
                                            <Text style={styles.lenghtText}>{dados.contasaReceberPendentes}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textFooter}>Contas à Receber Hoje</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.containerBox}>

                            <TouchableOpacity onPress={() => navigation.push("Pagar")}>
                                <View>
                                    <View style={styles.box}>
                                        <MaterialIcons style={styles.iconRegistered} name="money-off" size={70} color="#ff0000" />
                                        <View style={styles.textos}>
                                            <Text style={styles.rText}>Pagar Hoje</Text>
                                            <Text style={styles.lenghtText}>{dados.contasaPagarHoje}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textFooter}>Contas à Pagar Hoje</Text>
                                </View>
                            </TouchableOpacity>

                        </View>






                        <View style={styles.containerBox}>

                            <TouchableOpacity onPress={() => navigation.push("Receber")}>
                                <View>
                                    <View style={styles.box}>
                                        <MaterialIcons style={styles.iconRegistered} name="date-range" size={70} color="#e38a32" />
                                        <View style={styles.textos}>
                                            <Text style={styles.rText}>Receber Vencidas</Text>
                                            <Text style={styles.lenghtText}>{dados.contasaReceberVencidas}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textFooter}>Contas à Receber Vencidas</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.containerBox}>

                            <TouchableOpacity onPress={() => navigation.push("Pagar")}>
                                <View>
                                    <View style={styles.box}>
                                        <MaterialIcons style={styles.iconRegistered} name="calendar-view-day" size={70} color="#e38a32" />
                                        <View style={styles.textos}>
                                            <Text style={styles.rText}>Pagar Vencidas</Text>
                                            <Text style={styles.lenghtText}>{dados.contasaPagarVencidas}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textFooter}>Contas à Pagar Vencidas</Text>
                                </View>
                            </TouchableOpacity>

                        </View>




                        <View style={styles.containerBox}>

<TouchableOpacity onPress={() => navigation.push("Estoque")}>
    <View>
        <View style={styles.box}>
            <MaterialIcons style={styles.iconRegistered} name="info-outline" size={70} color="#ff0000" />
            <View style={styles.textos}>
                <Text style={styles.rText}>Estoque Baixo</Text>
                <Text style={styles.lenghtText}>{dados.estoque_baixo}</Text>
            </View>
        </View>
        <Text style={styles.textFooter}>Produto com Estoque Baixo</Text>
    </View>
</TouchableOpacity>

</View>


                        <View style={styles.containerBox}>

                            <TouchableOpacity onPress={() => navigation.push("Pessoas")}>
                                <View>
                                    <View style={styles.box}>
                                        <MaterialIcons style={styles.iconRegistered} name="people-alt" size={70} color="#17a2b8" />
                                        <View style={styles.textos}>
                                            <Text style={styles.rText}>Clientes</Text>
                                            <Text style={styles.lenghtText}>{dados.quantidade_clientes}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textFooter}>Clientes cadastrados</Text>
                                </View>
                            </TouchableOpacity>

                        </View>



                        <View style={styles.containerBox}>

                            <TouchableOpacity onPress={() => navigation.push("Produtos")}>
                                <View>
                                    <View style={styles.box}>
                                        <MaterialIcons style={styles.iconRegistered} name="laptop" size={70} color="#0aa342" />
                                        <View style={styles.textos}>
                                            <Text style={styles.rText}>Produtos</Text>
                                            <Text style={styles.lenghtText}>{dados.quantidade_produtos}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textFooter}>Produtos cadastrados</Text>
                                </View>
                            </TouchableOpacity>

                        </View>


                        <View style={styles.containerBox}>

                            <TouchableOpacity onPress={() => navigation.push("Pessoas")}>
                                <View>
                                    <View style={styles.box}>
                                        <MaterialIcons style={styles.iconRegistered} name="people-alt" size={70} color="#525252" />
                                        <View style={styles.textos}>
                                            <Text style={styles.rText}>Fornecedores</Text>
                                            <Text style={styles.lenghtText}>{dados.quantidade_fornecedores}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.textFooter}>Fornecedores cadastrados</Text>
                                </View>
                            </TouchableOpacity>

                        </View>


                    </ScrollView>
                }
            </View>
        </View>


    )
}