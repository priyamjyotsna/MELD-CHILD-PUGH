import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import type { ScoringReference } from '@livertracker/clinical-scores';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface CitationFooterProps {
  references: ScoringReference[];
}

export function CitationFooter({ references }: CitationFooterProps) {
  const openDoi = (doi: string) => {
    if (doi) {
      Linking.openURL(`https://doi.org/${doi}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>References</Text>

      {references.map((ref, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => openDoi(ref.doi)}
          disabled={!ref.doi}
          accessibilityRole="link"
          accessibilityLabel={`${ref.authors} ${ref.journal} ${ref.year}`}
        >
          <Text style={[styles.reference, ref.doi && styles.referenceLink]}>
            {ref.authors} {ref.journal}. {ref.year}.
            {ref.doi ? ` DOI: ${ref.doi}` : ''}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.divider} />

      <Text style={styles.disclaimer}>
        For educational purposes only. Not for official transplant listing decisions. Always consult
        your hepatologist.
      </Text>

      <Text style={styles.attribution}>
        Built by Dr. Jyotsna Priyam · LiverTracker.com
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingBottom: 32,
  },
  sectionTitle: {
    ...Typography.scoreLabel,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  reference: {
    ...Typography.footerText,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  referenceLink: {
    color: Colors.brandMid,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  disclaimer: {
    ...Typography.footerText,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  attribution: {
    ...Typography.footerText,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
