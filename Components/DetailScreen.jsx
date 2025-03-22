import {
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailScreen({ navigation }) {
  const route = useRoute();
  const { id } = route.params;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);
  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const response = await axios.get(
          `https://67c7202cc19eb8753e78b99e.mockapi.io/Players/${id}`
        );
        if (response.status >= 200 && response.status < 300) {
          setData(response.data);
        } else {
          throw new Error(`HTTP Status: ${response.status}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataById();
  }, [id]);

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
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠ Lỗi: {error}</Text>
      </View>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>🚫 Không có dữ liệu!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: data.image }} style={styles.image} />

      <Text style={styles.name}>
        {data.playerName}{" "}
        {data.isCaptain && <Text style={styles.captainBadge}>🏆 Captain</Text>}
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          📅 Năm sinh: <Text style={styles.value}>{data.YoB}</Text>
        </Text>
        <Text style={styles.infoText}>
          ⏳ Thời gian thi đấu:{" "}
          <Text style={styles.value}>{data.MinutesPlayed} phút</Text>
        </Text>
        <Text style={styles.infoText}>
          📌 Vị trí: <Text style={styles.value}>{data.position}</Text>
        </Text>
        <Text style={styles.infoText}>
          🏟 Đội: <Text style={styles.value}>{data.team}</Text>
        </Text>
        <Text style={styles.infoText}>
          🎯 Chính xác chuyền bóng:{" "}
          <Text style={styles.value}>
            {(data.PassingAccuracy * 100).toFixed(1)}%
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(data)}
      >
        <Text style={styles.favoriteText}>
          {favourites.some((fav) => fav.id === data.id)
            ? "❤️ Bỏ yêu thích"
            : "🤍 Yêu thích"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>⬅ Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 20
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA"
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#FF5733"
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10
  },
  captainBadge: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginLeft: 5
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4
  },
  infoText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 8
  },
  value: {
    fontWeight: "bold",
    color: "#FF5733"
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold"
  },
  favoriteButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4
  },
  favoriteText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center"
  },
  backButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center"
  }
});
