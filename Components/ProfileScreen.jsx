import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [favoritePlayers, setFavouritePlayers] = useState([]);
  useEffect(() => {
    const fetchFavourites = async () => {
      const data = await AsyncStorage.getItem("players");
      const parsedData = data ? JSON.parse(data) : [];
      const favourites = parsedData.filter(player => player.favourite);
      setFavouritePlayers(favourites);
    };
    fetchFavourites();
  });
  return (
    <View>
      <FlatList
        data={favoritePlayers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <PlayerCard player={item} />}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" }
});
export default ProfileScreen;
