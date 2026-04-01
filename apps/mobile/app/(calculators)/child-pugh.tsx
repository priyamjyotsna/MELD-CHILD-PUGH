import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { calculateChildPugh, type ChildPughInput } from '@livertracker/clinical-scores';
import { CalculatorInput } from '../../components/ui/CalculatorInput';
import { SelectDropdown } from '../../components/ui/SelectDropdown';
import { GradientButton } from '../../components/ui/GradientButton';
import { OutlineButton } from '../../components/ui/OutlineButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { lightHaptic, mediumHaptic } from '../../utils/haptics';

type AscitesValue = ChildPughInput['ascites'];
type EncephalopathyValue = ChildPughInput['encephalopathy'];

const ASCITES_OPTIONS: { label: string; value: AscitesValue }[] = [
  { label: 'None (1 point)', value: 'none' },
  { label: 'Mild (2 points)', value: 'mild' },
  { label: 'Moderate–Severe (3 points)', value: 'moderate_severe' },
];

const ENCEPHALOPATHY_OPTIONS: { label: string; value: EncephalopathyValue }[] = [
  { label: 'None (1 point)', value: 'none' },
  { label: 'Grade 1–2 (2 points)', value: 'grade_1_2' },
  { label: 'Grade 3–4 (3 points)', value: 'grade_3_4' },
];

function getBilirubinStatus(v: number) {
  if (v < 2) return 'normal' as const;
  if (v <= 3) return 'mildly_elevated' as const;
  return 'critical' as const;
}

function getAlbuminStatus(v: number) {
  if (v > 3.5) return 'normal' as const;
  if (v >= 2.8) return 'mildly_elevated' as const;
  return 'critical' as const;
}

function getInrStatus(v: number) {
  if (v < 1.7) return 'normal' as const;
  if (v <= 2.3) return 'mildly_elevated' as const;
  return 'critical' as const;
}

export default function ChildPughCalculatorScreen() {
  const router = useRouter();

  const [bilirubin, setBilirubin] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [inr, setInr] = useState('');
  const [ascites, setAscites] = useState<AscitesValue | null>(null);
  const [encephalopathy, setEncephalopathy] = useState<EncephalopathyValue | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const parseNum = (s: string) => parseFloat(s);

  const validateAndCalculate = useCallback(async () => {
    await lightHaptic();

    const newErrors: Record<string, string> = {};

    const bili = parseNum(bilirubin);
    const alb = parseNum(albumin);
    const inrVal = parseNum(inr);

    if (!bilirubin || isNaN(bili) || bili <= 0) {
      newErrors.bilirubin = 'Value must be greater than zero';
    } else if (bili > 50) {
      newErrors.bilirubin = 'This value seems unusually high. Please verify.';
    }

    if (!albumin || isNaN(alb) || alb <= 0) {
      newErrors.albumin = 'Value must be greater than zero';
    }

    if (!inr || isNaN(inrVal) || inrVal <= 0) {
      newErrors.inr = 'Value must be greater than zero';
    }

    if (!ascites) {
      newErrors.ascites = 'Please select a value';
    }

    if (!encephalopathy) {
      newErrors.encephalopathy = 'Please select a value';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    await mediumHaptic();

    const result = calculateChildPugh({
      bilirubin: parseNum(bilirubin),
      albumin: parseNum(albumin),
      inr: parseNum(inr),
      ascites: ascites!,
      encephalopathy: encephalopathy!,
    });

    router.push({
      pathname: '/results/child-pugh-result',
      params: { result: JSON.stringify(result) },
    });
  }, [bilirubin, albumin, inr, ascites, encephalopathy]);

  const reset = () => {
    setBilirubin('');
    setAlbumin('');
    setInr('');
    setAscites(null);
    setEncephalopathy(null);
    setErrors({});
  };

  const isFormValid = bilirubin && albumin && inr && ascites && encephalopathy;

  const bilirubinNum = parseNum(bilirubin);
  const albuminNum = parseNum(albumin);
  const inrNum = parseNum(inr);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <CalculatorInput
              label="Serum Bilirubin"
              required
              placeholder="e.g. 1.5"
              helperText="<2 = 1pt · 2–3 = 2pts · >3 = 3pts"
              value={bilirubin}
              onChangeText={setBilirubin}
              status={bilirubin && !isNaN(bilirubinNum) ? getBilirubinStatus(bilirubinNum) : undefined}
              error={errors.bilirubin && errors.bilirubin.includes('zero') ? errors.bilirubin : undefined}
              warning={errors.bilirubin && errors.bilirubin.includes('high') ? errors.bilirubin : undefined}
              accessibilityHint="Enter serum bilirubin in mg/dL"
            />

            <CalculatorInput
              label="Serum Albumin"
              required
              placeholder="e.g. 3.8"
              helperText=">3.5 = 1pt · 2.8–3.5 = 2pts · <2.8 = 3pts"
              value={albumin}
              onChangeText={setAlbumin}
              status={albumin && !isNaN(albuminNum) ? getAlbuminStatus(albuminNum) : undefined}
              error={errors.albumin}
              accessibilityHint="Enter serum albumin in g/dL"
            />

            <CalculatorInput
              label="INR"
              required
              placeholder="e.g. 1.2"
              helperText="<1.7 = 1pt · 1.7–2.3 = 2pts · >2.3 = 3pts"
              value={inr}
              onChangeText={setInr}
              status={inr && !isNaN(inrNum) ? getInrStatus(inrNum) : undefined}
              error={errors.inr}
              accessibilityHint="Enter International Normalized Ratio"
            />

            <SelectDropdown
              label="Ascites (fluid in abdomen)"
              required
              options={ASCITES_OPTIONS}
              selectedValue={ascites}
              onValueChange={setAscites}
              placeholder="Select ascites status..."
            />

            <SelectDropdown
              label="Hepatic Encephalopathy"
              required
              options={ENCEPHALOPATHY_OPTIONS}
              selectedValue={encephalopathy}
              onValueChange={setEncephalopathy}
              placeholder="Select encephalopathy grade..."
            />
          </View>

          <View style={styles.actions}>
            <GradientButton
              title="Calculate Child-Pugh"
              onPress={validateAndCalculate}
              disabled={!isFormValid}
              style={styles.calculateButton}
            />
            <OutlineButton title="Reset" onPress={reset} style={styles.resetButton} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPage,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.screenPadding,
    gap: Spacing.sectionGap,
    paddingBottom: 40,
  },
  section: {
    gap: Spacing.fieldGap,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  calculateButton: {
    flex: 2,
  },
  resetButton: {
    flex: 1,
  },
});
