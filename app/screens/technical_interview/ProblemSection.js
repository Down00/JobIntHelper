import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProblemSection = ({ problem, onBack }) => {
  const [activeTab, setActiveTab] = useState("Problem"); // Track active tab
  const [revealedHints, setRevealedHints] = useState([]); // Track which hints are revealed

  if (!problem) {
    return <Text>No problem selected.</Text>;
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#4CAF50"; // Green for Easy
      case "Medium":
        return "#FFC107"; // Yellow for Medium
      case "Hard":
        return "#F44336"; // Red for Hard
      default:
        return "#4CAF50"; // Default to green if difficulty is missing
    }
  };

  // Get the color based on difficulty
  const difficultyColor = getDifficultyColor(problem.difficulty);

  const highlightKeywords = (text) => {
    const parts = text.split(/(Example)/i);
    return parts.map((part, index) => (
      <Text
        key={index}
        style={/Example/i.test(part) ? { color: difficultyColor, fontWeight: 'bold' } : null}
      >
        {part}
      </Text>
    ));
  };

  const renderDescription = () => {
    const descriptionParts = problem.description.split(/```python|```/);
    return descriptionParts.map((part, index) => {
      // If the index is odd, it's a code block, otherwise it's normal text
      if (index % 2 === 1) {
        return (
          <View key={index} style={styles.codeContainer}>
            <Text style={styles.codeText}>{part.trim()}</Text>
          </View>
        );
      }
      return (
        <Text key={index} style={styles.problemText}>
          {highlightKeywords(part.trim())}
        </Text>
      );
    });
  };

  // Toggle the visibility of a specific hint
  const toggleHintVisibility = (index) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter((i) => i !== index)); // Hide hint
    } else {
      setRevealedHints([...revealedHints, index]); // Show hint
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Problem":
        return (
          <ScrollView style={styles.contentContainer}>
            {renderDescription()}
          </ScrollView>
        );
      case "Hints":
        return (
          <View>
            <Text style={[styles.sectionTitle, { color: difficultyColor }]}>Hints:</Text>
            {problem.hints.map((hint, index) => (
              <View key={index} style={styles.hintContainer}>
                <TouchableOpacity
                  onPress={() => toggleHintVisibility(index)}
                  style={[styles.showHintButton, { backgroundColor: difficultyColor }]}
                >
                  <Text style={styles.showHintButtonText}>
                    {revealedHints.includes(index)
                      ? "Hide Hint"
                      : `Show Hint ${index + 1}`}
                  </Text>
                </TouchableOpacity>
                {revealedHints.includes(index) && (
                  <Text style={styles.hintText}>{highlightKeywords(hint)}</Text>
                )}
              </View>
            ))}
          </View>
        );
      case "Solution":
        return (
          <View>
            <Text style={[styles.sectionTitle, { color: difficultyColor }]}>Solution:</Text>
            <Text style={styles.solutionText}>
              {highlightKeywords(problem.solution.text)}
            </Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.codeContainer}>
                <Text style={styles.codeText}>{problem.solution.code}</Text>
              </View>
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.maintitle}>
        <TouchableOpacity style={styles.backbutton} onPress={onBack}>
          <Ionicons name="arrow-back" size={30} color="#E5E5E5" />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Apply difficulty color to the title */}
          <Text style={[styles.title, { color: difficultyColor }]}>
            {problem.title}
          </Text>
        </View>
        <View style={{ width: 30 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "Problem" && { backgroundColor: difficultyColor },
          ]}
          onPress={() => setActiveTab("Problem")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Problem" && { color: "#FFF", fontWeight: "bold" },
            ]}
          >
            Problem
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "Hints" && { backgroundColor: difficultyColor },
          ]}
          onPress={() => setActiveTab("Hints")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Hints" && { color: "#FFF", fontWeight: "bold" },
            ]}
          >
            Hints
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "Solution" && { backgroundColor: difficultyColor },
          ]}
          onPress={() => setActiveTab("Solution")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Solution" && { color: "#FFF", fontWeight: "bold" },
            ]}
          >
            Solution
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Based on Active Tab */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: '140%',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#2E2E2E",
  },
  backbutton: {},
  maintitle: {
    marginBottom: 5,
    marginVertical: -10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1F1F1F",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#4CAF50",
  },
  tabText: {
    color: "#A5A5A5",
    fontSize: 16,
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  contentContainer: {
    flexGrow: 1,
  },
  problemText: {
    color: "#E0E0E0",
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  hintContainer: {
    marginBottom: 10,
  },
  showHintButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  showHintButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  hintText: {
    color: "#A5A5A5",
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 5,
  },
  highlightedText: {
    color: "#4CAF50", // Green color to highlight "example"
    fontWeight: "bold",
  },
  solutionText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
  },
  codeContainer: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  codeText: {
    color: "#FFF",
    fontFamily: "monospace",
    fontSize: 14,
  },
});

export default ProblemSection;
