'use client'

import { atom } from 'jotai'
import { DEFAULT_CURRENCY } from '@mezon-tutors/shared'

export const currencyAtom = atom<string>(DEFAULT_CURRENCY)
