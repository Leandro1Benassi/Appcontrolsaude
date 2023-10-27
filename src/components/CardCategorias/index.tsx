import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';
import SwipeableRow from '../SwipeableRow/editar_excluir';
import api from '../../services/api';
import { styles } from './styles';
import { showMessage } from 'react-native-flash-message';

interface DadosProps {
    data: {
        id: string;
        nome: string;
        produtos: string;
        
    }
}


const CardCategorias = ({ data }: DadosProps) => {
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
                        const response = await api.get(`categorias/excluir.php?id=${id}`);

                        if (response.data.sucesso === false) {
                            showMessage({
                                message: "Erro ao Excluir",
                                description: response.data.mensagem,
                                type: "warning",
                            });

                            return;
                        }else{
                            showMessage({
                                message: "Exclusão",
                                description: 'Registro '+nome+' Excluído com Sucesso',
                                type: "info",
                              });  
                            navigation.push('Categorias');
                        }
                        
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
                        
                        onPressEdit={async () => {
                            navigation.push('NovaCategoria', { id_reg: data.id });
                        }}

                        onPressDelete={async () => {
                            excluir(data.nome, data.id);
                        }}
                    >
                        <TouchableOpacity
                            style={styles.box}
                            onPress={() => Alert.alert("", data.nome)}
                        >
                            <Text style={{ color: '#000' }}>{data.nome} - Produtos: {data.produtos}</Text>
                           
                        </TouchableOpacity>
                    </SwipeableRow>
                </View>
            }
        </>
    );
}

export default CardCategorias;