import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = () => {
  const [favoritePlayers, setFavoritePlayers] = useState([]);

  const fetchFavorites = async () => {
    try {
      const data = await AsyncStorage.getItem("favourites");
      const parsedData = data ? JSON.parse(data) : [];
      setFavoritePlayers(
        parsedData.filter((player) => player.id !== undefined)
      );
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
    }
  };

  // Hàm xóa cầu thủ khỏi danh sách yêu thích
  const removeFavorite = async (id) => {
    try {
      const updatedFavorites = favoritePlayers.filter(
        (player) => player.id !== id
      );
      await AsyncStorage.setItem(
        "favourites",
        JSON.stringify(updatedFavorites)
      );
      setFavoritePlayers(updatedFavorites); // Cập nhật danh sách hiển thị
    } catch (error) {
      console.error("Lỗi khi xóa cầu thủ yêu thích:", error);
    }
  };
  const removeAllFavorites = () => {
    setFavoritePlayers([]);
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  return (
    <View style={styles.screen}>
      {favoritePlayers.length === 0 ? (
        <Text style={styles.text}>Chưa có cầu thủ yêu thích nào</Text>
      ) : (
        <FlatList
          data={favoritePlayers}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.playerName}</Text>
                <Text style={styles.details}>🎂 Năm sinh: {item.YoB}</Text>
                <Text style={styles.details}>
                  ⏳ Thời gian thi đấu: {item.MinutesPlayed} phút
                </Text>
                <Text style={styles.details}>⚽ Vị trí: {item.position}</Text>
                <Text style={styles.details}>🏟️ Đội: {item.team}</Text>
                <Text style={styles.details}>
                  🎯 Độ chính xác chuyền: {item.PassingAccuracy}%
                </Text>
                {item.isCaptain && (
                  <Text style={styles.captainTag}>🏆 Captain</Text>
                )}
              </View>

              {/* Nút xóa */}
              <TouchableOpacity
                onPress={() => removeFavorite(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.removeAllButton}
        onPress={removeAllFavorites}
      >
        <Text style={styles.removeAllText}>🗑 Xóa tất cả</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray",
    marginTop: 20
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#ddd"
  },
  infoContainer: {
    flex: 1
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginTop: 2
  },
  captainTag: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff6b6b"
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ff6b6b"
  },
  deleteText: {
    fontSize: 18,
    color: "white"
  },
  removeAllButton: {
    backgroundColor: "#555",
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
  removeAllText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center"
  }
});

export default ProfileScreen;
