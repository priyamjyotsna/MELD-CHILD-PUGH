import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { interpretFibroScan } from '@livertracker/clinical-scores';
import { CalculatorInput } from '../../components/ui/CalculatorInput';
import { GradientButton } from '../../components/ui/GradientButton';
import { OutlineButton } from '../../components/ui/OutlineButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { lightHaptic, mediumHaptic } from '../../utils/haptics';

function getStiffnessStatus(v: number) {
  if (v < 5.0) return 'normal' as const;
  if (v < 7.0) return 'mildly_elevated' as const;
  if (v < 14.0) return 'elevated' as const;
  return 'critical' as const;
}

function getCapStatus(v: number) {
  if (v < 238) return 'normal' as const;
  if (v < 260) return 'mildly_elevated' as const;
  if (v < 290) return 'elevated' as const;
  return 'critical' as const;
}

export default function FibroScanScreen() {
  const router = useRouter();

  const [stiffness, setStiffness] = useState('');
  const [cap, setCap] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parseNum = (s: string) => parseFloat(s);

  const validate = useCallback(async () => {
    await lightHaptic();
    const newErrors: Record<string, string> = {};
    const kpa = parseNum(stiffness);

    if (!stiffness || isNaN(kpa) || kpa <= 0) {
      newErrors.stiffness = 'Liver stiffness is required and must be positive';
    } else if (kpa > 75) {
      newErrors.stiffness = 'Value seems unusually high (typical max ~75 kPa). Please verify.';
    }

    if (cap.trim()) {
      const capVal = parseNum(cap);
      if (isNaN(capVal) || capVal < 100 || capVal > 400) {
        newErrors.cap = 'CAP score typically ranges 100–400 dB/m';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await mediumHaptic();

    const input: { liverStiffness: number; capScore?: number } = {
      liverStiffness: kpa,
    };
    if (cap.trim()) {
      input.capScore = parseNum(cap);
    }

    const result = interpretFibroScan(input);

    router.push({
      pathname: '/results/fibroscan-result',
      params: { result: JSON.stringify(result) },
    });
  }, [stiffness, cap]);

  const reset = () => {
    setStiffness('');
    setCap('');
    setErrors({});
  };

  const kpaNum = parseNum(stiffness);
  const capNum = parseNum(cap);

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
              label="Liver Stiffness (kPa)"
              required
              placeholder="e.g. 5.8"
              helperText="Normal: <5.0 kPa · Typical range: 2.5–75 kPa"
              value={stiffness}
              onChangeText={setStiffness}
              status={stiffness && !isNaN(kpaNum) && kpaNum > 0 ? getStiffnessStatus(kpaNum) : undefined}
              error={errors.stiffness}
              accessibilityHint="Enter liver stiffness measurement in kPa"
            />

            <View>
              <CalculatorInput
                label="CAP Score (dB/m) — optional"
                placeholder="e.g. 245"
                helperText="Measures liver fat · Normal: <238 dB/m · Range: 100–400 dB/m"
                value={cap}
                onChangeText={setCap}
                status={cap && !isNaN(capNum) && capNum >= 100 ? getCapStatus(capNum) : undefined}
                error={errors.cap}
                accessibilityHint="Enter Controlled Attenuation Parameter in dB/m"
              />
            </View>
          </View>

          <View style={styles.actions}>
            <GradientButton
              title="Interpret Results"
              onPress={validate}
              disabled={!stiffness.trim()}
              style={styles.calcBtn}
            />
            <OutlineButton title="Reset" onPress={reset} style={styles.resetBtn} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundPage },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: Spacing.screenPadding, gap: Spacing.sectionGap, paddingBottom: 40 },
  section: { gap: Spacing.fieldGap },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  calcBtn: { flex: 2 },
  resetBtn: { flex: 1 },
});
