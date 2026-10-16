import { type ThemeConfig } from './types';
import { GotlandSubmarine } from '../components/GotlandSubmarine';
import {
  SUBMARINE_LEVELS,
  getPassages as getSubmarinePassages,
  INITIAL_HIGH_SCORES,
  INITIAL_MOBILE_HIGH_SCORES
} from '../data/submarineTexts';

export const submarineTheme: ThemeConfig = {
  id: 'submarine',
  name: 'SUBWRITE',
  icon: '⚓',
  flair: '★',
  title: 'SUBWRITE!',
  subtitle: 'subwrite.se - your personal submarine type challenge!',
  vesselLabel: 'VESSEL',
  vesselName: 'HSwMS GOTLAND',
  dimensionLabel: 'DEPTH',
  badgeText: '🇸🇪 HSwMS GOTLAND (A19) • STIRLING AIP • X-RUDDER',
  groupLabel: 'FLEET',
  actionWord: 'DIVE',
  actionWordLong: 'COMMENCE DIVE',
  langSubTitleEn: 'Naval Archives',
  langSubTitleSv: 'Gotland & Marinen',
  progressStatusText: 'BALLAST TANKS FLOODING...',
  levelHeaderLabel: 'TACTICAL DIVE LEVEL',
  levels: SUBMARINE_LEVELS.map(lvl => ({
    level: lvl.level,
    name: lvl.name,
    rank: lvl.rank,
    dimensionValue: lvl.depth,
    description: lvl.description,
    multiplier: lvl.multiplier
  })),
  getPassages: getSubmarinePassages,
  GraphicComponent: GotlandSubmarine,
  initialScores: INITIAL_HIGH_SCORES,
  initialMobileScores: INITIAL_MOBILE_HIGH_SCORES
};
