import { Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "expo-status-bar";
import HeaderBar from "@/components/HeaderBar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#ffff" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="vocabulary/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="grammar/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="quiz/vocab"
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
          name="quiz/grammar"
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
    </QueryClientProvider>
  );
}
