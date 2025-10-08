import {Stack} from "expo-router";
import "./global.css";
import {StatusBar} from "expo-status-bar";


export default function RootLayout() {
    return (
        <>
            <StatusBar style="dark"/>
            <Stack
                screenOptions={{
                    contentStyle: { backgroundColor: "#ffff" }
                }}
            >
                <Stack.Screen name="(tabs)" options={{headerShown: false}}></Stack.Screen>
                <Stack.Screen name="vocabulary/[id]"
                              options={{headerShown: false}}></Stack.Screen>
                <Stack.Screen name="grammar/[id]"
                              options={{headerShown: false}}></Stack.Screen>
            </Stack>
        </>
    )
}
