import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GradientButton } from '../components/ui/GradientButton';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { useFirstLaunch } from '../hooks/useFirstLaunch';

export default function DisclaimerScreen() {
  const router = useRouter();
  const { acceptDisclaimer } = useFirstLaunch();

  const handleAccept = async () => {
    await acceptDisclaimer();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>MEDICAL DISCLAIMER</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.body}>
            This application is designed for educational and informational purposes only. It is not
            intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </Text>

          <View style={styles.bulletList}>
            <BulletItem>
              MELD and Child-Pugh scores calculated by this app are approximations based on
              published formulas and should NOT be used for official transplant listing decisions.
            </BulletItem>

            <BulletItem>
              Official MELD scores for transplant allocation are calculated by UNOS/OPTN using
              verified laboratory values.
            </BulletItem>

            <BulletItem>
              Always consult your hepatologist, transplant team, or qualified healthcare provider
              for clinical decisions.
            </BulletItem>

            <BulletItem>
              Do not disregard professional medical advice or delay seeking treatment because of
              information provided by this app.
            </BulletItem>
          </View>

          <Text style={styles.attribution}>
            This tool was developed by Dr. Jyotsna Priyam and is part of the LiverTracker platform
            (livertracker.com).
          </Text>
        </View>

        <GradientButton
          title="I Understand"
          onPress={handleAccept}
          style={styles.button}
        />

        <Text style={styles.footnote}>
          This disclaimer is also accessible from the About screen at any time.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <View style={bulletStyles.row}>
      <Text style={bulletStyles.bullet}>•</Text>
      <Text style={bulletStyles.text}>{children}</Text>
    </View>
  );
}

const bulletStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  text: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 24,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPage,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.screenPadding,
    gap: Spacing.sectionGap,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
  },
  title: {
    ...Typography.sectionHeader,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.cardPadding,
    gap: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.brandBlue,
  },
  body: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  bulletList: {
    gap: 12,
  },
  attribution: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  button: {
    width: '100%',
  },
  footnote: {
    ...Typography.helperText,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
