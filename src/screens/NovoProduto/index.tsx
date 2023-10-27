import React, { useState, useEffect } from 'react';
import { Image, Button, Alert, Picker, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { Success } from '../../lotties/Success';
import { TextInputMask } from 'react-native-masked-text';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import urlImg from '../../services/urlImg';
type ParamList = {
    Detail: {
        id_reg: string;

    };
};


const NovoProduto: React.FC = () => {
    const navigation: any = useNavigation();

    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const id_reg = route?.params?.id_reg;

    const [nome, setNome] = useState("");
    const [codigo, setCodigo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valor_venda, setValorVenda] = useState("");
    const [valor_custo, setValorCusto] = useState("");
    const [ativo, setAtivo] = useState("Sim");
    
    const [lista_cat, setListaCat] = useState<any[]>([]);
    const [cat, setCat] = useState("");


    const [sucess, setSucess] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);


    const [image, setImage] = useState<any>();
    const [nomeImagem, setNomeImagem] = useState("");
    const data = new FormData();

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          
        });
    
        if (result.cancelled) {
            return;
          }

                
          let localUri = result.uri;
          let filename:any = localUri.split('/').pop();
          setNomeImagem(filename);

         
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('photo', { uri: localUri, name: filename, type });
         setImage(result.uri);

         await api.post("produtos/upload.php", formData);
        
               
      };


      const pickImageArquivos = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          

        });
    
        if (result.cancelled) {
            return;
          }

                
          let localUri = result.uri;
          let filename:any = localUri.split('/').pop();
          setNomeImagem(filename);

         
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('photo', { uri: localUri, name: filename, type });
         setImage(result.uri);

         await api.post("produtos/upload.php", formData);
        
               
      };



    async function selectListaBancos() {
        try {
            const response = await api.get('produtos/listar_cat.php');

            setListaCat(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }

    async function saveData() {

        
        if (nome == "" || codigo == "" || ativo == '') {
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
                descricao: descricao,
                codigo: codigo,
                valor_venda: valor_venda,
                valor_custo: valor_custo,
                ativo: ativo,
                cat: cat,
                foto:nomeImagem
            }

            const res = await api.post("produtos/salvar.php", obj);

            if (res.data.sucesso === false) {
                showMessage({
                    message: "Erro ao Salvar",
                    description: res.data.mensagem,
                    type: "warning",
                });

                return;
            }

            setNome("");
            setDescricao("");
            setValorVenda("");
            setValorCusto("");
            setCodigo("");
            setNomeImagem("");
            setImage(null);
          
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



    async function loadData() {
       
        try {
            
            setLoading(true);
            if (id_reg != "0") {
                const res = await api.get(`produtos/listar_id.php?id=${id_reg}`);

                setNome(res.data.dados.nome);
                setDescricao(res.data.dados.descricao);
                setValorVenda(res.data.dados.valor_venda);
                setValorCusto(res.data.dados.valor_compra);
                setCodigo(res.data.dados.codigo);
                setAtivo(res.data.dados.ativo);
                setImage(urlImg + 'produtos/'+ res.data.dados.foto);
                               
                setCat(res.data.dados.categoria);
                
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
                    <Text style={styles.TitleInputs}>Código do Produto *</Text>

                    <TextInput
                        placeholder="Código do Produto"
                        onChangeText={(text) => setCodigo(text)}
                        value={codigo}
                        style={styles.TextInput}

                    />
                </View>

                <View>
                    <Text style={styles.TitleInputs}>Nome *</Text>

                    <TextInput
                        placeholder="Nome"
                        onChangeText={(text) => setNome(text)}
                        value={nome}
                        style={styles.TextInput}

                    />
                </View>

                <View>
                    <Text style={styles.TitleInputs}>Descrição</Text>

                    <TextInput
                        placeholder="Descrição"
                        onChangeText={(text) => setDescricao(text)}
                        value={descricao}
                        style={styles.TextInput}

                    />
                </View>



                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf: "center"}}>
                    <View style={{width:'50%'}}>
                    <Text style={styles.TitleInputs}>Valor de Vendas</Text>

                    <TextInput
                        placeholder="Valor Venda "
                        onChangeText={(text) => setValorVenda(text)}
                        value={valor_venda}
                        style={styles.TextInput}

                    />
                </View>

                <View style={{width:'50%'}}>
                    <Text style={styles.TitleInputs}>Valor de Custo</Text>

                    <TextInput
                        placeholder="Valor Custo "
                        onChangeText={(text) => setValorCusto(text)}
                        value={valor_custo}
                        style={styles.TextInput}

                    />
                </View>
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
                <Text style={styles.TitleInputs}>Categoria</Text>
                <View style={styles.TextInput}>
                    <Picker
                        selectedValue={cat}
                        onValueChange={(itemValue, itemIndex) => setCat(itemValue)}
                    >
                        
                        {lista_cat.map((item: any) =>
                            <Picker.Item key={item.id} label={item.nome} value={item.id} />
                        )}
                    </Picker>
                </View>
            </View>

            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf: "center", marginTop:20}}>                
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
            <TouchableOpacity onPress={pickImage}>
                    <Ionicons name="camera" size={80} color="#706f6f" />
                </TouchableOpacity>
      
    </View>

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <TouchableOpacity onPress={pickImageArquivos}>
                    <Ionicons name="archive" size={80} color="#706f6f" />
                </TouchableOpacity>
     
    </View>
    </View>

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:10 }}>
    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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

export default NovoProduto;