import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useMemo, useState } from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import * as Speech from "expo-speech";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigation } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import ListEmpty from "@/components/ListEmpty";
import { useVocabulary } from "@/hooks/useVocabulary";

export default function VocabularyList() {
  const { id, name } = useLocalSearchParams();
  const stringId = Array.isArray(id) ? id[0] : id;
  const { data: vocabulary, status } = useVocabulary(stringId);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearch = useDebounce(searchText, 400);
  const [searchVisible, setSearchVisible] = useState(false);
  const navigation = useNavigation();

  const filterData = useMemo(() => {
    if (!vocabulary) return [];
    const search = debouncedSearch.toLowerCase();
    return vocabulary.filter(
      (vocab) =>
        vocab.term.toLowerCase().includes(search) ||
        vocab.translation.toLowerCase().includes(search),
    );
  }, [debouncedSearch, vocabulary]);

  if (status === "pending") {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1">
      <View
        style={{
          paddingTop: Platform.OS === "ios" ? 40 : 20,
          height: Platform.OS === "ios" ? 110 : 90
        }}
        className="absolute top-0 left-0 right-0 z-10  flex-row items-center justify-between px-4 bg-white"
      >
        {searchVisible ? (
          <TextInput
            className="flex-1 text-lg  text-black px-2  mr-2"
            placeholder="Search..."
            placeholderTextColor="#000"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
        ) : (
          <View className="flex-row items-center justify-between gap-5">
            <TouchableOpacity
              className={`rounded-full bg-black/80 p-1`}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text className="text-black font-bold text-xl">Vocabulary</Text>
              <Text className="text-gray  text-sm">{name}</Text>
            </View>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            setSearchVisible(!searchVisible);
            if (searchVisible) setSearchText("");
          }}
        >
          <Ionicons
            name={searchVisible ? "close-outline" : "search-outline"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <View className="flex-1 px-3 mt-16 mb-24">
        <FlatList
          className="mt-3 "
          contentContainerStyle={{ flexGrow: 1 }}
          data={filterData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <ListEmpty />}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={async () => {
                await Speech.stop();
                Speech.speak(item.term, {
                  language: "de-DE",
                });
              }}
              className={`${index % 2 !== 0 ? "" : "bg-black/10"} p-3 flex-row justify-between items-center`}
            >
              <View className="py-1">
                <Text className="text-lg font-semibold">
                  {item.term} {item.article && `(${item.article})`}
                </Text>
                <Text className="text-md">{item.translation}</Text>
              </View>
              <Ionicons name="volume-medium-outline" size={20} />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
