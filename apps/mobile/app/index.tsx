import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { useFirstLaunch } from '../hooks/useFirstLaunch';

const { width } = Dimensions.get('window');

// ─── Animated Calculator Card ───────────────────────────────────────────────

interface CardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  title: string;
  subtitle: string;
  tags: string[];
  onPress: () => void;
  delay: number;
}

function AnimatedCard({ icon, iconBg, title, subtitle, tags, onPress, delay }: CardProps) {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {/* Left accent bar */}
        <View style={[styles.cardAccent, { backgroundColor: iconBg }]} />

        <View style={styles.cardInner}>
          {/* Icon bubble */}
          <View style={[styles.iconBubble, { backgroundColor: iconBg + '22' }]}>
            <Ionicons name={icon} size={28} color={iconBg} />
          </View>

          {/* Text */}
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
            {/* Tags */}
            <View style={styles.tagRow}>
              {tags.map((tag) => (
                <View key={tag} style={[styles.tag, { borderColor: iconBg + '55' }]}>
                  <Text style={[styles.tagText, { color: iconBg }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Arrow */}
          <View style={[styles.arrowCircle, { backgroundColor: iconBg + '15' }]}>
            <Ionicons name="arrow-forward" size={16} color={iconBg} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Home Screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { isFirstLaunch } = useFirstLaunch();

  // Logo pulse animation
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFirstLaunch === true) {
      router.push('/disclaimer');
    }
  }, [isFirstLaunch]);

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Gentle continuous pulse on the logo
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Section ── */}
        <LinearGradient
          colors={[Colors.heroGradientTop, Colors.heroGradientBottom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Info button top-right */}
          <TouchableOpacity
            style={styles.infoBtn}
            onPress={() => router.push('/about')}
            accessibilityLabel="About and References"
          >
            <Ionicons name="information-circle-outline" size={26} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>

          {/* Decorative circles */}
          <View style={styles.decCircle1} />
          <View style={styles.decCircle2} />

          {/* Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              { opacity: logoOpacity, transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }] },
            ]}
          >
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Tagline */}
          <Animated.View style={{ opacity: logoOpacity }}>
            <Text style={styles.tagline}>Liver Health Assessment. Simplified.</Text>
            <Text style={styles.taglineSub}>
              MELD · Child-Pugh · FibroScan · Enzymes
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* ── Section: Severity Scoring ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Severity Scoring</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.cards}>
          <AnimatedCard
            icon="calculator"
            iconBg={Colors.brandBlue}
            title="MELD Score"
            subtitle="Predict 3-month mortality & transplant priority"
            tags={['MELD', 'MELD-Na', 'MELD 3.0']}
            onPress={() => router.push('/(calculators)/meld')}
            delay={150}
          />

          <AnimatedCard
            icon="stats-chart"
            iconBg={Colors.brandMid}
            title="Child-Pugh Score"
            subtitle="Classify cirrhosis severity and surgical risk"
            tags={['Class A', 'Class B', 'Class C']}
            onPress={() => router.push('/(calculators)/child-pugh')}
            delay={250}
          />
        </View>

        {/* ── Section: Assessment Tools ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assessment Tools</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.cards}>
          <AnimatedCard
            icon="pulse-outline"
            iconBg="#F59E0B"
            title="FibroScan Interpreter"
            subtitle="Understand liver stiffness and fat scores"
            tags={['F0–F4', 'S0–S3', 'kPa']}
            onPress={() => router.push('/(calculators)/fibroscan')}
            delay={350}
          />

          <AnimatedCard
            icon="flask-outline"
            iconBg="#10B981"
            title="Liver Enzyme Checker"
            subtitle="Check ALT, AST, GGT, ALP, bilirubin levels"
            tags={['Traffic Light', 'Pattern Recognition']}
            onPress={() => router.push('/(calculators)/liver-enzymes')}
            delay={450}
          />
        </View>

        {/* ── Section: More ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.cards}>
          <AnimatedCard
            icon="book-outline"
            iconBg={Colors.brandNavy}
            title="About & References"
            subtitle="Formulas, citations, and methodology"
            tags={['OSF · GitHub', 'Citations']}
            onPress={() => router.push('/about')}
            delay={550}
          />
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <TouchableOpacity
            onPress={() => router.push('/disclaimer')}
            accessibilityRole="button"
          >
            <Text style={styles.footerCredit}>
              Developed by <Text style={styles.footerName}>Dr. Jyotsna Priyam</Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerDisclaimer}>
            For educational purposes only · Not medical advice
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPage,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },

  // Hero
  hero: {
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  infoBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    padding: 4,
    zIndex: 10,
  },
  decCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -60,
  },
  decCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -40,
    left: -40,
  },
  logoContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  logo: {
    width: width * 0.62,
    height: width * 0.62,
  },
  tagline: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  taglineSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.5,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    marginTop: 28,
    marginBottom: 4,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  // Cards
  cards: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: Colors.brandNavy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardAccent: {
    width: 4,
    borderRadius: 4,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.screenPadding,
    marginTop: 32,
  },
  footerDivider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 8,
  },
  footerCredit: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footerName: {
    fontWeight: '700',
    color: Colors.brandMid,
  },
  footerDisclaimer: {
    fontSize: 11,
    color: Colors.textDisabled,
    textAlign: 'center',
  },
});
