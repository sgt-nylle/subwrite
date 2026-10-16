import { type ThemeId, type ThemeConfig } from './types';
import { submarineTheme } from './submarineTheme';
import { airforceTheme } from './airforceTheme';
import { armyTheme } from './armyTheme';

export * from './types';
export { submarineTheme } from './submarineTheme';
export { airforceTheme } from './airforceTheme';
export { armyTheme } from './armyTheme';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  submarine: submarineTheme,
  airforce: airforceTheme,
  army: armyTheme
};

export const AVAILABLE_THEMES: ThemeConfig[] = [
  submarineTheme,
  airforceTheme,
  armyTheme
];

export const DEFAULT_THEME_ID: ThemeId = 'submarine';

export const getTheme = (id?: string | null): ThemeConfig => {
  if (id && id in THEMES) {
    return THEMES[id as ThemeId];
  }
  return submarineTheme;
};
