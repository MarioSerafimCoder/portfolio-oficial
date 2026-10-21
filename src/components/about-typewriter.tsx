const sentences = [
  'Sou Mário Serafim, diretor de arte em Fortaleza.',
  'Trabalho com identidade visual, campanhas e projetos digitais.',
  'Gosto da parte visual, claro.',
  'Mas gosto principalmente de entender o que existe por trás de cada projeto.',
];

export function AboutTypewriter() {
  return <p className="about-typewriter" data-motion="prose">
    {sentences.map((sentence, index) => <span className="about-sentence" key={sentence}>{sentence}{index < sentences.length - 1 ? ' ' : ''}</span>)}
  </p>;
}
