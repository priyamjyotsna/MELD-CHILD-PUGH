import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface ScoreRingProps {
  score: number;
  minScore: number;
  maxScore: number;
  formula: string;
  severityColor: string;
  subtitle?: string;
}

const RING_SIZE = 200;
const STROKE_WIDTH = 16;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Arc spans 270 degrees (from 135° to 405°, i.e., bottom-left to bottom-right)
const ARC_DEGREES = 270;
const ARC_LENGTH = (ARC_DEGREES / 360) * CIRCUMFERENCE;

export function ScoreRing({
  score,
  minScore,
  maxScore,
  formula,
  severityColor,
  subtitle,
}: ScoreRingProps) {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const progress = (score - minScore) / (maxScore - minScore);

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [ARC_LENGTH, 0],
  });

  // Rotation: start arc at bottom-left (135 degrees from top)
  const rotation = 135;

  return (
    <View style={styles.container}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: `${rotation}deg` }] }}>
        <Defs>
          <SvgLinearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={Colors.normal} />
            <Stop offset="40%" stopColor={Colors.moderate} />
            <Stop offset="75%" stopColor={Colors.severe} />
            <Stop offset="100%" stopColor={Colors.critical} />
          </SvgLinearGradient>
        </Defs>

        {/* Background track */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke={Colors.border}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
        />

        {/* Animated fill arc */}
        <AnimatedCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke={severityColor}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent} pointerEvents="none">
        <Text
          style={styles.scoreText}
          accessibilityLabel={`Score: ${score}`}
        >
          {score}
        </Text>
        <Text style={styles.formulaText}>{formula}</Text>
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  scoreText: {
    ...Typography.scoreDisplay,
    color: Colors.textPrimary,
  },
  formulaText: {
    ...Typography.scoreLabel,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
