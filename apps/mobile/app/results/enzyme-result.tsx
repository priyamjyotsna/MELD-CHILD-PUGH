import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { LiverEnzymeResult } from '@livertracker/clinical-scores';
import { SeverityBanner } from '../../components/results/SeverityBanner';
import { TrafficLightRow } from '../../components/results/TrafficLightRow';
import { InjuryPatternCard } from '../../components/results/InjuryPatternCard';
import { CitationFooter } from '../../components/results/CitationFooter';
import { ActionFooter } from '../../components/results/ActionFooter';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Shadow, Spacing } from '../../constants/spacing';

const BANNER_LABELS: Record<string, string> = {
  normal: 'Your Liver Enzymes Are Normal',
  borderline: 'Some Enzymes Are Borderline',
  elevated: 'Some Enzymes Are Elevated',
  significantly_elevated: 'Significantly Elevated Enzymes Detected',
};

export default function EnzymeResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ result: string }>();
  const result: LiverEnzymeResult = JSON.parse(params.result);

  const handleShare = async () => {
    const lines = [
      'Liver Enzyme Report — LiverTracker Tools',
      '',
      ...result.enzymes.map((e) => `${e.name}: ${e.value} ${e.unit} (${e.statusLabel})`),
      '',
      `Overall: ${result.overallStatusLabel}`,
      result.injuryPattern !== 'insufficient_data' ? `Injury Pattern: ${result.injuryPatternLabel}` : '',
      result.astAltRatio ? `AST/ALT Ratio: ${result.astAltRatio}` : '',
      '',
      'Disclaimer: For educational purposes only. Consult your hepatologist.',
      'Calculated by LiverTracker Tools · Developed by Dr. Jyotsna Priyam',
    ].filter(Boolean);

    await Share.share({ message: lines.join('\n'), title: 'Liver Enzyme Report' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Enzyme Results</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close-circle" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Layer 1 — Overall Status Banner */}
        <SeverityBanner
          label={BANNER_LABELS[result.overallStatus] ?? result.overallStatusLabel}
          color={result.overallStatusColor}
        />

        {/* Layer 2 — Traffic Light Grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Individual Results</Text>
          {result.enzymes.map((enzyme, i) => (
            <TrafficLightRow key={enzyme.name} enzyme={enzyme} delay={i * 100} />
          ))}
        </View>

        {/* Layer 3 — Injury Pattern */}
        {result.injuryPattern !== 'insufficient_data' && (
          <InjuryPatternCard
            pattern={result.injuryPattern}
            patternLabel={result.injuryPatternLabel}
            explanation={result.injuryPatternExplanation}
            rRatio={result.rRatio}
            astAltRatio={result.astAltRatio}
            astAltRatioInterpretation={result.astAltRatioInterpretation}
          />
        )}

        {/* Layer 4 — Recommendations */}
        {result.recommendations.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recommendations</Text>
            {result.recommendations.map((rec, i) => (
              <View key={i} style={styles.recRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.brandBlue} />
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Layer 5 — Clinical Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text style={styles.summary}>{result.clinicalSummary}</Text>
        </View>

        <ActionFooter onShare={handleShare} />
        <CitationFooter references={result.references} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundPage },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  closeBtn: { padding: 4 },
  scroll: { flex: 1 },
  content: { padding: Spacing.screenPadding, gap: Spacing.sectionGap, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.backgroundCard, borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.cardPadding, gap: 0, ...Shadow.card,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  recRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  recText: { fontSize: 14, color: Colors.textSecondary, flex: 1, lineHeight: 20 },
  summary: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
});
