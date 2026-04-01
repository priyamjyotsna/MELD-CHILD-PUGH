import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISCLAIMER_KEY = '@livertracker:disclaimer_accepted';

export function useFirstLaunch(): {
  isFirstLaunch: boolean | null;
  acceptDisclaimer: () => Promise<void>;
} {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(DISCLAIMER_KEY).then((value) => {
      setIsFirstLaunch(value === null);
    });
  }, []);

  const acceptDisclaimer = async () => {
    await AsyncStorage.setItem(DISCLAIMER_KEY, 'accepted');
    setIsFirstLaunch(false);
  };

  return { isFirstLaunch, acceptDisclaimer };
}
