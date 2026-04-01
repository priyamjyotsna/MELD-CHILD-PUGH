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
import { checkLiverEnzymes, ENZYME_THRESHOLDS } from '@livertracker/clinical-scores';
import { CalculatorInput } from '../../components/ui/CalculatorInput';
import { GradientButton } from '../../components/ui/GradientButton';
import { OutlineButton } from '../../components/ui/OutlineButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { lightHaptic, mediumHaptic } from '../../utils/haptics';

type EnzymeStatusType = 'normal' | 'mildly_elevated' | 'elevated' | 'critical';

function getEnzymeInputStatus(value: number, uln: number, isBilirubin: boolean): EnzymeStatusType {
  if (isBilirubin) {
    if (value <= 1.0) return 'normal';
    if (value <= 2.0) return 'mildly_elevated';
    if (value <= 5.0) return 'elevated';
    return 'critical';
  }
  if (value <= uln) return 'normal';
  if (value <= uln * 2) return 'mildly_elevated';
  if (value <= uln * 5) return 'elevated';
  return 'critical';
}

export default function LiverEnzymeScreen() {
  const router = useRouter();

  const [alt, setAlt] = useState('');
  const [ast, setAst] = useState('');
  const [ggt, setGgt] = useState('');
  const [alp, setAlp] = useState('');
  const [bilirubin, setBilirubin] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const parseNum = (s: string) => parseFloat(s);
  const hasAnyValue = [alt, ast, ggt, alp, bilirubin].some((v) => v.trim().length > 0);

  const validate = useCallback(async () => {
    await lightHaptic();
    const newErrors: Record<string, string> = {};

    for (const [key, val] of Object.entries({ alt, ast, ggt, alp, bilirubin })) {
      if (val.trim()) {
        const num = parseNum(val);
        if (isNaN(num) || num < 0) {
          newErrors[key] = 'Must be a positive number';
        }
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await mediumHaptic();

    const input: Record<string, number> = {};
    if (alt.trim()) input.alt = parseNum(alt);
    if (ast.trim()) input.ast = parseNum(ast);
    if (ggt.trim()) input.ggt = parseNum(ggt);
    if (alp.trim()) input.alp = parseNum(alp);
    if (bilirubin.trim()) input.bilirubin = parseNum(bilirubin);

    const result = checkLiverEnzymes(input);

    router.push({
      pathname: '/results/enzyme-result',
      params: { result: JSON.stringify(result) },
    });
  }, [alt, ast, ggt, alp, bilirubin]);

  const reset = () => {
    setAlt('');
    setAst('');
    setGgt('');
    setAlp('');
    setBilirubin('');
    setErrors({});
  };

  const altNum = parseNum(alt);
  const astNum = parseNum(ast);
  const ggtNum = parseNum(ggt);
  const alpNum = parseNum(alp);
  const biliNum = parseNum(bilirubin);

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
          <Text style={styles.subheader}>
            Fill in any values you have — all fields are optional.
          </Text>

          <View style={styles.section}>
            <CalculatorInput
              label="ALT"
              placeholder="e.g. 32"
              helperText={`Normal range: ${ENZYME_THRESHOLDS.alt.normalRange}`}
              value={alt}
              onChangeText={setAlt}
              status={alt && !isNaN(altNum) ? getEnzymeInputStatus(altNum, 40, false) : undefined}
              error={errors.alt}
              accessibilityHint="Enter ALT in U/L"
            />
            <CalculatorInput
              label="AST"
              placeholder="e.g. 28"
              helperText={`Normal range: ${ENZYME_THRESHOLDS.ast.normalRange}`}
              value={ast}
              onChangeText={setAst}
              status={ast && !isNaN(astNum) ? getEnzymeInputStatus(astNum, 35, false) : undefined}
              error={errors.ast}
              accessibilityHint="Enter AST in U/L"
            />
            <CalculatorInput
              label="GGT"
              placeholder="e.g. 45"
              helperText={`Normal range: ${ENZYME_THRESHOLDS.ggt.normalRange}`}
              value={ggt}
              onChangeText={setGgt}
              status={ggt && !isNaN(ggtNum) ? getEnzymeInputStatus(ggtNum, 50, false) : undefined}
              error={errors.ggt}
              accessibilityHint="Enter GGT in U/L"
            />
            <CalculatorInput
              label="ALP"
              placeholder="e.g. 85"
              helperText={`Normal range: ${ENZYME_THRESHOLDS.alp.normalRange}`}
              value={alp}
              onChangeText={setAlp}
              status={alp && !isNaN(alpNum) ? getEnzymeInputStatus(alpNum, 120, false) : undefined}
              error={errors.alp}
              accessibilityHint="Enter ALP in U/L"
            />
            <CalculatorInput
              label="Total Bilirubin"
              placeholder="e.g. 0.8"
              helperText={`Normal range: ${ENZYME_THRESHOLDS.bilirubin.normalRange}`}
              value={bilirubin}
              onChangeText={setBilirubin}
              status={bilirubin && !isNaN(biliNum) ? getEnzymeInputStatus(biliNum, 1.0, true) : undefined}
              error={errors.bilirubin}
              accessibilityHint="Enter total bilirubin in mg/dL"
            />
          </View>

          <View style={styles.actions}>
            <GradientButton
              title="Check Enzymes"
              onPress={validate}
              disabled={!hasAnyValue}
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
  subheader: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  section: { gap: Spacing.fieldGap },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  calcBtn: { flex: 2 },
  resetBtn: { flex: 1 },
});
