import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { FibroScanResult } from '@livertracker/clinical-scores';
import { SeverityBanner } from '../../components/results/SeverityBanner';
import { FibrosisScale } from '../../components/results/FibrosisScale';
import { SteatosisScale } from '../../components/results/SteatosisScale';
import { CitationFooter } from '../../components/results/CitationFooter';
import { ActionFooter } from '../../components/results/ActionFooter';
import { Colors } from '../../constants/colors';
import { Shadow, Spacing } from '../../constants/spacing';

export default function FibroScanResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ result: string }>();
  const result: FibroScanResult = JSON.parse(params.result);

  const handleShare = async () => {
    const lines = [
      'FibroScan Report — LiverTracker Tools',
      '',
      `Liver Stiffness: ${result.fibrosis.stiffnessValue} kPa`,
      `Fibrosis Stage: ${result.fibrosis.stageLabel}`,
    ];
    if (result.steatosis) {
      lines.push(`CAP Score: ${result.steatosis.capValue} dB/m`);
      lines.push(`Steatosis Grade: ${result.steatosis.gradeLabel}`);
      lines.push(`Estimated Liver Fat: ${result.steatosis.estimatedFatPercentage}`);
    }
    lines.push('', result.overallSummary, '');
    lines.push('Disclaimer: For educational purposes only. Consult your hepatologist.');
    lines.push('Calculated by LiverTracker Tools · Developed by Dr. Jyotsna Priyam');

    await Share.share({ message: lines.join('\n'), title: 'FibroScan Report' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>FibroScan Results</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close-circle" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Layer 1 — Fibrosis Scale */}
        <FibrosisScale
          stiffnessValue={result.fibrosis.stiffnessValue}
          stage={result.fibrosis.stage}
          stageLabel={result.fibrosis.stageLabel}
          allStages={result.fibrosis.allStages}
          stiffnessColor={result.fibrosis.stiffnessColor}
        />

        {/* Layer 2 — Fibrosis Banner */}
        <SeverityBanner
          label={result.fibrosis.stageLabel}
          color={result.fibrosis.stiffnessColor}
        />

        {/* Layer 3 — Steatosis Scale (if CAP provided) */}
        {result.steatosis && (
          <SteatosisScale
            capValue={result.steatosis.capValue}
            grade={result.steatosis.grade}
            gradeLabel={result.steatosis.gradeLabel}
            capColor={result.steatosis.capColor}
            estimatedFatPercentage={result.steatosis.estimatedFatPercentage}
            allGrades={result.steatosis.allGrades}
          />
        )}

        {/* Layer 4 — Clinical Interpretation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Your Results Mean</Text>
          <Text style={styles.body}>{result.overallSummary}</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>{result.fibrosis.clinicalImplication}</Text>
          {result.steatosis && (
            <>
              <View style={styles.divider} />
              <Text style={styles.body}>{result.steatosis.clinicalImplication}</Text>
            </>
          )}
        </View>

        {/* Layer 5 — Recommendations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommendations</Text>
          {result.recommendations.map((rec, i) => (
            <View key={i} style={styles.recRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.brandBlue} />
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}
        </View>

        {/* Layer 6 — Note */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={20} color={Colors.textSecondary} />
          <Text style={styles.noteText}>
            Cutoff values shown here are general NAFLD-based ranges. Exact thresholds may vary based
            on your underlying liver condition. Always discuss FibroScan results with your hepatologist.
          </Text>
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
    padding: Spacing.cardPadding, gap: 8, ...Shadow.card,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  body: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  divider: { height: 1, backgroundColor: Colors.border },
  recRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 6 },
  recText: { fontSize: 14, color: Colors.textSecondary, flex: 1, lineHeight: 20 },
  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.backgroundCard, borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.cardPadding, borderWidth: 1, borderColor: Colors.border,
  },
  noteText: { fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 20, fontStyle: 'italic' },
});
