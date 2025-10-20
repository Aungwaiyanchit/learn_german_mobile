import { Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#ffff" },
        }}
      />
    </QueryClientProvider>
  );
}
