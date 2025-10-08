import React, {useMemo} from 'react';
import {View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Markdown from "react-native-markdown-display";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "@/components/Header";
import {useFetch} from "@/hooks/useFetch";
import {fetchGrammar} from "@/services/api";
import {Link} from "expo-router";


function shuffle<T>(array: T[]): T[] {
    const arr = [...array]; // copy to avoid mutating original
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index 0–i
        [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
    }
    return arr;
}


export default function Grammar() {
    const {data, status} = useFetch(() => fetchGrammar());

    const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6"];

    // 🔀 Shuffle colors once when data changes
    const borderColors = useMemo(() => {
        const shuffled = shuffle(COLORS);
        // repeat colors if there are more items than colors
        return data?.map((_, idx) => shuffled[idx % shuffled.length]) || [];
    }, [data]);
    return (
        <SafeAreaView className="flex-1 bg-white">
            <Header title="Grammar"/>
            <FlatList data={data} renderItem={({item, index}) => (
                <Link href={{
                    pathname: `/grammar/[id]`,
                    params: {
                        id: item.id,
                        markdown: item.markdownContent,
                        title: item.title,
                    }
                }} asChild>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => {
                    }} className={`bg-gray mt-2 p-3 border-l-2 flex justify-between items-center gap-2 flex-row`} style={{
                        borderColor: borderColors[index] || "#000",
                    }}>
                        <View>
                            <Text className="font-semibold text-lg">{item.title}</Text>
                            <Text>{item.description}</Text>
                        </View>
                        <View className="bg-black rounded-md p-1">
                            <Text className="text-white text-xs">{item.level}</Text>
                        </View>
                    </TouchableOpacity>
                </Link>
            )}/>

        </SafeAreaView>
    );
}

