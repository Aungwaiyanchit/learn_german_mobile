import React from 'react';
import {View, Text} from 'react-native';

type Props = {
    description?: string
}

export default function ListEmpty({description}: Props) {
    return (
        <View className="flex-1 items-center justify-center">
            <Text>{description ? description : "No Data"}</Text>
        </View>
    );
}
