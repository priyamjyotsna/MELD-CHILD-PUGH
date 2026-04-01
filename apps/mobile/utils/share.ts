import { Share } from 'react-native';
import type { MeldResult, ChildPughResult, Meld3Input } from '@livertracker/clinical-scores';

export async function shareMeldResult(
  result: MeldResult,
  allResults?: { meld?: MeldResult; meldNa?: MeldResult | null; meld3?: MeldResult | null },
  inputs?: Partial<Meld3Input>,
): Promise<void> {
  const lines: string[] = ['MELD Score Report — LiverTracker', ''];

  if (allResults?.meld) {
    lines.push(`MELD Score: ${allResults.meld.score}`);
  }
  if (allResults?.meldNa) {
    lines.push(`MELD-Na Score: ${allResults.meldNa.score}`);
  }
  if (allResults?.meld3) {
    lines.push(`MELD 3.0 Score: ${allResults.meld3.score}`);
  }

  lines.push('');
  lines.push('Lab Values:');

  const comp = result.components;
  comp.forEach((c) => {
    if (c.unit) {
      lines.push(`• ${c.name}: ${c.inputValue} ${c.unit}`);
    }
  });

  if (inputs?.onDialysis !== undefined) {
    lines.push(`• On Dialysis: ${inputs.onDialysis ? 'Yes' : 'No'}`);
  }

  lines.push('');
  lines.push(`Interpretation: ${result.clinicalContext.severityLabel} liver disease. ${result.clinicalContext.transplantImplication}`);
  lines.push('');
  lines.push('Disclaimer: This score is calculated for educational purposes only and should not be used for official transplant listing. Consult your hepatologist.');
  lines.push('');
  lines.push('Calculated by LiverTracker (livertracker.com)');
  lines.push('Developed by Dr. Jyotsna Priyam');

  await Share.share({
    message: lines.join('\n'),
    title: 'MELD Score Report — LiverTracker',
  });
}

export async function shareChildPughResult(result: ChildPughResult): Promise<void> {
  const lines: string[] = ['Child-Pugh Score Report — LiverTracker', ''];

  lines.push(`Child-Pugh Score: ${result.score} (${result.classificationLabel})`);
  lines.push('');
  lines.push('Lab Values:');

  result.components.forEach((c) => {
    if (c.unit) {
      lines.push(`• ${c.name}: ${c.inputValue} ${c.unit} (${c.points} point${c.points !== 1 ? 's' : ''})`);
    } else {
      lines.push(`• ${c.name}: ${c.points} point${c.points !== 1 ? 's' : ''}`);
    }
  });

  lines.push('');
  lines.push(`Interpretation: ${result.classificationLabel}. ${result.clinicalContext.transplantImplication}`);
  lines.push('');
  lines.push('Disclaimer: This score is calculated for educational purposes only. Consult your hepatologist.');
  lines.push('');
  lines.push('Calculated by LiverTracker (livertracker.com)');
  lines.push('Developed by Dr. Jyotsna Priyam');

  await Share.share({
    message: lines.join('\n'),
    title: 'Child-Pugh Score Report — LiverTracker',
  });
}
