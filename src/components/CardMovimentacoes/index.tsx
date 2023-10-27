import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { AsyncStorage, Alert, Linking, Text, TouchableOpacity, View, Image } from 'react-native';
import SwipeableRow from '../SwipeableRow/vendas';
import api from '../../services/api';
import { styles } from './styles';
import { showMessage } from 'react-native-flash-message';
import urlRaiz from '../../services/urlRaiz';
import { Ionicons } from '@expo/vector-icons';

interface DadosProps {
    data: {
        id: string;
        data: string;
        classe: string;
        movimento: string;
        descricao: string;
        usuario: string;
        documento: string;
        plano_conta: string;
        valor: string;
        saldo_geral: string;
        classe_saldo: string;
        classe_valor: string;
        classe_periodo: string;
        saldo_periodo: string;

    }
}


const CardCompras = ({ data }: DadosProps) => {
    

    const navigation: any = useNavigation();


    async function excluir(nome: string, id: string) {
        const user = await AsyncStorage.getItem('@user');
        Alert.alert('Sair', `Você tem certeza que deseja cancelar a Venda : ` + nome, [
            {
                text: 'Não',
                style: 'cancel',
            },

            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        const res = await api.get(`compras/excluir.php?id=${id}}&user=${user}`);

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
                            description: 'Registro ' + nome + ' Cancelada com Sucesso',
                            type: "info",
                        });
                        navigation.push('Compras');
                    } catch (error) {
                        Alert.alert('Não foi possivel cancelar, tente novamente!')
                    }
                }
            }
        ])
    }

    return (
        <>
            {data.id === undefined ?
                <Text style={{ color: '#595858', fontSize: 14 }}>Nenhum Registro Existente nessa data!</Text>

                :

                <View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',  }}>
                        <View style={{ width: '100%', marginTop: 3, backgroundColor:'#f9f9f9', padding:2 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                
                                <Text style={{color: data.classe, fontSize: 16, marginRight:10}}>{data.data} </Text> 
                                <Text style={{ color: data.classe_valor, fontSize: 16 }}>R$ {data.valor} </Text> 
                                <View style={{ flex: 1, flexDirection: 'row', position:'absolute', right:5}}>
                                <Text style={{ color: '#595858', fontSize: 16 }}>Total: R$</Text> 
                                <Text style={{ color: data.classe_periodo, fontSize: 16 }}>  {data.saldo_periodo}</Text>
                                </View>
                            </View>

                            <Text> <Text><Ionicons name="md-card-outline" size={20} color="#787878" />  </Text> <Text style={{ color: '#000' }}>{data.documento} - {data.plano_conta} </Text></Text>
                        </View>

                    </View>

                </View>
                
            }
        </>
    );
}

export default CardCompras;