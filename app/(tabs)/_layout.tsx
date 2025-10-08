import {Tabs} from "expo-router";
import {MyTabBar} from "@/components/TabBar";
import {Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const TabLayout = () => {
    return (
        <Tabs
            tabBar={(props) => <MyTabBar {...props}/>}
            screenOptions={{
                headerShown: false,
                sceneStyle: {backgroundColor: "#fffff", padding: 15},
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Das Alphabet",
                }}
            />
            <Tabs.Screen
                name="vocabulary"
                options={{
                    title: "Vocabulary",
                }}
            />
            <Tabs.Screen
                name="grammar"
                options={{
                    title: "Grammar",
                }}
            />
            <Tabs.Screen
                name="setting"
                options={{
                    title: "Settings",
                }}
            />
        </Tabs>
    )
}


export default TabLayout