import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fafafa',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.1,
        elevation: 6,
        shadowRadius: 15,
        shadowOffset: { width: 1, height: 5 },
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        height: 80,
    },

    menu: {
        position: 'absolute',
        left: 20,
        alignSelf: "center",
        top: 20,
    },

    logo: {
        width: 180,
        height: 60,
        alignSelf: "center",
        marginTop: 5,
    },

    containerHeader: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
})