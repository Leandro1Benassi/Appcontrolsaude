import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Linking, Text, TouchableOpacity, View, Image } from 'react-native';
import SwipeableRow from '../SwipeableRow/produtos';
import api from '../../services/api';
import { styles } from './styles';
import { showMessage } from 'react-native-flash-message';
import urlImg from '../../services/urlImg';

interface DadosProps {
    data: {
        id: string;
        nome: string;
        codigo: string;
        descricao: string;
        estoque: string;
        valor_compra: string;
        valor_venda: string;
        ativo: string;
        categoria: string;
        lucro: string;
        foto: string;
       
    }
}


const CardProdutos = ({ data }: DadosProps) => {
    const navigation: any = useNavigation();


    async function excluir(nome:string, id:string) {
        Alert.alert('Sair', `Você tem certeza que deseja excluir o Registro : ` + nome, [
            {
                text: 'Não',
                style: 'cancel',
            },

            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        const response = await api.get(`produtos/excluir.php?id=${id}`);
                        showMessage({
                            message: "Exclusão",
                            description: 'Registro '+nome+' Excluído com Sucesso',
                            type: "info",
                          });  
                        navigation.push('Produtos');
                    } catch (error) {
                        Alert.alert('Não foi possivel excluir, tente novamente!')
                    }
                }
            }
        ])
    }

    return (
        <>
            {data.id === undefined && data.nome === undefined ?
                <></>
                
                :

                <View>
                    <SwipeableRow
                        onPressWhatsapp={async () => {
                            navigation.push('ComprarProduto', { id_reg: data.id });
                        }}

                        onPressEdit={async () => {
                            navigation.push('NovoProduto', { id_reg: data.id });
                        }}

                        onPressDelete={async () => {
                            excluir(data.nome, data.id);
                        }}
                    >
                        <TouchableOpacity
                            style={styles.box}
                            onPress={() => Alert.alert("Código do Produto " + data.codigo + "  Descrição do Produto: " + data.descricao)}
                        >
                            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                             
                            {(() => {
                                if (data.ativo == 'Sim') {
                                    return(
                             <View style={{width:65}}>
                             <Image style={{width:55, height:55}} source={{uri:(urlImg +'produtos/'+ data.foto)}} />
                             </View>
                              )
                            }else{
                                return(
                                    <View style={{width:65}}>
                                    <Image style={{width:55, height:55, opacity:0.3}} source={{uri:(urlImg + data.foto)}} />
                                    </View>
                                     )
                                    }
                            })()}


                             {(() => {
                                if (data.ativo == 'Sim') {
                                    return(
                                        <View style={{width:'100%', marginTop:3}}>
                                        <Text style={{ color: '#000' }}>{data.nome} - Estoque: {data.estoque}</Text>
                                        <Text style={{ color: '#000' }}>{data.categoria} - Valor Venda: R$ {data.valor_venda}</Text>
                                        </View>
                                    )
                                }else{
                                    return(
                                        <View style={{width:'100%', marginTop:3}}>
                                        <Text style={{ color: '#bfbfbf' }}>{data.nome} - Estoque: {data.estoque}</Text>
                                        <Text style={{ color: '#bfbfbf' }}>{data.categoria} - Valor Venda: R$ {data.valor_venda}</Text>
                                        </View>
                                    )
                                }
                            })()}

                           
                            </View>
                        </TouchableOpacity>
                    </SwipeableRow>
                </View>
            }
        </>
    );
}

export default CardProdutos;