import React from 'react';
import {View, Text, TextInput} from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";


type Props = {
    placeholder: string;
    value?: string;
    onPress?: () => void;
    onChangeText: (text: string) => void;
    ref?: React.Ref<TextInput>;
    className?: string;
}

export default function SearchBar({placeholder, ref, onPress, onChangeText, value, className}: Props) {
    return (
        <View className={`flex-row items-center bg-white rounded px-2 ${className}`}>
            <Ionicons name="search" size={15}/>
            <TextInput
                ref={ref}
                onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor='#a8b5db'
                className='flex-1 ml-2 py-2 '
            />
        </View>
    );
}
