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
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useRouter } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import ListEmpty from "@/components/ListEmpty";
import { useVocabulary } from "@/lib/hooks/useVocabulary";

export default function VocabularyList() {
  const { id, name } = useLocalSearchParams();
  const stringId = Array.isArray(id) ? id[0] : id;
  const { data: vocabulary, status } = useVocabulary(stringId);
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearch = useDebounce(searchText, 400);
  const [searchVisible, setSearchVisible] = useState(false);
  const router = useRouter();

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
          height: Platform.OS === "ios" ? 110 : 90,
        }}
        className="absolute top-0 left-0 right-0 z-10 flex-row items-center gap-3 bg-white px-4"
      >
        <TouchableOpacity
          className="rounded-full bg-black/5 p-2"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>

        {searchVisible ? (
          <TextInput
            className="flex-1 rounded-full bg-black/5 p-3  text-base text-black"
            placeholder="Search..."
            placeholderTextColor="#000"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            pointerEvents="none"
          />
        ) : (
          <View className="flex-1">
            <Text className="text-xl font-bold text-black">Vocabulary</Text>
            <Text className="text-sm text-gray-600">{name}</Text>
          </View>
        )}

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="rounded-full bg-black/5 p-2"
            onPress={() => {
              const nextVisible = !searchVisible;
              setSearchVisible(nextVisible);
              if (!nextVisible) setSearchText("");
            }}
          >
            <Ionicons
              name={searchVisible ? "close-outline" : "search-outline"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>

          {stringId ? (
            <TouchableOpacity
              className="rounded-full bg-black/5 px-3 py-1.5 flex-row items-center gap-1"
              onPress={() =>
                router.push({
                  pathname: "/flashcard",
                  params: { id: stringId },
                })
              }
            >
              <Ionicons name="sparkles-outline" size={18} color="#000" />
              <Text className="text-sm font-semibold text-black">
                Flashcards
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
