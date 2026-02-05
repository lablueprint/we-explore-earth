import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useState, useEffect} from 'react';
import type { Event } from '@shared/types/event';

type Props = {
  eventId: string;
};

export default function EventStats({eventId}: Props){
    return (
        <View>
        <Text> Event Stats Page </Text>
        <Text> Your event ID is : {eventId} </Text>
        </View>
    );
}