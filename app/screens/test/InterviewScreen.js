// components/InterviewScreen.js
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { Colors } from "./../../../constants/Colors";
import {
  calculateAnswerScore,
  filterQuestionsByDifficulty,
  provideEfficientFeedback,
  shuffleArray,
} from "./UTILS/analysisUtils";
import {
  playRecording,
  startRecording,
  stopRecording,
} from "./UTILS/audioUtils";
import { jobQuestions } from "./UTILS/constants";
import { analyzeEmotion } from "./UTILS/emotionalAnalysis"; // Adjust the path as needed

// Helper function to format time in mm:ss
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// Map difficulty to timer duration in seconds
const difficultyToDuration = {
  easy: 180, // 3 minutes
  medium: 240, // 4 minutes
  hard: 300, // 5 minutes
};

const InterviewScreen = ({ jobType, difficulty, resetSelection }) => {
  const router = useRouter();
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [inputMethod, setInputMethod] = useState("text"); // Default to text input
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);

  // Speech-to-text state variables
  const [recording, setRecording] = useState(null);
  const [recordingURI, setRecordingURI] = useState(null);
  const [sound, setSound] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loadingTranscription, setLoadingTranscription] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState(false); // NEW state for error handling

  // Timer state variables
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const maxScorePerAnswer = 10;

  // Load questions based on job type and difficulty
  useEffect(() => {
    if (jobType && difficulty) {
      const selectedQuestions = filterQuestionsByDifficulty(
        jobQuestions[jobType],
        difficulty
      );

      if (!selectedQuestions || selectedQuestions.length === 0) {
        Alert.alert(
          "No Questions Found",
          `No questions found for ${jobType} at ${difficulty} difficulty.`,
          [{ text: "OK", onPress: resetSelection }]
        );
        setInterviewQuestions([]);
      } else {
        // Shuffle and limit to 5 questions
        const shuffledQuestions = shuffleArray(selectedQuestions).slice(0, 5);
        setInterviewQuestions(shuffledQuestions);
      }
    }
  }, [jobType, difficulty]);

  // Set up timer when a new question is loaded
  useEffect(() => {
    if (
      interviewQuestions.length > 0 &&
      currentQuestionIndex < interviewQuestions.length
    ) {
      const currentQ = interviewQuestions[currentQuestionIndex];
      const questionDifficulty = difficulty; // Assuming all questions have the same difficulty
      const duration = difficultyToDuration[questionDifficulty] || 180; // default to easy if undefined
      setTimeLeft(duration);
      startTimer(duration);
    }
    // Cleanup timer when question changes
    return () => {
      clearTimer();
    };
  }, [interviewQuestions, currentQuestionIndex]);

  const startTimer = (duration) => {
    clearTimer(); // Ensure no existing timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearTimer();
          handleTimerExpire();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimerExpire = () => {
    Alert.alert(
      "Time's Up",
      "You ran out of time for this question. Moving to the next question with a score of 0.",
      [{ text: "OK", onPress: handleNextQuestion }]
    );
    // Add zero score for this question
    const currentQ = interviewQuestions[currentQuestionIndex];
    setTotalScore((prevScore) => prevScore + 0); // Adding zero, no change
    setFeedback(
      `Time's up! You scored 0/${maxScorePerAnswer} on this question.\n\nConsider providing more detailed and well-structured answers in future questions.`
    );
    setHasSubmittedAnswer(true); // Disable submission

    // Automatically move to next question after setting feedback
    // Add a short delay to allow user to read feedback
    setTimeout(() => {
      handleNextQuestion();
    }, 2000); // 2 seconds delay
  };

  // Start recording
  const handleStartRecording = async () => {
    await startRecording(setRecording);
  };

  // Stop recording
  const handleStopRecording = async () => {
    try {
      await stopRecording(
        recording,
        setRecordingURI,
        setTranscription,
        setLoadingTranscription
      );
      setTranscriptionError(false); // Reset error on success
    } catch (error) {
      setTranscriptionError(true); // Handle transcription errors
    }
    setRecording(null);
  };

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const handleSubmitAnswer = async () => {
    try {
      const answer =
        inputMethod === "voice" ? transcription.trim() : userAnswer.trim();

      if (!answer) {
        Alert.alert("No Answer", "Please provide an answer before submitting.");
        return;
      }

      if (recording) {
        await handleStopRecording();
      }

      clearTimer(); // Stop the timer when user submits

      const currentQ = interviewQuestions[currentQuestionIndex];
      const answerScore = calculateAnswerScore(
        answer,
        currentQ,
        maxScorePerAnswer
      );
      setTotalScore((prevScore) => prevScore + answerScore);

      const feedbackMessage = provideEfficientFeedback(answer, currentQ);

      // NEW: Analyze the emotion of the user's answer using IBM Watson
      let emotionFeedback = "";
      try {
        const emotionResult = await analyzeEmotion(answer);

        // Parse the response to extract tones
        const tones = emotionResult.document_tone.tones;

        if (tones.length > 0) {
          const toneDetails = tones
            .map(
              (tone) => `${tone.tone_name} (${(tone.score * 100).toFixed(1)}%)`
            )
            .join(", ");
          emotionFeedback = `The emotional tones detected in your response are: ${toneDetails}.`;
        } else {
          emotionFeedback =
            "No significant emotional tones were detected in your response.";
        }
      } catch (error) {
        emotionFeedback =
          "Could not analyze the emotional content of your response.";
      }

      // Append emotion feedback to the existing feedback
      setFeedback(
        `You scored ${answerScore}/${maxScorePerAnswer} on this question.\n\n${feedbackMessage}\n\n${emotionFeedback}`
      );

      setHasSubmittedAnswer(true); // Disable further submission
    } catch (error) {
      console.error("Error submitting answer:", error); // Log any errors
      Alert.alert("Error", "There was an error processing your answer.");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setTranscription("");
      setRecordingURI(null);
      setFeedback("");
      setHasSubmittedAnswer(false); // Reset submit state
    } else {
      const maxTotalScore = interviewQuestions.length * maxScorePerAnswer;
      let finalFeedback = `Your final score is ${totalScore}/${maxTotalScore}.\n`;

      if (totalScore > maxTotalScore * 0.8) {
        finalFeedback +=
          "Excellent performance! You gave well-rounded and strong answers throughout the interview.";
      } else if (totalScore > maxTotalScore * 0.6) {
        finalFeedback +=
          "Good job! There’s room for improvement in some areas, but you’re on the right track.";
      } else {
        finalFeedback +=
          "You can improve your performance by focusing on key topics and providing more detailed answers.";
      }

      Alert.alert("Interview Complete", finalFeedback, [
        { text: "OK", onPress: resetSelection },
      ]);
    }
  };

  const currentQuestion = interviewQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading question...</Text>
      </View>
    );
  }

  return (
    <View style={{ flexGrow: 1 }}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#292929' }]} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.Header}>

            <TouchableOpacity style={styles.backbutton} onPress={resetSelection}>
              <Ionicons name="arrow-back" size={30} color="#E5E5E5" />
            </TouchableOpacity>

            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.Headerchild}>N/A FOR NOW</Text>
            </View>
            {/* Placeholder to balance the back button */}
            <View style={{ width: 30 }} />
        </View>
  
          {/* ProgressBar and Question Card */}
          <ProgressBar
            progress={(currentQuestionIndex + 1) / interviewQuestions.length}
            color={"#2E7C81"}
            style={styles.progressBar}
          />
  
          <View style={styles.card}>
            <Text style={styles.title}>Questions:</Text>
            <Text style={styles.questionText}>
              {currentQuestion.question_text}
            </Text>
          </View>
  
          {/* Input Method Selector */}
          <View style={styles.inputMethodSelector}>
            <TouchableOpacity
              style={[
                styles.inputMethodButton,
                inputMethod === "voice" && styles.inputMethodButtonActive,
              ]}
              onPress={() => {
                setInputMethod("voice");
                if (recording) {
                  handleStopRecording();
                }
              }}
            >
              <MaterialCommunityIcons
                name="microphone"
                size={20}
                color={inputMethod === "voice" ? "#fff" : "#6DD5FA"}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.inputMethodButtonText,
                  inputMethod === "voice" && { color: "#fff" },
                ]}
              >
                Voice Recording
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.inputMethodButton,
                inputMethod === "text" && styles.inputMethodButtonActive,
              ]}
              onPress={() => {
                setInputMethod("text");
                if (recording) {
                  handleStopRecording();
                }
              }}
            >
              <MaterialCommunityIcons
                name="keyboard"
                size={20}
                color={inputMethod === "text" ? "#fff" : "#6DD5FA"}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.inputMethodButtonText,
                  inputMethod === "text" && { color: "#fff" },
                ]}
              >
                Text Input
              </Text>
            </TouchableOpacity>
          </View>
  
          {/* Conditionally Render Input Method */}
          {inputMethod === "voice" ? (
            <>
              <View style={styles.recordingSection}>
                <TouchableOpacity
                  style={[
                    styles.recordButton,
                    recording && styles.recordButtonActive,
                    loadingTranscription && styles.buttonDisabled,
                  ]}
                  onPress={() =>
                    recording ? handleStopRecording() : handleStartRecording()
                  }
                  disabled={loadingTranscription}
                >
                  <MaterialCommunityIcons
                    name={recording ? "stop-circle" : "microphone"}
                    size={24}
                    color="#fff"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.buttonText}>
                    {recording ? "Stop Recording" : "Start Recording"}
                  </Text>
                </TouchableOpacity>
  
                {recordingURI && (
                  <TouchableOpacity
                    style={[
                      styles.playButton,
                      (!recordingURI || loadingTranscription) &&
                        styles.buttonDisabled,
                    ]}
                    onPress={() => playRecording(recordingURI, sound, setSound)}
                    disabled={!recordingURI || loadingTranscription}
                  >
                    <MaterialCommunityIcons
                      name="play-circle"
                      size={24}
                      color="#fff"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.buttonText}>Play Recorded Answer</Text>
                  </TouchableOpacity>
                )}
              </View>
  
              {/* Timer */}
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                  Time Left: {formatTime(timeLeft)}
                </Text>
              </View>
  
              <View style={styles.inputCard}>
                {loadingTranscription ? (
                  <ActivityIndicator size="small" color={"#6DD5FA"} />
                ) : transcriptionError ? (
                  <Text style={{ color: "red" }}>
                    Transcription failed, please try again.
                  </Text>
                ) : (
                  <Text style={{ color: '#c1c1c1', textAlign: 'center' }}>
                    {transcription || "Transcription will appear here after recording."}
                  </Text>
                )}
              </View>
            </>
          ) : (
            <View style={styles.inputCard}>
              <TextInput
                style={styles.input}
                placeholder="Type your answer here..."
                placeholderTextColor={"#FFF"}
                value={userAnswer}
                onChangeText={setUserAnswer}
                multiline
              />
            </View>
          )}
  
          {feedback ? (
            <View style={styles.feedbackContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="information"
                  size={24}
                  color={"#fff"}
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.sectionTitle}>Feedback</Text>
              </View>
              <Text style={{ color: '#fff' }}>{feedback}</Text>
            </View>
          ) : null}
  
          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (hasSubmittedAnswer ||
                  (inputMethod === "voice" && !transcription) ||
                  (inputMethod === "text" && !userAnswer.trim())) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSubmitAnswer}
              disabled={
                hasSubmittedAnswer ||
                loadingTranscription ||
                (inputMethod === "voice" && !transcription) ||
                (inputMethod === "text" && !userAnswer.trim())
              }
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#fff"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.buttonText}>Submit Answer</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={[styles.nextButton, !feedback && styles.buttonDisabled]}
              onPress={handleNextQuestion}
              disabled={!feedback}
            >
              <MaterialCommunityIcons
                name={
                  currentQuestionIndex < interviewQuestions.length - 1
                    ? "arrow-right-circle"
                    : "flag-checkered"
                }
                size={24}
                color="#fff"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.buttonText}>
                {currentQuestionIndex < interviewQuestions.length - 1
                  ? "Next Question"
                  : "Finish"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      marginTop: -10,
    },
    scrollContent: {
      padding: 16,
    },
    selectionContainer: {
      flex: 1,
      backgroundColor: Colors.background,
      padding: 20,
      justifyContent: "center",
    },
    selectionSection: {
      marginBottom: 40, // Added space between sections for cleaner layout
    },
    // Text Styles
    title: {
      fontSize: 25,
      fontWeight: "bold",
      color: "#FFF",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFF",
      textAlign: "center",
      marginBottom: 10,
    },
    questionText: {
      fontSize: 18,
      color: "#FFF",
      marginBottom: 10
    },
    buttonText: {
      fontSize: 16,
      color: "#fff",
    },
    feedbackTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: Colors.primary, // Use primary color for title
      marginBottom: 10,
    },
    feedbackText: {
      fontSize: 16,
      color: Colors.text,
      lineHeight: 22, // Adjust line height for better readability
      textAlign: "left", // Left align text for a cleaner look
    },
  
    // Button Styles
    quitButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-end",
      backgroundColor: "#ff1744",
      padding: 10,
      borderRadius: 5,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    quitButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 5,
    },
    inputMethodSelector: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 20,
    },
    inputMethodButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      borderColor: '#1f1f1f',
      borderWidth: 1,
      alignItems: "center",
      marginHorizontal: 5,
      flexDirection: "row",
      justifyContent: "center",
    },
    inputMethodButtonActive: {
      backgroundColor: "#2E7C81",
    },
    inputMethodButtonText: {
      fontSize: 16,
      color: '#fff',
    },
    recordButton: {
      flexDirection: "row",
      backgroundColor: "#2E7C81",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 5,
    },
    recordButtonActive: {
      backgroundColor: "#2E7C81",
    },
    playButton: {
      flexDirection: "row",
      backgroundColor:"#2E7C81",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 5,
    },
    buttonDisabled: {
      backgroundColor: "#1F1F1F",
    },
    submitButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#2E7C81",
      padding: 10,
      borderRadius: 8,
      flex: 1,
      marginRight: 5,
      justifyContent: "center",
    },
    nextButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: '#2E7C81',
      padding: 10,
      borderRadius: 8,
      flex: 1,
      marginLeft: 5,
      justifyContent: "center",
    },
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },
  
    // Card Styles
    card: {
      backgroundColor: "#1F1F1F",
      padding: 15,
      borderRadius: 5,
      marginBottom: 20,
      elevation: 3, // For slight shadow on Android
      shadowColor: "#000", // Slight shadow on iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    inputCard: {
      backgroundColor: "#1F1F1F",
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    feedbackContainer: {
      backgroundColor: "#1F1F1F", // Light background for feedback section
      padding: 15,
      borderRadius: 10, // Rounded corners for smoother appearance
      marginVertical: 20,
      borderColor: '#fff', // Optional border to highlight feedback area
      borderWidth: 1,
      marginTop: -5,
    },
  
    // Input Styles
    input: {
      height: 100,
      borderColor: "#fff",
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      textAlignVertical: "top",
      color: "#fff",
    },
  
    // Progress Bar
    progressBar: {
      height: 10,
      borderRadius: 5,
      marginVertical: 10,
    },
  
    // Timer Styles
    timerContainer: {
      marginVertical: 10,
      alignItems: "center",
    },
    timerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
    },
  
    // Recording Section
    recordingSection: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 16,
    },
  
    // Emotion Feedback Styles (if needed)
    emotionFeedback: {
      fontSize: 16,
      color: Colors.text,
      marginTop: 10,
    },

    backbutton: {
      margin: 3,
      marginTop: 40,
    },
    Header: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    Headerchild: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      alignContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
      marginTop: 45,
    },
});
export default InterviewScreen;
