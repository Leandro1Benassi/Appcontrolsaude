import { StyleSheet } from "react-native";
import fonts from "../../styles/fonts";

export const styles = StyleSheet.create({
    dates: {
        flexDirection: 'row',
        alignSelf: "center",
        marginTop: 15,
    },

    ButtonDates: {
        backgroundColor: '#c1c1c1',
        width: 100,
        padding: 5,
        height: 30,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },

    ButtonDatesText: {
        fontFamily: fonts.text,
        fontSize: 16,
        color: '#fff',
    },

    Button: {
        backgroundColor: 'green',
        width: '60%',
        alignSelf: "center",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 35,
        marginBottom: 20,
    },

    ButtonText: {
        fontSize: 20,
        color: '#fff',
        fontFamily: fonts.text,
    },

    inputObsHeader: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 5,
        borderColor: '#c1c1c1',
        borderWidth: 1,
        height: 40,
        marginTop: 20,
        paddingHorizontal: '27%',
        justifyContent: "center",
    },

    Dates: {
        flexDirection: 'row',
        alignSelf: "center",
        marginBottom: 10,
    },

    pickDate: {
        padding: 10,
        width: 120,
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#c1c1c1',
        marginHorizontal: 5,
        height: 62,
    },

    date: {
        fontFamily: fonts.text,
        fontSize: 16,
        color: 'gray',
    },

    CardContainer:{
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        paddingHorizontal: 5,
        marginHorizontal: 15,
        borderRadius: 5,
        borderLeftWidth: 8,
        borderLeftColor: 'red',
    },

    CardContainerVerde:{
        backgroundColor: '#FAFAFA',
        marginBottom: 10,
        paddingHorizontal: 25,
        marginHorizontal: 15,
        borderRadius: 5,
        borderLeftWidth: 8,
        borderLeftColor: 'green',
    },

    Cliente:{
        fontFamily: fonts.text,
        fontSize: 15,
        marginTop: 10,
    },

    Valor:{
        fontFamily: fonts.text,
        fontSize: 18,
        color: '#31b555',
        marginBottom: 5,
    },

    ValorRes:{
        fontFamily: fonts.text,
        fontSize: 13,
        color: '#ff3333',
        marginBottom: 5,
    },

    Section:{
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 5,
    },

    Entrada:{
        fontFamily: fonts.text,
        fontSize: 14,
        marginLeft: 20,
        color: 'gray',
    },

    Vencimento:{
        fontFamily: fonts.text,
        fontSize: 14,
        position: 'absolute',
        right: 0,
        color: 'gray',
    },

    Vencimento2:{
        position: 'absolute',
        right: 0,
        height:35,
        width:35,
        top:-50,
    },
    

    Footer:{
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: 0.5,
        borderTopColor: '#c1c1c1',
        padding: 7,
        marginTop: 12,
        width: '95%',
        alignSelf: "center",
    },

    FooterText:{
        fontFamily: fonts.text,
        fontSize: 14,
    },

    Icon:{
        position: 'absolute',
        left: -5,
    },

    containerFloat:{
        bottom: 20,
        right: 20,
        position: 'absolute',
        backgroundColor: 'green',
        borderRadius: 10,
        zIndex: 9,
        width: 50,
        height: 50,
        justifyContent: "center",
    },

    CartButton:{
        justifyContent: "center",
        alignItems: "center",
    },

    centralizarModal:{    
    flex: 1,
    justifyContent: "center",    
    backgroundColor: 'rgba(0, 0, 0, 0.37)'
    },

    removeItem:{
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginRight: 10,
    marginTop: 15,
  },

  CardContainerModal:{
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    paddingBottom:15,
    
},

ImagemModal:{  
        
        width:300,
        height:300,
        
    },

    viewImg:{  
        
        justifyContent: "center",   
        alignItems: "center",   
        margin:10,       
    },

    textoAbrir:{
        fontFamily: fonts.text,
        fontSize: 13,
        color: 'gray',
    },

    tituloModal:{
        fontFamily: fonts.text,
        fontSize: 16,
        marginTop:-20,
        paddingBottom:10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#a3a3a3',
        marginRight:20,
    },

    TitleInputs:{
        fontFamily: fonts.text,
        fontSize: 18,
        color: "#000",
        marginLeft: 15,
        marginTop: 15,
    },

    TextInput:{
        borderWidth: 0.5,
        borderColor: '#000',
        width: '95%',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
        justifyContent: "center",
        marginHorizontal: 5,
        alignSelf: "center",
        backgroundColor: '#fff',
        height: 45,
    },

})