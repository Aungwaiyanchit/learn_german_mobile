import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import TabBarButton from "@/components/TabBarButton";
import {useLinkBuilder} from "@react-navigation/native";
import {useState} from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle, withSpring
} from 'react-native-reanimated';

export function MyTabBar({state, descriptors, navigation}: BottomTabBarProps) {

    const {buildHref} = useLinkBuilder();
    const [width, setWidth] = useState(100);

    const onLayout = (e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
    }

    const tabIndex = useSharedValue(state.index);

    const highlightStyle = useAnimatedStyle(() => {
        if (width === 0) return {};
        const buttonWidth = width / state.routes.length;

        return {
            transform: [
                {
                    translateX: withSpring(buttonWidth * tabIndex.value, {
                        damping: 60,
                        stiffness: 500,
                    }),
                },
            ],
            width: buttonWidth - 20,
        };
    }, [width]);

    return (
        <View onLayout={onLayout} style={styles.tabBar}>
            {
                width > 0 && (
                    <Animated.View
                        style={[
                            styles.highlight,
                            highlightStyle,
                            {height: 50}
                        ]}
                    />
                )
            }
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    tabIndex.value = index;
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TabBarButton
                        key={route.name}
                        href={buildHref(route.name, route.params)}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testId={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        label={label as string}
                        routeName={route.name}
                    />
                );
            })}
        </View>
    )
        ;
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        bottom: 20,
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: '#000',
        borderRadius: 35,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },

        // Android shadow
        elevation: 6,
    },
    highlight: {
        position: "absolute",
        // backgroundColor: "#219af5",
        backgroundColor: "#fff",
        borderRadius: 50,
        marginHorizontal: 10,
    },
})
