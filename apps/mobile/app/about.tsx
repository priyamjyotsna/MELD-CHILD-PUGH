import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Shadow, Spacing } from '../constants/spacing';

const REFERENCES = [
  {
    authors: 'Kamath PS, Wiesner RH, Malinchoc M, et al.',
    title: 'A model to predict survival in patients with end-stage liver disease.',
    journal: 'Hepatology',
    year: 2001,
    doi: '10.1053/jhep.2001.22172',
  },
  {
    authors: 'Kamath PS, Kim WR.',
    title: 'The model for end-stage liver disease (MELD).',
    journal: 'Hepatology',
    year: 2007,
    doi: '10.1002/hep.21563',
  },
  {
    authors: 'Kim WR, Biggins SW, Kremers WK, et al.',
    title: 'Hyponatremia and mortality among patients on the liver-transplant waiting list.',
    journal: 'N Engl J Med',
    year: 2008,
    doi: '10.1056/NEJMoa0801209',
  },
  {
    authors: 'Biggins SW, Kim WR, Terrault NA, et al.',
    title: 'Evidence-based incorporation of serum sodium concentration into MELD.',
    journal: 'Gastroenterology',
    year: 2006,
    doi: '10.1053/j.gastro.2006.02.010',
  },
  {
    authors: 'Kim WR, Mannalithara A, Heimbach JK, et al.',
    title: 'MELD 3.0: The Model for End-Stage Liver Disease Updated for the Modern Era.',
    journal: 'Gastroenterology',
    year: 2021,
    doi: '10.1053/j.gastro.2021.08.050',
  },
  {
    authors: 'Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R.',
    title: 'Transection of the oesophagus for bleeding oesophageal varices.',
    journal: 'Br J Surg',
    year: 1973,
    doi: '10.1002/bjs.1800600817',
  },
];

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={sectionStyles.container}>
      <TouchableOpacity
        style={sectionStyles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <Text style={sectionStyles.title}>{title}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>
      {expanded && <View style={sectionStyles.content}>{children}</View>}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Spacing.cardBorderRadius,
    overflow: 'hidden',
    ...Shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.cardPadding,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.cardPadding,
    paddingBottom: Spacing.cardPadding,
    gap: 12,
  },
});

export default function AboutScreen() {
  const openUrl = (url: string) => Linking.openURL(url);
  const openDoi = (doi: string) => openUrl(`https://doi.org/${doi}`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* About LiverTracker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About LiverTracker</Text>
          <Text style={styles.body}>
            LiverTracker is an open-source platform for liver disease severity scoring, developed
            to support clinicians, researchers, and patients in understanding liver disease
            progression and transplant eligibility.
          </Text>
          <TouchableOpacity onPress={() => openUrl('https://livertracker.com')}>
            <Text style={styles.link}>livertracker.com →</Text>
          </TouchableOpacity>
        </View>

        {/* When to Use Each Score */}
        <CollapsibleSection title="When to Use Each Score">
          <ScoreUsageItem
            name="MELD"
            description="Transplant prioritization and 3-month mortality prediction. The standard score used by UNOS/OPTN prior to 2023."
          />
          <ScoreUsageItem
            name="MELD-Na"
            description="Improved accuracy when hyponatremia (low sodium) is present. Incorporates serum sodium into the MELD calculation."
          />
          <ScoreUsageItem
            name="MELD 3.0"
            description="Current OPTN standard (adopted 2023). Addresses sex-based disparity in transplant access by incorporating albumin and sex assigned at birth."
          />
          <ScoreUsageItem
            name="Child-Pugh"
            description="Surgical risk assessment and cirrhosis classification (Class A, B, or C). Widely used for prognosis in chronic liver disease."
          />
        </CollapsibleSection>

        {/* Formulas */}
        <CollapsibleSection title="Formulas">
          <FormulaItem
            name="MELD"
            formula="10 × (0.957×ln(Cr) + 0.378×ln(Bili) + 1.12×ln(INR) + 0.643)"
            note="Creatinine clamped to 1.0–4.0; Bilirubin min 1.0; INR min 1.0. Set to 4.0 if on dialysis."
          />
          <FormulaItem
            name="MELD-Na"
            formula="MELD + 1.32×(137−Na) − 0.033×MELD×(137−Na)"
            note="Sodium bounded 125–137 mEq/L."
          />
          <FormulaItem
            name="MELD 3.0"
            formula="1.33×(Female) + 4.56×ln(Bili) + 0.82×(137−Na) − 0.24×(137−Na)×ln(Bili) + 9.09×ln(INR) + 11.14×ln(Cr) + 1.85×(3.5−Alb) − 1.83×(3.5−Alb)×ln(Cr) + 6"
            note="Creatinine capped at 3.0. Albumin bounded 1.5–3.5. Sodium bounded 125–137."
          />
          <FormulaItem
            name="Child-Pugh"
            formula="Sum of 5 components (Bilirubin, Albumin, INR, Ascites, Encephalopathy), each scored 1–3 points."
            note="Class A: 5–6pts, Class B: 7–9pts, Class C: 10–15pts."
          />
        </CollapsibleSection>

        {/* References */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>References</Text>
          {REFERENCES.map((ref, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => openDoi(ref.doi)}
              accessibilityRole="link"
              accessibilityLabel={`${ref.authors} ${ref.journal} ${ref.year}`}
            >
              <Text style={styles.reference}>
                {i + 1}. {ref.authors} {ref.title} <Text style={styles.italic}>{ref.journal}</Text>
                . {ref.year}.{' '}
                <Text style={styles.doiLink}>DOI: {ref.doi}</Text>
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Credits */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Credits & Attribution</Text>
          <Text style={styles.body}>
            Developed by <Text style={styles.bold}>Dr. Jyotsna Priyam</Text>, Hepatologist.
          </Text>
          <Text style={styles.body}>
            This tool is open-source (MIT license) and available on GitHub. If you use this
            software in your research, please cite it.
          </Text>
          <TouchableOpacity onPress={() => openUrl('https://github.com/livertracker/clinical-scores')}>
            <Text style={styles.link}>View on GitHub →</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legal</Text>
          <TouchableOpacity onPress={() => openUrl('https://livertracker.com/privacy')}>
            <Text style={styles.link}>Privacy Policy →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openUrl('https://livertracker.com/terms')}>
            <Text style={styles.link}>Terms of Service →</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            For educational purposes only. Not for official transplant listing decisions. Always
            consult your hepatologist.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ScoreUsageItem({ name, description }: { name: string; description: string }) {
  return (
    <View style={usageStyles.item}>
      <Text style={usageStyles.name}>{name}</Text>
      <Text style={usageStyles.description}>{description}</Text>
    </View>
  );
}

function FormulaItem({
  name,
  formula,
  note,
}: {
  name: string;
  formula: string;
  note: string;
}) {
  return (
    <View style={formulaStyles.item}>
      <Text style={formulaStyles.name}>{name}</Text>
      <Text style={formulaStyles.formula}>{formula}</Text>
      <Text style={formulaStyles.note}>{note}</Text>
    </View>
  );
}

const usageStyles = StyleSheet.create({
  item: {
    gap: 4,
  },
  name: {
    ...Typography.inputLabel,
    color: Colors.brandBlue,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

const formulaStyles = StyleSheet.create({
  item: {
    gap: 4,
    borderLeftWidth: 3,
    borderLeftColor: Colors.brandBlue,
    paddingLeft: 12,
  },
  name: {
    ...Typography.inputLabel,
    color: Colors.textPrimary,
  },
  formula: {
    fontSize: 13,
    fontFamily: 'Courier',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  note: {
    ...Typography.helperText,
    color: Colors.textSecondary,
    lineHeight: 18,
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
    gap: Spacing.fieldGap,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.cardPadding,
    gap: 12,
    ...Shadow.card,
  },
  cardTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  bold: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  italic: {
    fontStyle: 'italic',
  },
  link: {
    ...Typography.body,
    color: Colors.brandMid,
    textDecorationLine: 'underline',
  },
  reference: {
    ...Typography.footerText,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  doiLink: {
    color: Colors.gradientStart,
  },
  disclaimer: {
    ...Typography.helperText,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
