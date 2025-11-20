import { Link } from "expo-router";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import SkeletonList from "@/components/SkeletonList";

import { useChapters } from "@/lib/hooks/useChapters";

const Vocabulary = () => {
  const { data: chapters, status } = useChapters();

  return (
    <SafeAreaView className="flex-1 px-5 bg-white">
      <Header title="Vocabulary" />
      {status === "pending" ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={chapters}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: `/vocabulary/[id]`,
                params: {
                  id: item.id,
                  name: item.slug,
                  color: item.colorTag,
                },
              }}
              asChild
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {}}
                className={`bg-gray mt-2 p-3 border-l-2`}
                style={{
                  borderColor: item.colorTag,
                }}
              >
                <Text className="text-lg font-semibold">{item.slug}</Text>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Vocabulary;
