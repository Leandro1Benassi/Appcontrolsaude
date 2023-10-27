import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/core';

function Header() {
    const navigation: any = useNavigation();

    return (
        <View style={styles.header}>
            <View style={styles.containerHeader}>
                <TouchableOpacity
                    style={styles.menu}
                    onPress={() => navigation.push("Home")}
                >
                    <Ionicons name="md-arrow-back-circle-outline" size={35} color="#000" />
                </TouchableOpacity>

                <Image style={styles.logo} source={require('../../assets/logo2.png')} />
            </View>
        </View>

    );
}

export default Header;