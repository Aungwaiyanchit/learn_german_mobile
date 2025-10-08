import {Link} from "expo-router";
import React from 'react'
import {FlatList, Text, TouchableOpacity} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {useFetch} from "@/hooks/useFetch";
import {fetchChapters} from "@/services/api";
import Header from "@/components/Header";

const Vocabulary = () => {
    const {data: chapters} = useFetch(() => fetchChapters(), true);
    return (
        <SafeAreaView className="flex-1">
            <Header title="Vocabulary"/>
            <FlatList
                data={chapters}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Link href={{
                        pathname: `/vocabulary/[id]`,
                        params: {
                            id: item.id,
                            name: item.slug,
                            color: item.colorTag,
                        }
                    }} asChild>
                        <TouchableOpacity activeOpacity={0.5} onPress={() => {
                        }} className={`bg-gray mt-2 p-3 border-l-2`} style={{
                            borderColor: item.colorTag
                        }}>
                            <Text className="text-lg font-semibold">{item.slug}</Text>
                            <Text>{item.title}</Text>
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </SafeAreaView>
    )
}

export default Vocabulary