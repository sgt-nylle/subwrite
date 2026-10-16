import React from 'react';
import { type HighScore } from '../data/submarineTexts';

export type ThemeId = 'submarine' | 'airforce' | 'army' | 'pub';

export interface ThemeLevel {
  level: number;
  name: string;
  rank: string;
  dimensionValue: string; // e.g. "20 METERS" or "1,000 FEET" or "500 METERS"
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
  vesselLabel: string; // e.g. "VESSEL" vs "AIRCRAFT" vs "TANK"
  vesselName: string;  // e.g. "HSwMS GOTLAND" vs "SAAB JAS 39 GRIPEN" vs "STRIDSVAGN 122"
  dimensionLabel: string; // e.g. "DEPTH" vs "ALTITUDE" vs "RANGE"
  badgeText: string;
  groupLabel: string; // e.g. "FLEET" vs "SQUADRON" vs "BATTALION"
  actionWord: string; // e.g. "DIVE" vs "FLY" vs "ROLL"
  actionWordLong: string; // e.g. "COMMENCE DIVE" vs "COMMENCE FLIGHT" vs "COMMENCE ASSAULT"
  langSubTitleEn: string; // e.g. "Naval Archives" vs "Aviation Archives" vs "Armored Warfare Archives"
  langSubTitleSv: string; // e.g. "Gotland & Marinen" vs "Gripen & Flygvapnet" vs "Strv 122 & Armén"
  progressStatusText: string; // e.g. "BALLAST TANKS FLOODING..." vs "AFTERBURNER ENGAGED..." vs "TRACKS ENGAGED..."
  levelHeaderLabel: string; // e.g. "TACTICAL DIVE LEVEL" vs "TACTICAL FLIGHT LEVEL" vs "TACTICAL COMBAT LEVEL"
  levels: ThemeLevel[];
  getPassages: (level: number, lang: 'en' | 'sv') => string[];
  GraphicComponent: React.FC<{ className?: string }>;
  initialScores: HighScore[];
  initialMobileScores: HighScore[];
}
