import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [players, setPlayers] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedTeam] = useState(null);
  const navigation = useNavigation();
  const checkStoredFavorites = async () => {
    const data = await AsyncStorage.getItem("favourites");
    console.log("Dữ liệu trong AsyncStorage:", data);
  };
  useEffect(() => {
    fetchData();
    loadFavourites();
    checkStoredFavorites();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://67c7202cc19eb8753e78b99e.mockapi.io/Players`
      );
      if (response.status >= 200 && response.status < 300) {
        setPlayers(response.data.sort((a, b) => b.id - a.id));
      } else {
        throw new Error(`HTTP Status:${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadFavourites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favourites");
      if (storedFavorites) {
        setFavourites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (player) => {
    try {
      let storedFavorites = await AsyncStorage.getItem("favourites");
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      let updatedFavorites;

      if (favorites.some((fav) => fav.id === player.id)) {
        updatedFavorites = favorites.filter((fav) => fav.id !== player.id);
      } else {
        updatedFavorites = [...favorites, player];
      }

      await AsyncStorage.setItem(
        "favourites",
        JSON.stringify(updatedFavorites)
      );
      setFavourites(updatedFavorites);
      console.log("Danh sách yêu thích sau khi cập nhật:", updatedFavorites);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách yêu thích:", error);
    }
  };

  const filteredPlayers = selectedTeam
    ? players.filter((player) => player.team === selectedTeam)
    : players;

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.isCaptain && styles.captain]}
            onPress={() => navigation.navigate("Detail", { id: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.playerName}</Text>
              <Text style={styles.details}>Position: {item.position}</Text>
              {item.isCaptain && (
                <Text style={styles.captainTag}>🏆 Captain</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Text style={styles.favoriteIcon}>
                {favourites.some((fav) => fav.id === item.id) ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8"
  },
  card: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center"
  },
  captain: {
    borderColor: "#ffcc00",
    borderWidth: 2
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: "bold"
  },
  details: {
    fontSize: 14,
    color: "gray"
  },
  captainTag: {
    color: "#ffcc00",
    fontWeight: "bold"
  },
  favoriteIcon: {
    fontSize: 24,
    marginLeft: 10
  }
});
