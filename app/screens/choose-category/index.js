import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { get, ref, update } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { quizData } from './../../../components/quiz';
import { auth, db } from './../../../configs/FirebaseConfig';

const badgeImages = {
    'Newbie Badge': require('./../../../assets/images/badges/newbie.png'),
    'Intermediate Badge': require('./../../../assets/images/badges/intermediate.png'),
    'Advanced Badge': require('./../../../assets/images/badges/advanced.png'),
    'Expert Badge': require('./../../../assets/images/badges/expert.png'),
};

export default function ChooseCategory() {
    const router = useRouter();
    const categories = Object.keys(quizData);
    const [userProgress, setUserProgress] = useState({});
    const [userBadges, setUserBadges] = useState([]);
    const [userLevel, setUserLevel] = useState(1);
    const [totalPoints, setTotalPoints] = useState(0); // Track total points
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [leaderboardModalVisible, setLeaderboardModalVisible] = useState(false);
    const [topContributors, setTopContributors] = useState([]);

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        loadUserProgress();
        loadUserBadgesAndLevel();
    }, []);

    const fetchLeaderboardData = async () => {
        try {
            const usersSnapshot = await get(ref(db, 'users'));
            const usersData = usersSnapshot.val();

            const leaderboard = Object.keys(usersData).map((userId) => {
                const user = usersData[userId];
                const profile = user.profile || {};
                return {
                    userId,
                    userName: user.userName,
                    profilePicture: user.profilePicture || 'https://example.com/default-profile.png',
                    level: calculateLevel(user.quizProgress),  // Calculate the level based on quiz progress or points
                    badges: profile.badges || [],
                };
            });

            const sortedLeaderboard = leaderboard.sort((a, b) => b.level - a.level).slice(0, 10);
            setTopContributors(sortedLeaderboard);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    };

    const calculateLevel = (quizProgress) => {
        if (!quizProgress) return 1; // Default to level 1 if no quiz progress
        const totalPoints = Object.values(quizProgress).reduce((acc, progress) => acc + (progress.score || 0), 0);
        return Math.floor(totalPoints / 100) + 1;  // Example: 100 points per level
    };

    const handleLeaderboardPress = async () => {
        await fetchLeaderboardData();
        setLeaderboardModalVisible(true);
    };

    // Load user's quiz progress from Firebase Database
    const loadUserProgress = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const quizProgressRef = ref(db, `users/${user.uid}/quizProgress`);
                const snapshot = await get(quizProgressRef);
                if (snapshot.exists()) {
                    const progressData = snapshot.val();
                    setUserProgress(progressData);

                    // Calculate total points
                    const points = Object.keys(progressData).reduce((acc, category) => {
                        return acc + (progressData[category].score || 0);
                    }, 0);
                    setTotalPoints(points);

                    // Calculate and set user level based on total points
                    const newLevel = Math.floor(points / 100) + 1; // Example: 100 points per level
                    setUserLevel(newLevel);

                    // Update badges based on level
                    const earnedBadges = calculateBadges(newLevel);
                    setUserBadges(earnedBadges);

                    // Save earned badges to database
                    await update(ref(db, `users/${user.uid}/profile`), { badges: earnedBadges });
                }
            }
        } catch (error) {
            console.log("Error loading user progress: ", error);
        }
    };

    // Load user's badges and level from Firebase
    const loadUserBadgesAndLevel = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userRef = ref(db, `users/${user.uid}/profile`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const { badges } = snapshot.val();
                    setUserBadges(badges || []);
                }
            }
        } catch (error) {
            console.log("Error loading user badges: ", error);
        }
    };

    // Determine the badges earned based on user level
    const calculateBadges = (level) => {
        const earnedBadges = [];
        if (level >= 1) earnedBadges.push({ name: 'Newbie Badge', image: badgeImages['Newbie Badge'] });
        if (level >= 5) earnedBadges.push({ name: 'Intermediate Badge', image: badgeImages['Intermediate Badge'] });
        if (level >= 10) earnedBadges.push({ name: 'Advanced Badge', image: badgeImages['Advanced Badge'] });
        if (level >= 20) earnedBadges.push({ name: 'Expert Badge', image: badgeImages['Expert Badge'] });
        return earnedBadges;
    };

    const handleCategorySelect = (category) => {
        router.push({
            pathname: './../knowledge-quiz',
            params: { category },
        });
    };

    const BackPress = () => {
        router.replace('./../../(tabs)/dashboard');
    };

    // Get the progress percentage for a category
    const getProgressPercentage = (category) => {
        if (userProgress[category]) {
            const { currentQuestionIndex } = userProgress[category];
            const totalQuestions = quizData[category].questions.length;
            const progress = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
            return userProgress[category].completed ? 100 : progress;
        }
        return 0; // Default to 0 if no progress
    };

    // Check if the user completed the quiz for a category
    const isCategoryCompleted = (category) => {
        return userProgress[category]?.completed || false;
    };

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);  // Show the loading spinner
        loadUserProgress().then(() => {
            setIsRefreshing(false);  // Hide the spinner when the data is fetched
        });
    }, []);

    return (
        <View style={{ flexGrow: 1 }}>
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#292929' }]} />
                <View style={styles.maintitle}>
                <TouchableOpacity style={styles.backbutton} onPress={BackPress}>
                    <Ionicons name="arrow-back" size={30} color="#E5E5E5" />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.maintitleText}>Choose Quiz Category</Text>
                </View>
                 {/* Placeholder to balance the back button */}
                <View style={{ width: 30 }} />
            </View>

            {/* User's Level and Badges */}
            <View style={styles.userInfoContainer}>
                <View style={styles.LPL}>
                <Text style={styles.userLevel}>
                Level: {userLevel} │ <Text style={styles.totalPointsYellow}>{totalPoints}</Text> Points
                </Text>
                <TouchableOpacity style={styles.icon} onPress={handleLeaderboardPress}>
                            <Ionicons name="trophy-outline" size={28} color="gold" />
                        </TouchableOpacity>
                        
                            {/* Leaderboard Modal */}
                            <Modal
                                visible={leaderboardModalVisible}
                                transparent={true}
                                animationType="slide"
                                onRequestClose={() => setLeaderboardModalVisible(false)}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalTitle}>Leaderboard</Text>
                                        <ScrollView contentContainerStyle={styles.leaderboardScrollView}>
                                            {topContributors.slice(0, 5).map((contributor, index) => {
                                                let icon = null;
                                                let color = 'black';
                                                if (index === 0) {
                                                    icon = <FontAwesome5 name="medal" size={24} color="gold" />;
                                                    color = 'gold';
                                                } else if (index === 1) {
                                                    icon = <FontAwesome5 name="medal" size={24} color="silver" />;
                                                    color = 'silver';
                                                } else if (index === 2) {
                                                    icon = <FontAwesome5 name="medal" size={24} color="#cd7f32" />;
                                                    color = '#cd7f32';
                                                } else {
                                                    icon = <FontAwesome5 name="medal" size={24} color="#000" />;
                                                }

                                                return (
                                                    <View key={index} style={styles.leaderboardItemContainer}>
                                                        <View style={styles.leaderboardItem}>
                                                            {/* Rank and Icon */}
                                                            <View style={styles.rankContainer}>
                                                                <Text style={[styles.rankNumber, { color }]}>Top {index + 1}</Text>
                                                                {icon}
                                                            </View>

                                                            {/* Profile and Info */}
                                                            <View style={styles.profileInfoContainer}>
                                                                <Image
                                                                    source={{ uri: contributor.profilePicture }}
                                                                    style={styles.profilePicture}
                                                                />
                                                                <View style={styles.userInfo}>
                                                                    <Text style={styles.userName}>{contributor.userName}</Text>
                                                                    <Text style={styles.userLevelLeaderboard}>
                                                                        Level: {contributor.level}
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                            {/* Badges Section */}
                                                            <View style={styles.badgesContainer}>
                                                                {contributor.badges.length > 0 ? (
                                                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                                        {contributor.badges.map((badge, badgeIndex) => (
                                                                            <Image
                                                                                key={badgeIndex}
                                                                                source={badgeImages[badge.name]}
                                                                                style={styles.badgeImageLeaderbord}
                                                                            />
                                                                        ))}
                                                                    </ScrollView>
                                                                ) : (
                                                                    <Text style={styles.noBadgesText}>No badges yet</Text>
                                                                )}
                                                            </View>
                                                        </View>

                                                        <View style={styles.separatorLine} />
                                                    </View>
                                                );
                                            })}
                                        </ScrollView>

                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => setLeaderboardModalVisible(false)}
                                        >
                                            <Text style={styles.closeButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>

                        </View>
                        <Text style={styles.totalPoints}>Earned Badges:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {userBadges.length > 0 ? (
                            userBadges.map((badge, index) => (
                                <View key={index} style={styles.badgeContainer}>
                                    <Image
                                        source={badge.image}  // Load the correct local image
                                        style={styles.badgeImage}
                                    />
                                    <Text style={styles.badgeText}>{badge.name}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noBadgesText}>No badges earned yet.</Text>
                        )}
                        </ScrollView>
                    </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={['#3498DB']}
                    />
                }
                contentContainerStyle={styles.scrollContainer}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.categoryButton}
                        onPress={() => handleCategorySelect(category)}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={styles.categoryText}>{quizData[category].title}</Text>
                            <Text style={styles.averagePoints}>
                                Average points: {userProgress[category]?.score || 0} points
                            </Text>
                            {isCategoryCompleted(category) && (
                                <Text style={styles.completedText}>Quiz Completed</Text>
                            )}

                            {/* Progress Bar for each quiz */}
                            <View style={styles.progressBarContainer}>
                                <View style={[styles.progressBar, { width: `${getProgressPercentage(category)}%` }]} />
                                <Text style={styles.progressText}>
                                    {getProgressPercentage(category)}%
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={23} color="#fff" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    maintitle: {
        marginBottom: 5,
        marginVertical: 40,
        margin: 15,
        alignItems: 'center',
        flexDirection: 'row'
    },
    maintitleText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'quicksand'
    },
    scrollContainer: {
        paddingBottom: '100%', // adds some padding at the bottom
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    categoryButton: {
        backgroundColor: '#1F1F1F',
        padding: 15,
        borderRadius: 8,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryText: {
        color: '#fff',
        fontSize: 18,
    },
    averagePoints: {
        color: '#ccc',
        fontSize: 14,
    },
    completedText: {
        color: '#00ff00',
        fontSize: 14,
        fontStyle: 'italic',
    },
    backbutton: {
    },
    progressBarContainer: {
        height: 20,
        backgroundColor: '#c1c1c1',
        borderRadius: 5,
        marginTop: 10,
        position: 'relative',
        justifyContent: 'center',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    progressText: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: 14,
        color: '#fff',
    },
    userInfoContainer: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    userLevel: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 10,
    },
    totalPoints: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 5
    },
    badgeImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 5,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
    },
    noBadgesText: {
        color: '#ccc',
        fontSize: 14,
        fontStyle: 'italic',
    },
    leaderboardButton: {
        backgroundColor: '#3498DB',
        marginHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    leaderboardButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    totalPointsYellow: {
        color: 'yellow',
    },
    LPL: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: -10,
    },
    icon: {
        marginBottom: 10,
        margin: 15
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '70%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    leaderboardScrollView: {
        width: '100%',
    },
    leaderboardItem: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    rankText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    profileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        flexDirection: 'column',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userLevelLeaderbord: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    },
    badgesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    badgeImageLeaderbord: {
        width: 30,
        height: 30,
        marginHorizontal: 2,
    },
    closeButton: {
        backgroundColor: '#2E7C81',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    leaderboardItemContainer: {
        marginVertical: 5,
    },
    separatorLine: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    rankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // Align icons to the right
        marginRight: 10,
    },
    
});
