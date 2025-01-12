import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const LanguageSelection = ({ setSelectedLanguage, setStep }) => {
  const languages = [
    { name: "Python", icon: "python", color: "#306998" },
    { name: "JavaScript", icon: "js", color: "#F7DF1E" },
    { name: "C#", icon: "c#", color: "#9B4F96" },
    { name: "HTML", icon: "html5", color: "#E34F26" },
    { name: "C++", icon: "C+", color: "#F34B7D" },
    { name: "Ruby", icon: "gem", color: "#E0115F" },
    { name: "Flutter", icon: "flutter", color: "#42A5F5" },
    { name: "CSS", icon: "css3", color: "#264DE4" },
    { name: "React", icon: "react", color: "#61DAFB" },
    { name: "Java", icon: "coffee", color: "#F89820" },
  ];

  const renderLanguageCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedLanguage(item.name);
        setStep(2);
      }}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "22" }]}
      >
        <FontAwesome5 name={item.icon} size={32} color={item.color} />
      </View>
      <Text style={styles.languageText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Programming Languages</Text>
      <FlatList
        data={languages}
        renderItem={renderLanguageCard}
        keyExtractor={(item) => item.name}
        numColumns={2} // Display in grid view with 2 columns
        contentContainerStyle={[styles.grid, {paddingBottom: 130}]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#292929', // Set the background color directly here
    paddingTop: 50, // Add padding to the top to avoid overlapping with the header
    marginTop: -20, // Add padding to the top to avoid overlapping with the
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  grid: {
    justifyContent: "center",
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c1c1c1",
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 15,
    minWidth: 140, 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  languageText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
});

export default LanguageSelection;
