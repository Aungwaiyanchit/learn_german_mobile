import {View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import Markdown from "react-native-markdown-display";
import {useLocalSearchParams} from "expo-router/build/hooks";
import {SafeAreaView} from "react-native-safe-area-context";
import React from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import {useNavigation} from "expo-router";

export default function GrammarDetail() {
    const {markdown, title} = useLocalSearchParams();
    const navigation = useNavigation();
    return (
        <SafeAreaView className="flex-1 px-3">
            <View
                style={{
                    paddingTop: Platform.OS === 'ios' ? 50 : 20,
                }}
                className="absolute top-3 left-0 right-0 z-10 h-24 flex-row items-center justify-between px-4 bg-white"
            >
                <View className="flex-row items-center justify-between gap-5">
                    <TouchableOpacity
                        className={`rounded-full bg-black/80 p-1`} onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="chevron-back"
                            size={20}
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-black font-bold text-xl">Grammar</Text>
                        <Text className="text-gray  text-sm">{title}</Text>
                    </View>
                </View>
            </View>
            <ScrollView className="flex-1 mt-10" showsVerticalScrollIndicator={false} contentContainerStyle={{
                minHeight: '100%', paddingBottom: 80
            }}>
                <Text className="text-xl font-semibold">Grammar Basics</Text>
                <Markdown
                    style={styles}
                >
                    {markdown}
                </Markdown>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    body: {
        fontSize: 14,
        color: 'black',
    },
    table: {
        marginBottom: 20,
        marginTop: 10
    },
    bullet_list: {
        marginBottom: 20
    },
    hr: {
        marginVertical: 10
    },
    heading3: {
        fontWeight: "semibold"
    },
    heading4: {
        fontWeight: "bold"
    }
})
