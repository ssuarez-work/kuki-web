export interface SizeRow {
  size: string
  intl: string
  chest: number
  length: number
}

export interface SizeGuide {
  rows: SizeRow[]
  toleranceLength: number
  toleranceChest: number
}

export const POLO_SIZES: SizeGuide = {
  rows: [
    { size: 'CH', intl: 'S', chest: 45.7, length: 71.7 },
    { size: 'M', intl: 'M', chest: 50.8, length: 74.2 },
    { size: 'G', intl: 'L', chest: 55.8, length: 76.8 },
    { size: 'EG', intl: 'XL', chest: 60.9, length: 79.3 },
    { size: 'EEG', intl: '2XL', chest: 66, length: 81.9 },
  ],
  toleranceLength: 2.5,
  toleranceChest: 1.9,
}

export const DRY_FIT_SIZES: SizeGuide = {
  rows: [
    { size: 'CH', intl: 'S', chest: 48.2, length: 72 },
    { size: 'M', intl: 'M', chest: 50.8, length: 73.3 },
    { size: 'G', intl: 'L', chest: 55.8, length: 75.8 },
    { size: 'EG', intl: 'XL', chest: 60.9, length: 78.4 },
    { size: 'EEG', intl: '2XL', chest: 66, length: 80.9 },
  ],
  toleranceLength: 2.5,
  toleranceChest: 2.5,
}

export const CUELLO_SIZES: SizeGuide = {
  rows: [
    { size: 'CH', intl: 'S', chest: 46.7, length: 70.4 },
    { size: 'M', intl: 'M', chest: 50.8, length: 73 },
    { size: 'G', intl: 'L', chest: 55.8, length: 75.5 },
    { size: 'EG', intl: 'XL', chest: 60.9, length: 78.1 },
    { size: 'EEG', intl: '2XL', chest: 66, length: 80.6 },
    { size: 'EEEG', intl: '3XL', chest: 71.3, length: 84.6 },
  ],
  toleranceLength: 2.5,
  toleranceChest: 1.9,
}
