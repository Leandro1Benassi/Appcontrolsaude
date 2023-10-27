import React, { useState, useEffect } from 'react';
import { AsyncStorage, Platform, Image, Button, Alert, Picker, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
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


const NovaContaReceber: React.FC = () => {
    const navigation: any = useNavigation();

    

    const route = useRoute<RouteProp<ParamList, 'Detail'>>();
    const id_reg = route?.params?.id_reg;
        

    const [valor, setValor] = useState("");
    
    const [descricao, setDescricao] = useState("");
        
    const [lista_forn, setListaForn] = useState<any[]>([]);
    const [forn, setForn] = useState("");

    const [lista_saida, setListaSaida] = useState<any[]>([]);
    const [saida, setSaida] = useState("Caixa");

    const [doc, setDoc] = useState("Dinheiro");

    const [lista_plano, setListaPlano] = useState<any[]>([]);
    const [plano, setPlano] = useState("");

    const [lista_desp, setListaDesp] = useState<any[]>([]);
    const [desp, setDesp] = useState("");

    const [lista_freq, setListaFreq] = useState<any[]>([]);
    const [freq, setFreq] = useState("");

    const [emissao, setEmissao] = useState(new Date());
    const [show, setShow] = useState(false);
    const [venc, setVenc] = useState(new Date());
    const [show2, setShow2] = useState(false);

    const onChange = async (event: any, selectedDate: any) => {
        const currentDate = selectedDate || emissao;
        setShow(Platform.OS === 'ios');
        setEmissao(currentDate);
    };

    const onChange2 = async (event: any, selectedDate: any) => {
        const currentDate = selectedDate || venc;
        setShow2(Platform.OS === 'ios');
        setVenc(currentDate);
    };


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

         await api.post("pagar/upload.php", formData);
        
               
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

         await api.post("pagar/upload.php", formData);
        
               
      };



    async function selectListaForn() {

        
        try {
            const response = await api.get('receber/listar_forn.php');

            setListaForn(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }

    async function selectListaSaida() {
        try {
            const response = await api.get('receber/listar_saida.php');

            setListaSaida(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }




    async function selectListaFreq() {
        try {
            const response = await api.get('receber/listar_freq.php');

            setListaFreq(response.data.resultado);
        } catch (error) {
            console.log(error);
        }
    }

    async function saveData() {
        
        const user = await AsyncStorage.getItem('@user');                        
        const emissaoF = format(emissao, 'yyyy-MM-dd');
        const vencF = format(venc, 'yyyy-MM-dd');
        
        
        if (valor == "" ) {
            showMessage({
                message: "Erro ao Salvar",
                description: 'Preencha o campo valor!',
                type: "warning",
            });
            return;
        }

        if (forn == "" && descricao == "") {
            showMessage({
                message: "Erro ao Salvar",
                description: 'Selecione um Fornecedor ou Coloque uma descrição!',
                type: "warning",
            });
            return;
        }
        setSucess(true);

        try {
            const obj = {
                id: id_reg,
                descricao: descricao,
                valor: valor,
                forn: forn,
                saida: saida,
                doc: doc,
                plano: plano,
                desp: desp,
                freq: freq,
                emissao: emissaoF,
                venc: vencF,
                foto:nomeImagem,
                user:user
            }

            const res = await api.post("receber/salvar.php", obj);

            if (res.data.sucesso === false) {
                showMessage({
                    message: "Erro ao Salvar",
                    description: res.data.mensagem,
                    type: "warning",
                });

                return;
            }
            
            setValor("");
            setDescricao("");
            
            setNomeImagem("");
            setImage(null);
          
            showMessage({
                message: "Salvo",
                description: 'Registro Salvo com Sucesso!!',
                type: "success",
            });

            navigation.push("Receber")

        } catch (error) {
            Alert.alert("Ops", "Alguma coisa deu errado, tente novamente.");
            setSucess(false);
        }
    }



    async function loadData() {
       
        try {
            
            setLoading(true);
            if (id_reg != "0") {
                const res = await api.get(`receber/listar_id.php?id=${id_reg}`);

               
	            
                setValor(res.data.dados.valor);
                setDescricao(res.data.dados.descricao);
                setForn(res.data.dados.forn);
                
                setSaida(res.data.dados.saida);
                setDoc(res.data.dados.doc);                
                setVenc(new Date(res.data.dados.vencimento + 'T06:00'));
                setEmissao(new Date(res.data.dados.emis + 'T06:00'));
                setFreq(res.data.dados.freq);
                setImage(urlImg + 'contas/'+ res.data.dados.tumb);

                
                                                  
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
            selectListaForn().then(() => setLoading(false))
        }).then(() => {
            selectListaSaida().then(() => setLoading(false))
        }).then(() => {
            selectListaFreq().then(() => setLoading(false))
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
                <Text style={styles.TitleInputs}>Cliente</Text>
                <View style={styles.TextInput}>
                    <Picker
                        selectedValue={forn}
                        onValueChange={(itemValue, itemIndex) => setForn(itemValue)}
                    >
                        <Picker.Item label='Diversos' value='' />
                        {lista_forn.map((item: any) =>
                            <Picker.Item key={item.id} label={item.nome} value={item.id} />
                        )}
                    </Picker>
                </View>
            </View>


            <View>
                    <Text style={styles.TitleInputs}>Valor *</Text>

                    <TextInput
                        placeholder="Valor "
                        onChangeText={(text) => setValor(text)}
                        value={valor}
                        style={styles.TextInput}

                    />
                </View>

           

                <View>
                    <Text style={styles.TitleInputs}>Descrição</Text>

                    <TextInput
                        placeholder="Descrição Caso Tenha"
                        onChangeText={(text) => setDescricao(text)}
                        value={descricao}
                        style={styles.TextInput}

                    />
                </View>

                             

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
                <Text style={styles.TitleInputs}>Documento</Text>
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

           

            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', width:'90%', alignSelf: "center", marginTop:17}}>
            <View style={{width:'50%'}}>
                          
            <View>
            <Text style={styles.titleInputHeader}>Emissão</Text>

            <TouchableOpacity
              style={styles.pickDate}
              onPress={() => setShow(true)}
            >
              <Text style={styles.date}>{format(emissao, 'dd/MM/yyyy')}</Text>
              <AntDesign style={{ alignSelf: 'center', marginLeft: 15, }} name="caretdown" size={10} color="gray" />
            </TouchableOpacity>
          </View>

            {show && (
            <DateTimePicker
            testID="dateTimePicker"
            value={emissao}
            mode="date"
            is24Hour={true}
            display="calendar"
            onChange={onChange}
          />  
          )}
          
                </View>    

                <View style={{width:'50%'}}>

                <View>
            <Text style={styles.titleInputHeader}>Vencimento</Text>

            <TouchableOpacity
              style={styles.pickDate}
              onPress={() => setShow2(true)}
            >
              <Text style={styles.date}>{format(venc, 'dd/MM/yyyy')}</Text>
              <AntDesign style={{ alignSelf: 'center', marginLeft: 15, }} name="caretdown" size={10} color="gray" />
            </TouchableOpacity>
          </View>

                {show2 && (
                <DateTimePicker
            testID="dateTimePicker"
            value={venc}
            mode="date"
            is24Hour={true}
            display="calendar"
            onChange={onChange2}
          />  
          )}
                </View>
                </View>


            <View>
                <Text style={styles.TitleInputs}>Frequência</Text>
                <View style={styles.TextInput}>
                    <Picker
                        selectedValue={freq}
                        onValueChange={(itemValue, itemIndex) => setFreq(itemValue)}
                    >
                        
                        {lista_freq.map((item: any) =>
                            <Picker.Item key={item.nome} label={item.nome} value={item.nome} />
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

export default NovaContaReceber;