import { type ThemeId, type ThemeConfig } from './types';
import { submarineTheme } from './submarineTheme';
import { airforceTheme } from './airforceTheme';
import { armyTheme } from './armyTheme';
import { pubTheme } from './pubTheme';

export * from './types';
export { submarineTheme } from './submarineTheme';
export { airforceTheme } from './airforceTheme';
export { armyTheme } from './armyTheme';
export { pubTheme } from './pubTheme';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  submarine: submarineTheme,
  airforce: airforceTheme,
  army: armyTheme,
  pub: pubTheme
};

export const AVAILABLE_THEMES: ThemeConfig[] = [
  submarineTheme,
  airforceTheme,
  armyTheme,
  pubTheme
];

export const DEFAULT_THEME_ID: ThemeId = 'submarine';

export const getTheme = (id?: string | null): ThemeConfig => {
  if (id && id in THEMES) {
    return THEMES[id as ThemeId];
  }
  return submarineTheme;
};
