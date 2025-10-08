import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Alphabet} from "@/types";
import {useAudioPlayer} from "expo-audio";

export function AlphabetCard({letter, pronunciation, audio_url}: Alphabet) {

    const player = useAudioPlayer(audio_url);

    const playSound = async () => {
        player.seekTo(0);
        player.play();
    }

    return (
        <TouchableOpacity
            onPress={playSound}
            className="flex-1 min-w-[28%]  h-[80] bg-white rounded-lg shadow-md  justify-center flex-col items-center">
            <Text className="text-xl font-semibold text-[#219af5]">{letter}</Text>
            <Text>{pronunciation}</Text>
        </TouchableOpacity>
    );
}
