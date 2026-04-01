import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ChildPughResult } from '@livertracker/clinical-scores';
import { ScoreRing } from '../../components/results/ScoreRing';
import { SeverityBanner } from '../../components/results/SeverityBanner';
import { ComponentBreakdown } from '../../components/results/ComponentBreakdown';
import { ClinicalContextCard } from '../../components/results/ClinicalContextCard';
import { ActionFooter } from '../../components/results/ActionFooter';
import { CitationFooter } from '../../components/results/CitationFooter';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { shareChildPughResult } from '../../utils/share';

export default function ChildPughResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ result: string }>();

  const result: ChildPughResult = JSON.parse(params.result);

  const handleShare = async () => {
    await shareChildPughResult(result);
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
        {/* Layer 1 — Score Ring with Class letter */}
        <View style={styles.ringContainer}>
          <ScoreRing
            score={result.score}
            minScore={5}
            maxScore={15}
            formula="Child-Pugh Score"
            severityColor={result.clinicalContext.severityColor}
            subtitle={`Class ${result.classification}`}
          />
        </View>

        {/* Layer 2 — Severity Banner */}
        <SeverityBanner
          label={result.classificationLabel}
          color={result.clinicalContext.severityColor}
        />

        {/* Layer 3 — Component Breakdown (Point Breakdown) */}
        <ComponentBreakdown components={result.components} />

        {/* Layer 4 — Clinical Context */}
        <ClinicalContextCard context={result.clinicalContext} scoreType="childPugh" />

        {/* Layer 5 — Action Footer */}
        <ActionFooter onShare={handleShare} />

        {/* Layer 6 — Citation & Disclaimer */}
        <CitationFooter references={result.references} />
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
