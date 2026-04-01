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
import {
  calculateMeld,
  calculateMeldNa,
  calculateMeld3,
  type MeldResult,
} from '@livertracker/clinical-scores';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { CalculatorInput } from '../../components/ui/CalculatorInput';
import { SelectDropdown } from '../../components/ui/SelectDropdown';
import { Checkbox } from '../../components/ui/Checkbox';
import { GradientButton } from '../../components/ui/GradientButton';
import { OutlineButton } from '../../components/ui/OutlineButton';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { lightHaptic, mediumHaptic } from '../../utils/haptics';

type MeldTab = 'MELD' | 'MELD-Na' | 'MELD 3.0';
type SexValue = 'male' | 'female';

const MELD_TABS: { label: string; value: MeldTab }[] = [
  { label: 'MELD', value: 'MELD' },
  { label: 'MELD-Na', value: 'MELD-Na' },
  { label: 'MELD 3.0', value: 'MELD 3.0' },
];

const SEX_OPTIONS: { label: string; value: SexValue }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

function getBilirubinStatus(v: number) {
  if (v <= 1.2) return 'normal' as const;
  if (v <= 3.0) return 'mildly_elevated' as const;
  if (v <= 10.0) return 'elevated' as const;
  return 'critical' as const;
}

function getCreatinineStatus(v: number) {
  if (v <= 1.2) return 'normal' as const;
  if (v <= 2.0) return 'mildly_elevated' as const;
  if (v <= 4.0) return 'elevated' as const;
  return 'critical' as const;
}

function getInrStatus(v: number) {
  if (v <= 1.2) return 'normal' as const;
  if (v <= 1.7) return 'mildly_elevated' as const;
  if (v <= 2.3) return 'elevated' as const;
  return 'critical' as const;
}

function getSodiumStatus(v: number) {
  if (v >= 135 && v <= 145) return 'normal' as const;
  if (v >= 130) return 'mildly_elevated' as const;
  if (v >= 125) return 'elevated' as const;
  return 'critical' as const;
}

function getAlbuminStatus(v: number) {
  if (v >= 3.5) return 'normal' as const;
  if (v >= 2.8) return 'mildly_elevated' as const;
  if (v >= 2.0) return 'elevated' as const;
  return 'critical' as const;
}

export default function MeldCalculatorScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MeldTab>('MELD');

  const [bilirubin, setBilirubin] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [inr, setInr] = useState('');
  const [sodium, setSodium] = useState('');
  const [albumin, setAlbumin] = useState('');
  const [sex, setSex] = useState<SexValue | null>(null);
  const [onDialysis, setOnDialysis] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const parseNum = (s: string) => parseFloat(s);

  const validateAndCalculate = useCallback(async () => {
    await lightHaptic();

    const newErrors: Record<string, string> = {};

    const bili = parseNum(bilirubin);
    const cr = parseNum(creatinine);
    const inrVal = parseNum(inr);

    if (!bilirubin || isNaN(bili) || bili <= 0) {
      newErrors.bilirubin = 'Value must be greater than zero';
    } else if (bili > 50) {
      newErrors.bilirubin = 'This value seems unusually high. Please verify.';
    }

    if (!creatinine || isNaN(cr) || cr <= 0) {
      newErrors.creatinine = 'Value must be greater than zero';
    }

    if (!inr || isNaN(inrVal) || inrVal <= 0) {
      newErrors.inr = 'Value must be greater than zero';
    }

    if (activeTab === 'MELD-Na' || activeTab === 'MELD 3.0') {
      const na = parseNum(sodium);
      if (!sodium || isNaN(na) || na <= 0) {
        newErrors.sodium = 'Value must be greater than zero';
      }
    }

    if (activeTab === 'MELD 3.0') {
      const alb = parseNum(albumin);
      if (!albumin || isNaN(alb) || alb <= 0) {
        newErrors.albumin = 'Value must be greater than zero';
      }
      if (!sex) {
        newErrors.sex = 'Please select a value';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    await mediumHaptic();

    const bili_ = parseNum(bilirubin);
    const cr_ = parseNum(creatinine);
    const inr_ = parseNum(inr);

    let meldResult: MeldResult;
    let meldNaResult: MeldResult | null = null;
    let meld3Result: MeldResult | null = null;

    if (activeTab === 'MELD') {
      meldResult = calculateMeld({ bilirubin: bili_, creatinine: cr_, inr: inr_, onDialysis });
    } else if (activeTab === 'MELD-Na') {
      const na_ = parseNum(sodium);
      meldResult = calculateMeld({ bilirubin: bili_, creatinine: cr_, inr: inr_, onDialysis });
      meldNaResult = calculateMeldNa({
        bilirubin: bili_,
        creatinine: cr_,
        inr: inr_,
        onDialysis,
        sodium: na_,
      });
    } else {
      const na_ = parseNum(sodium);
      const alb_ = parseNum(albumin);
      meldResult = calculateMeld({ bilirubin: bili_, creatinine: cr_, inr: inr_, onDialysis });
      meldNaResult = calculateMeldNa({
        bilirubin: bili_,
        creatinine: cr_,
        inr: inr_,
        onDialysis,
        sodium: na_,
      });
      meld3Result = calculateMeld3({
        bilirubin: bili_,
        creatinine: cr_,
        inr: inr_,
        onDialysis,
        sodium: na_,
        albumin: alb_,
        sex: sex!,
      });
    }

    router.push({
      pathname: '/results/meld-result',
      params: {
        meld: JSON.stringify(meldResult!),
        meldNa: meldNaResult ? JSON.stringify(meldNaResult) : '',
        meld3: meld3Result ? JSON.stringify(meld3Result) : '',
        activeFormula: activeTab,
      },
    });
  }, [bilirubin, creatinine, inr, sodium, albumin, sex, onDialysis, activeTab]);

  const reset = () => {
    setBilirubin('');
    setCreatinine('');
    setInr('');
    setSodium('');
    setAlbumin('');
    setSex(null);
    setOnDialysis(false);
    setErrors({});
  };

  const isFormValid =
    bilirubin && creatinine && inr &&
    (activeTab === 'MELD' || sodium) &&
    (activeTab !== 'MELD 3.0' || (albumin && sex));

  const bilirubinNum = parseNum(bilirubin);
  const creatinineNum = parseNum(creatinine);
  const inrNum = parseNum(inr);
  const sodiumNum = parseNum(sodium);
  const albuminNum = parseNum(albumin);

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
          {/* Tab Switcher */}
          <SegmentedControl
            options={MELD_TABS}
            selectedValue={activeTab}
            onValueChange={setActiveTab}
          />

          {/* Base Fields (always visible) */}
          <View style={styles.section}>
            <CalculatorInput
              label="Serum Bilirubin"
              required
              placeholder="e.g. 1.2"
              helperText="Normal range: 0.1–1.2 mg/dL"
              value={bilirubin}
              onChangeText={setBilirubin}
              status={bilirubin && !isNaN(bilirubinNum) ? getBilirubinStatus(bilirubinNum) : undefined}
              error={errors.bilirubin && errors.bilirubin.includes('zero') ? errors.bilirubin : undefined}
              warning={errors.bilirubin && errors.bilirubin.includes('high') ? errors.bilirubin : undefined}
              accessibilityHint="Enter serum bilirubin in mg/dL"
            />

            <CalculatorInput
              label="Serum Creatinine"
              required
              placeholder="e.g. 0.9"
              helperText="Normal range: 0.6–1.2 mg/dL"
              value={creatinine}
              onChangeText={setCreatinine}
              status={creatinine && !isNaN(creatinineNum) ? getCreatinineStatus(creatinineNum) : undefined}
              error={errors.creatinine}
              accessibilityHint="Enter serum creatinine in mg/dL"
            />

            <CalculatorInput
              label="INR"
              required
              placeholder="e.g. 1.1"
              helperText="Normal range: 0.8–1.2"
              value={inr}
              onChangeText={setInr}
              status={inr && !isNaN(inrNum) ? getInrStatus(inrNum) : undefined}
              error={errors.inr}
              accessibilityHint="Enter International Normalized Ratio"
            />
          </View>

          {/* Sodium (MELD-Na and MELD 3.0) */}
          {(activeTab === 'MELD-Na' || activeTab === 'MELD 3.0') && (
            <View style={styles.section}>
              <CalculatorInput
                label="Serum Sodium"
                required
                placeholder="e.g. 138"
                helperText="Normal range: 135–145 mEq/L"
                value={sodium}
                onChangeText={setSodium}
                status={sodium && !isNaN(sodiumNum) ? getSodiumStatus(sodiumNum) : undefined}
                error={errors.sodium}
                accessibilityHint="Enter serum sodium in mEq/L"
              />
            </View>
          )}

          {/* Albumin + Sex (MELD 3.0 only) */}
          {activeTab === 'MELD 3.0' && (
            <View style={styles.section}>
              <CalculatorInput
                label="Serum Albumin"
                required
                placeholder="e.g. 3.5"
                helperText="Normal range: 3.5–5.0 g/dL"
                value={albumin}
                onChangeText={setAlbumin}
                status={albumin && !isNaN(albuminNum) ? getAlbuminStatus(albuminNum) : undefined}
                error={errors.albumin}
                accessibilityHint="Enter serum albumin in g/dL"
              />

              <SelectDropdown
                label="Sex (assigned at birth)"
                required
                options={SEX_OPTIONS}
                selectedValue={sex}
                onValueChange={setSex}
                placeholder="Select sex..."
              />
            </View>
          )}

          {/* Dialysis Toggle */}
          <View style={styles.section}>
            <Checkbox
              label="On dialysis (≥2 sessions/week)"
              sublabel="If checked, creatinine will be set to 4.0 (MELD) or 3.0 (MELD 3.0)"
              checked={onDialysis}
              onToggle={() => setOnDialysis(!onDialysis)}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <GradientButton
              title={`Calculate ${activeTab}`}
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
