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

export default function HomeScreen() {
  const [players, setPlayers] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const fetchData = async () => {
    const response = await axios.get(
      `https://67c7202cc19eb8753e78b99e.mockapi.io/Players`
    );
    if (response.status >= 200 && response.status < 300) {
      setPlayers(response.data.sort((a, b) => b.id - a.id));
    } else {
      throw new Error(`HTTP Status:${response.status}`);
    }
  };
  useEffect(
    () => {
      fetchData();
      loadFavourites();
    },
    [players]
  );
  const loadFavourites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favourites");
      if (storedFavorites) {
        setFavourites(JSON.stringify(storedFavorites));
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
    }
  };
  const toggleFavorite = async player => {
    let updatedFavorites = [...favourites];
    if (favourites.some(fav => fav.id === player.id)) {
      updatedFavorites = updatedFavorites.filter(fav => fav.id !== player.id);
    } else {
      updatedFavorites.push(player);
    }
    setFavourites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  const filteredPlayers = selectedTeam
    ? players.filter(player => player.team === selectedTeam)
    : players;
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPlayers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={[styles.card, item.isCaptain && styles.captain]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>
                {item.playerName}
              </Text>
              <Text style={styles.details}>
                Position:{item.position} | Age:{item.age}
              </Text>
              {item.isCaptain &&
                <Text style={styles.captainTag}>🏆 Captain</Text>}
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Text style={styles.favoriteIcon}>
                {favourites.some(fav => fav.id === item.id) ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>
          </View>}
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
  teamFilter: {
    flexDirection: "row",
    marginBottom: 10
  },
  teamButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#ddd"
  },
  activeTeam: {
    backgroundColor: "#ff6347"
  },
  teamText: {
    fontWeight: "bold"
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
