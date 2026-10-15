import React from 'react';
import { type HighScore } from '../data/submarineTexts';

export type ThemeId = 'submarine' | 'airforce';

export interface ThemeLevel {
  level: number;
  name: string;
  rank: string;
  dimensionValue: string; // e.g. "20 METERS" or "1,000 FEET"
  description: string;
  multiplier: number;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  flair: string;
  title: string;
  subtitle: string;
  vesselLabel: string; // e.g. "VESSEL" vs "AIRCRAFT"
  vesselName: string;  // e.g. "HSwMS GOTLAND" vs "SAAB JAS 39 GRIPEN"
  dimensionLabel: string; // e.g. "DEPTH" vs "ALTITUDE"
  badgeText: string;
  levels: ThemeLevel[];
  getPassages: (level: number, lang: 'en' | 'sv') => string[];
  GraphicComponent: React.FC<{ className?: string }>;
  initialScores: HighScore[];
  initialMobileScores: HighScore[];
}
