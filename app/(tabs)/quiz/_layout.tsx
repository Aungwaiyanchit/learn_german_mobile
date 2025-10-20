import HeaderBar from "@/components/HeaderBar";
import { Stack } from "expo-router";

const QuizLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="vocab"
        options={{
          header: ({ navigation }) => (
            <HeaderBar
              title="Quiz"
              subtitle="Vocabulary"
              onBack={navigation.goBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name="grammar"
        options={{
          header: ({ navigation }) => (
            <HeaderBar
              title="Quiz"
              subtitle="Grammar"
              onBack={navigation.goBack}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default QuizLayout;
