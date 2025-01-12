import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResultScreen({ result, onRetry }) {
    const router = useRouter();
    const fadeAnim = new Animated.Value(0); // Initial opacity: 0

    // Fade in animation when the result screen is shown
    Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
    }).start();

    const exit = () => {
        router.replace('./../../(tabs)/dashboard');
    };

    return (
        <View style={{ flex: 1 }}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#292929' }]} />

        <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
            <Ionicons name="trophy" size={80} color="gold" />
            <Text style={styles.resultText}>Congratulations!</Text>
            <Text style={styles.categoryText}>
            You are best suited for: <Text style={styles.highlight}>{result}</Text>
            </Text>

            <TouchableOpacity style={styles.retryButton} onPress={exit}>
            <Text style={styles.retryButtonText}>Goodluck!</Text>
            </TouchableOpacity>
        </Animated.View>
        </View>
    );
    }

    const styles = StyleSheet.create({
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    resultText: {
        fontSize: 30,
        color: 'white',
        marginBottom: 20,
        fontFamily: 'quicksand',
    },
    categoryText: {
        fontSize: 20,
        color: '#E5E5E5',
        textAlign: 'center',
        marginBottom: 30,
    },
    highlight: {
        color: 'gold', // Golden color for highlighting the result
        fontWeight: 'bold',
        fontSize: 22,
    },
    retryButton: {
        backgroundColor: '#2E7C81',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    retryButtonText: {
        color: 'white',
        fontSize: 18,
    },
    });
