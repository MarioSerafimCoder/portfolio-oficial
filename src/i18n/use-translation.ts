'use client';
import {useJournalPreferences} from '@/components/journal-preferences';
import {createTranslator} from './translate';
export function useSiteTranslation(){return createTranslator(useJournalPreferences().locale);}
