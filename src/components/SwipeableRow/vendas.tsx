import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { LongPressGestureHandler, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useAnimatedStyle, useAnimatedGestureHandler, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons'; 
import { useTheme } from '@react-navigation/native';
import { snapPoint } from 'react-native-redash';
import { styles } from './stylesVendas';

import Animated from 'react-native-reanimated';

interface SwipeableRowProps {
    children: ReactNode;
    onPressWhatsapp: () => void;
    
    onPressDelete: () => void;
}

type AnimatedGHContext = {
    x: number;
};

const finalDestination = 70;
const snapPoints = [-70, 0, finalDestination];

const SwipeableRowProd = ({ children, onPressWhatsapp, onPressDelete } : SwipeableRowProps) => {
    const translateX = useSharedValue(0);

    const theme = useTheme();
    
    const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, AnimatedGHContext>({
        onStart: (_, ctx) => {
            ctx.x = translateX.value;
        },

        onActive: ({ translationX }, ctx) => {
            translateX.value = ctx.x + translationX;
        },

        onEnd: ({ velocityX }) => {
            // const dest = snapPoint(translateX.value, velocityX, snapPoints);

            translateX.value = withSpring(
                snapPoint(translateX.value, velocityX, snapPoints),
                {
                    overshootClamping: true
                },

                // () => {
                //     if(dest === finalDestination){
                //         console.log('Yeaaahh!');
                //     }
                // }
            )
        },
    });

    const style = useAnimatedStyle(() => ({
        zIndex: 100,
        backgroundColor: theme.colors.background,
        transform: [{ translateX: translateX.value }]
    }))

    return (
        <View>
            <View style={styles.SwipeableWhatsapp}>
                <View style={styles.whatsapp}>
                    <TouchableOpacity 
                        style={{alignItems: 'flex-end', flex: 1}}
                        onPress={() => onPressWhatsapp()}
                    >
                        <Ionicons name="document" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

          

            <View style={styles.SwipeableDelete}>
                <View style={styles.delete}>
                    <TouchableOpacity 
                        style={{alignItems: 'flex-start', flex: 1}}
                        onPress={() => onPressDelete()}
                    >
                        <MaterialCommunityIcons name="delete-outline" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <PanGestureHandler 
                onGestureEvent={onGestureEvent}
                activeOffsetX={[-10, 10]}
            >
                <Animated.View style={style}>      
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

export default SwipeableRowProd;