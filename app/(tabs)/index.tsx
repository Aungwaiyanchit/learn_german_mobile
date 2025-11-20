import React from 'react'
import {ScrollView, Text } from 'react-native'
import {BASIC_ALPHABET, Umlaut} from "@/lib/constant/alphabets";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from 'expo-linear-gradient';
import {AlphabetCard} from "@/components/AlphabetCard";
import Header from "@/components/Header";


const Container = ({children}: { children: React.ReactNode }) => {
    return (
        <LinearGradient
            style={{
                borderRadius: 10,
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                padding: 10,
                gap: 10,
                marginVertical: 10
            }}
            colors={["#808080", "transparent"]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
        >
            {children}
        </LinearGradient>
    );
}

const Index = () => {
    return (
        <SafeAreaView className="flex-1 px-5">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{
                minHeight: '100%', paddingBottom: 80
            }}>
                <Header title="Das Alphabet"/>
                <Text>The alphabet consists of 26 letters, similar to the English alphabet.</Text>
                <Container>
                    {BASIC_ALPHABET.map((item) => (
                        <AlphabetCard key={item.letter}  {...item}/>
                    ))}
                </Container>

                <Text className="text-xl font-semibold mt-5">Umlauts and Special Characters</Text>
                <Text>In addition to the basic letters, the German alphabet includes umlauts and a special
                    character</Text>
                <Container>
                    {Umlaut.map((item) => (
                        <AlphabetCard key={item.letter}  {...item}/>
                    ))}
                </Container>

            </ScrollView>

        </SafeAreaView>
    )
}

export default Index
