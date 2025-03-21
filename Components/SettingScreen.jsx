import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const SettingScreen = () => {
  const [captain, setCaptain] = useState([]);
  useEffect(() => {
    const fetchCaptain = async () => {
      try {
        const data = await AsyncStorage.getItem("players");
        const parsedData = data ? JSON.parse(data) : [];
        const captainList = parsedData.filter((player) => player.isCaptain);
        setCaptain(captainList);
      } catch (error) {
        console.error("Error fetching captain:", error);
      }
    };
    fetchCaptain();
  });
  return (
    <View>
      <FlatList
        data={captain}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PlayerCard player={item} />}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" }
});
export default SettingScreen;
