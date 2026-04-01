import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import type { MeldResult } from '@livertracker/clinical-scores';
import { ScoreRing } from '../../components/results/ScoreRing';
import { SeverityBanner } from '../../components/results/SeverityBanner';
import { ScoreComparison } from '../../components/results/ScoreComparison';
import { ComponentBreakdown } from '../../components/results/ComponentBreakdown';
import { ClinicalContextCard } from '../../components/results/ClinicalContextCard';
import { ActionFooter } from '../../components/results/ActionFooter';
import { CitationFooter } from '../../components/results/CitationFooter';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { shareMeldResult } from '../../utils/share';

export default function MeldResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    meld: string;
    meldNa: string;
    meld3: string;
    activeFormula: string;
  }>();

  const meldResult: MeldResult = JSON.parse(params.meld);
  const meldNaResult: MeldResult | null = params.meldNa ? JSON.parse(params.meldNa) : null;
  const meld3Result: MeldResult | null = params.meld3 ? JSON.parse(params.meld3) : null;
  const activeFormula = (params.activeFormula ?? 'MELD') as 'MELD' | 'MELD-Na' | 'MELD 3.0';

  const activeResult =
    activeFormula === 'MELD 3.0' && meld3Result
      ? meld3Result
      : activeFormula === 'MELD-Na' && meldNaResult
        ? meldNaResult
        : meldResult;

  const handleShare = async () => {
    await shareMeldResult(activeResult, { meld: meldResult, meldNa: meldNaResult, meld3: meld3Result });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom header for modal */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Results</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          accessibilityLabel="Close results"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={28} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Layer 1 — Score Ring */}
        <View style={styles.ringContainer}>
          <ScoreRing
            score={activeResult.score}
            minScore={6}
            maxScore={40}
            formula={activeResult.formula}
            severityColor={activeResult.clinicalContext.severityColor}
          />
        </View>

        {/* Layer 2 — Severity Banner */}
        <SeverityBanner
          label={activeResult.clinicalContext.severityLabel + ' Liver Disease'}
          color={activeResult.clinicalContext.severityColor}
        />

        {/* Layer 3 — Score Comparison (if multiple variants available) */}
        {(meldNaResult || meld3Result) && (
          <ScoreComparison
            meld={meldResult}
            meldNa={meldNaResult}
            meld3={meld3Result}
            activeFormula={activeFormula}
          />
        )}

        {/* Layer 4 — Component Breakdown */}
        <ComponentBreakdown components={activeResult.components} />

        {/* Layer 5 — Clinical Context */}
        <ClinicalContextCard context={activeResult.clinicalContext} scoreType="meld" />

        {/* Layer 6 — Action Footer */}
        <ActionFooter onShare={handleShare} />

        {/* Layer 7 — Citation & Disclaimer */}
        <CitationFooter references={activeResult.references} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPage,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.screenPadding,
    gap: Spacing.sectionGap,
    paddingBottom: 40,
  },
  ringContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
