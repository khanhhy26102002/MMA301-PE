import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";

const SettingScreen = () => {
  const [captains, setCaptains] = useState([]);

  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await fetch(
          "https://67c7202cc19eb8753e78b99e.mockapi.io/Players"
        );
        const data = await response.json();

        console.log("Raw data from API:", data);

        if (!Array.isArray(data)) {
          console.error("Data from API is not an array!", data);
          return;
        }

        const filteredCaptains = data
          .filter(
            (player) =>
              player.isCaptain &&
              player.YoB &&
              new Date().getFullYear() - player.YoB > 34
          )
          .sort((a, b) => a.MinutesPlayed - b.MinutesPlayed);

        console.log("Filtered Captains:", filteredCaptains);
        setCaptains(filteredCaptains);
      } catch (error) {
        console.error("Error fetching captains:", error);
      }
    };
    fetchCaptains();
  }, []);
  const removeCaptain = async (playerId) => {
    try {
      const updatedCaptains = captains.filter(
        (player) => player.id !== playerId
      );
      setCaptains(updatedCaptains);

      await AsyncStorage.setItem("favourites", JSON.stringify(updatedCaptains));
      console.log(`Deleted player ${playerId}`);
    } catch (error) {
      console.error("Error deleting captain:", error);
    }
  };

  return (
    <View style={styles.screen}>
      {captains.length === 0 ? (
        <Text style={styles.emptyText}>Không có đội trưởng nào phù hợp.</Text>
      ) : (
        <FlatList
          data={captains}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={({ item }) => (
            <PlayerCard player={item} onDelete={removeCaptain} />
          )}
        />
      )}
    </View>
  );
};

const PlayerCard = ({ player, onDelete }) => {
  console.log("Rendering PlayerCard:", player);

  if (!player) return null;

  return (
    <View style={styles.card}>
      <Image source={{ uri: player.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{player.playerName}</Text>
        <Text style={styles.details}>🎂 Năm sinh: {player.YoB}</Text>
        <Text style={styles.details}>
          ⏳ Thời gian thi đấu: {player.MinutesPlayed} phút
        </Text>
        <Text style={styles.details}>⚽ Vị trí: {player.position}</Text>
        <Text style={styles.details}>🏟️ Đội: {player.team}</Text>
        <Text style={styles.details}>
          🎯 Độ chính xác chuyền: {player.PassingAccuracy}%
        </Text>
        <Text style={styles.captainTag}>🏆 Captain</Text>

        {/* 🔥 Nút Xóa */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(player.id)}
        >
          <Text style={styles.deleteButtonText}>❌ Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10
  },
  emptyText: {
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
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    alignSelf: "flex-start"
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold"
  }
});

export default SettingScreen;
