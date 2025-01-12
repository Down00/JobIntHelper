import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { difficulties, jobTypes } from "./UTILS/constants";

// Mapping job types to readable labels
const jobTypeLabels = {
  datascience: "Data Science",
  softwareengineer: "Software Engineering",
  frontend: "Frontend Development",
  backend: "Backend Development"
};

const JobSelection = ({ jobType, setJobType, difficulty, setDifficulty }) => {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleJobTypeSelect = (type) => {
    if (jobType !== type) {
      setJobType(type);
      setModalVisible(true);
    } else if (!isModalVisible) {
      setModalVisible(true);
    }
  };

  const handleDifficultySelect = (level) => {
    if (difficulty !== level) {
      setDifficulty(level);
    }
    setModalVisible(false);
  };

  const BackPress = () => {
    router.replace('./../../(tabs)/dashboard');
  };

  return (
    <View style={{ flexGrow: 1 }}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#292929' }]} />
        <View style={styles.selectionContainer}>
          <View style={styles.Header}>
            <TouchableOpacity style={styles.backbutton} onPress={BackPress}>
              <Ionicons name="arrow-back" size={30} color="#E5E5E5" />
            </TouchableOpacity>
  
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.title}>Choose Job Type</Text>
            </View>
  
            {/* Placeholder to balance the back button */}
            <View style={{ width: 30 }} />
          </View>
  
          <View style={styles.selectionSection}>
            <View style={styles.optionsContainerColumn}>
              {jobTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    jobType === type && styles.optionButtonActive,
                  ]}
                  onPress={() => handleJobTypeSelect(type)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      jobType === type && styles.optionButtonTextActive,
                    ]}
                  >
                    {jobTypeLabels[type]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
  
          {/* Difficulty Modal */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={['#292929', '#000']}
                  style={styles.modalGradient}
                >
                  <Text style={styles.modalTitle}>Select Difficulty</Text>
  
                  <View style={styles.optionsContainer}>
                    {difficulties.map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.optionButtonModal,
                          difficulty === level && styles.optionButtonActive,
                        ]}
                        onPress={() => handleDifficultySelect(level)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            difficulty === level && styles.optionButtonTextActive,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
  
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </Modal>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    flex: 1,
    padding: 20,
    marginTop: -15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 45,
  },
  selectionSection: {
    marginBottom: 10,
  },
  optionsContainerColumn: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  optionButton: {
    padding: 15,
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  optionButtonModal: {
    padding: 15,
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    width: '100%',
  },
  optionButtonActive: {
    backgroundColor: "#2E7C81",
    shadowOpacity: 0.5,
  },
  optionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: '500',
  },
  optionButtonTextActive: {
    fontWeight: "bold",
    color: '#FFF',
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker semi-transparent background
  },
  modalContainer: {
    width: "90%",
    borderRadius: 20,
    padding: 0,
    alignItems: "center",
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 20,
    width: '100%',
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#E74C3C",
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    elevation: 3,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
  },
  backbutton: {
    margin: 3,
    marginTop: 40,
  },
  Header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default JobSelection;
