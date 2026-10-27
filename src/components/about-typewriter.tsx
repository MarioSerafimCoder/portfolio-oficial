'use client';
import {useSiteTranslation} from '@/i18n/use-translation';
const sentences = [
    'Sou Mário Serafim, diretor de arte em Fortaleza.',
    'Trabalho com identidade visual, campanhas e projetos digitais.',
    'Gosto da parte visual, claro.',
    'Mas gosto principalmente de entender o que existe por trás de cada projeto.',
];
export function AboutTypewriter() {
    const { i18nText, i18nHref } = useSiteTranslation();
    return <p className="about-typewriter" data-motion="prose">
    {i18nText(sentences.map((sentence, index) => <span className="about-sentence" key={sentence}>{i18nText(sentence)}{i18nText(index < sentences.length - 1 ? ' ' : '')}</span>))}
  </p>;
}
