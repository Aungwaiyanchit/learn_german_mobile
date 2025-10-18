import Header from "@/components/Header";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Link } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QuizScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Quiz" />
      <Link
        href="/quiz/vocab"
        className={`bg-gray-100 rounded mt-2 p-3  flex justify-between items-center gap-2 flex-row`}
      >
        <View className="flex-row items-center gap-4">
          <Ionicons name="apps" size={20} />
          <Text className="font-semibold text-lg">Vocabulary</Text>
        </View>
      </Link>
      <Link
        href="/quiz/grammar"
        className={`bg-gray-100 rounded mt-2 p-3  flex justify-between items-center gap-2 flex-row`}
      >
        <View className="flex-row items-center gap-4">
          <Ionicons name="document" size={20} />
          <Text className="font-semibold text-lg">Grammar</Text>
        </View>
      </Link>
    </SafeAreaView>
  );
};

export default QuizScreen;
