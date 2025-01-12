import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { get, ref, set, update } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { quizData } from './../../../components/quiz';
import { auth, db } from './../../../configs/FirebaseConfig';

const screenWidth = Dimensions.get('window').width;

const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
    };

export default function Quiz() {
    const router = useRouter();
    const navigation = useNavigation();
    const route = useRoute();
    const { category } = route.params;
    const categoryData = quizData[category] || quizData.technical;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [timer, setTimer] = useState(15);
    const [feedback, setFeedback] = useState('');
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState(categoryData.questions);
    const [showAlert, setShowAlert] = useState(false);
    const intervalRef = useRef(null);
    const [isAdmin, setIsAdmin] = useState(false);

    //const [totalTimeSpent, setTotalTimeSpent] = useState(0);

    // Set the progress to 100% if the quiz is completed
    const progressPercentage = showResults || quizCompleted ? 100 : ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

    const performanceData = [
        { name: 'Correct', score: score, color: '#4caf50', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Incorrect', score: (shuffledQuestions.length * 5) - score, color: '#f44336', legendFontColor: '#7F7F7F', legendFontSize: 15 }
    ];

    //const calculateBarChartData = () => {
        // Accuracy: Based on correct answers
        //const accuracy = (score / (shuffledQuestions.length * 5)) * 100;

        // Time Efficiency: Based on total time spent
        //const maxAllowedTime = shuffledQuestions.length * 15; // Assuming 15 seconds per question
        //const timeEfficiency = ((maxAllowedTime - totalTimeSpent) / maxAllowedTime) * 100;

        // Completion Rate: Always 100% if quiz is completed
        //const completionRate = 100;

        // Return bar chart data
       // return {
           // labels: ['Accuracy', 'Time Efficiency', 'Completion'],
            //datasets: [
               // {
                //    data: [accuracy, Math.max(0, timeEfficiency), completionRate], // Ensuring no negative value for timeEfficiency
                //},
            //],
        //};
    //};

    useEffect(() => {
        loadQuizProgress();
    }, []);

    useEffect(() => {
        if (timer > 0 && !showResults && !isAnswered) {
            intervalRef.current = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timer === 0 && !showResults) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                handleNextQuestion();
            }, 1000);
        }

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [timer, showResults, isAnswered]);

    const shuffleQuestionsAndChoices = () => {
        // Shuffle the questions
        const shuffledQns = shuffleArray([...categoryData.questions]);

        // Shuffle the choices within each question
        const shuffledQuestionsWithChoices = shuffledQns.map(question => {
            return {
                ...question,
                options: shuffleArray([...question.options])
            };
        });

        setShuffledQuestions(shuffledQuestionsWithChoices);
    };


    const handleAnswerSelect = (option) => {
        setSelectedAnswer(option);
        setIsAnswered(true);
        clearInterval(intervalRef.current);

        const currentQuestion = shuffledQuestions[currentQuestionIndex];

        if (option === currentQuestion.correctAnswer) {
            setScore(score + 5);
            setFeedback("Correct! " + currentQuestion.explanation);
        } else {
            setFeedback(`Incorrect! The correct answer is "${currentQuestion.correctAnswer}". ${currentQuestion.explanation}`);
        }

        saveQuizProgress(); // Save progress after selecting an answer
    };

    const handleNextQuestion = async () => {
        clearInterval(intervalRef.current);
        setFeedback('');
        if (currentQuestionIndex + 1 < shuffledQuestions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setTimer(15); // Reset timer
        } else {
            setShowResults(true);
            setQuizCompleted(true);
            saveQuizProgress(true);
            await updateQuizProgress(category, score);
        }
    };

    const updateQuizProgress = async (category, score) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = ref(db, `users/${user.uid}/quizProgress/${category}`);

                // Save quiz progress for the specific category
                await set(userRef, {
                    completed: true,
                    score: score,
                });
            }
        } catch (error) {
            console.error('Error updating quiz progress:', error);
        }
    };

    const handleRestartQuiz = () => {
        shuffleQuestionsAndChoices();
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowResults(false);
        setFeedback('');
        setTimer(15);
        setQuizCompleted(false);

        clearQuizProgress(); // Clear quiz progress
    };

    const BackPress = () => {
        saveQuizProgress(); // Save progress before going back
        router.replace('./../choose-category');
    };

    const saveQuizProgress = async (completed = false) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const quizProgressRef = ref(db, `users/${user.uid}/quizProgress/${category}`);
                await update(quizProgressRef, {
                    currentQuestionIndex,
                    score,
                    timer,
                    selectedAnswer,
                    completed: completed || quizCompleted,
                });
            }
        } catch (error) {
            console.error('Error saving quiz progress:', error);
        }
    };

    const loadQuizProgress = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const quizProgressRef = ref(db, `users/${user.uid}/quizProgress/${category}`);
                const snapshot = await get(quizProgressRef);
                if (snapshot.exists()) {
                    const progressData = snapshot.val();
                    if (progressData.completed) {
                        setShowResults(true); // Show quiz completed screen
                        setScore(progressData.score || 0); // Load the score
                        setQuizCompleted(true); // Set quiz as completed
                    } else {
                        setCurrentQuestionIndex(progressData.currentQuestionIndex || 0);
                        setScore(progressData.score || 0);
                        setTimer(progressData.timer || 15);
                        setSelectedAnswer(progressData.selectedAnswer || null);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading quiz progress:', error);
        }
    };

    const clearQuizProgress = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const quizProgressRef = ref(db, `users/${user.uid}/quizProgress/${category}`);
                await set(quizProgressRef, null); // Clear progress after restarting the quiz
            }
        } catch (error) {
            console.error('Error clearing quiz progress:', error);
        }
    };

    return (
        <View style={{ flexGrow: 1 }}>
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#292929' }]} />

            {showAlert && (
                        <View style={styles.alertContainer}>
                            <Text style={styles.alertText}>Time's Up!</Text>
                        </View>
                    )}

            <View style={styles.maintitle}>
                <TouchableOpacity style={styles.backbutton} onPress={BackPress}>
                    <Ionicons name="arrow-back" size={27} color="#E5E5E5" />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.maintitleText}>{categoryData.title}</Text>
                </View>
                 {/* Placeholder to balance the back button */}
                <View style={{ width: 30 }} />
            </View>

            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {!showResults ? (
                    <>
                        <View style={styles.timerContainer}>
                        <Text style={styles.timer}>
                            Time left: <Text style={{ color: 'yellow' }}>{timer} seconds</Text>
                        </Text>
                        </View>
                        <Text style={styles.question}>
                            {shuffledQuestions[currentQuestionIndex].question}
                        </Text>
                        {shuffledQuestions[currentQuestionIndex].options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    {
                                        backgroundColor:
                                            selectedAnswer === option
                                                ? option === shuffledQuestions[currentQuestionIndex].correctAnswer
                                                    ? '#4CAF50'
                                                    : 'red'
                                                : option === shuffledQuestions[currentQuestionIndex].correctAnswer && isAnswered
                                                    ? '#4CAF50'
                                                    : '#1F1F1F'
                                    }
                                ]}
                                onPress={() => handleAnswerSelect(option)}
                                disabled={isAnswered}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}

                        {isAnswered && (
                        <>
                            <Text style={styles.feedback}>{feedback}</Text>
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={handleNextQuestion}
                            >
                                <Text style={styles.nextButtonText}>Next</Text>
                            </TouchableOpacity>
                        </>
                        )}
                    </>
                ) : (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultText}>Quiz Completed!</Text>
                        <Text style={[styles.resultText, styles.yellowText]}>Total points: {score} </Text>

                        <PieChart
                            data={performanceData}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#000',
                                backgroundGradientFrom: '#434343',
                                backgroundGradientTo: '#000',
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                propsForLabels: {
                                    fontSize: '15',
                                    fontWeight: 'bold',
                                },
                                strokeWidth: 2, // Make the border modern
                            }}
                            accessor={'score'}
                            backgroundColor={'transparent'}
                            paddingLeft={'15'}
                            absolute
                        />

                        {/*
                        <Text style={styles.subHeader}>Performance Metrics</Text>
                        <BarChart
                            data={calculateBarChartData()}
                            width={screenWidth - 40}
                            height={230}
                            chartConfig={{
                                backgroundColor: '#000',
                                backgroundGradientFrom: '#1c1c1c',
                                backgroundGradientTo: '#434343',
                                decimalPlaces: 0,
                                barPercentage: 0.5, // Modern bar sizing
                                propsForBackgroundLines: {
                                    strokeDasharray: '', // No dashed lines
                                    strokeWidth: 0, // No background lines
                                },
                                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                                fillShadowGradient: '#F76B1C', // Gradient for bar fill
                                fillShadowGradientOpacity: 1,
                                propsForLabels: {
                                    fontSize: '15',
                                    fontWeight: 'bold',
                                },
                            }}
                            style={{
                                marginVertical: 10,
                                borderRadius: 16, // Rounded edges
                            }}
                        />
                        */}

                        <TouchableOpacity style={styles.restartButton} onPress={handleRestartQuiz}>
                            <Text style={styles.restartButtonText}>Restart Quiz</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    maintitle: {
        marginBottom: 20,
        marginVertical: 50,
        margin: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    maintitleText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'quicksand'
    },
    backbutton: {
    },
    scrollContainer: {
        paddingBottom: '100%', // adds some padding at the bottom
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    question: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: '#1F1F1F',
        padding: 15,
        borderRadius: 8,
        marginVertical: 8,
    },
    optionText: {
        color: '#fff',
        fontSize: 16,
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginTop: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    resultsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultText: {
        fontSize: 24,
        color: '#fff',
    },
    yellowText: {
        color: 'yellow',
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    timer: {
        fontSize: 18,
        color: '#fff',
    },
    restartButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        marginTop: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    restartButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    feedback: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        marginHorizontal: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    subHeader: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginVertical: 20,
    },
    alertContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#f44336',
        zIndex: 10, // Ensure it's on top of everything
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
