import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JournalImage } from '@/components/journal-image';
import { publishedJournalPosts } from '@/content/journal';
import { journalPostForLocale } from '@/content/journal-i18n';
import dimensions from '@/content/media-dimensions.json';
import { projects, type Project } from '@/content/projects';
import { site } from '@/content/site';
import { createTranslator, translateObject } from '@/i18n/translate';
import type { SiteLocale } from '@/i18n/routes';
import { journalCoverUrl } from '@/lib/journal-cover-url';
import { socialLinks } from '@/lib/site-links';
import '@/app/sobre/about.css';

export const metadata: Metadata = {
    title: 'Sobre Mário Serafim | Diretor de Arte e Designer',
    description: 'Sou Mário Serafim, diretor de arte em Fortaleza. Trabalho com identidade visual, campanhas e projetos digitais.',
    alternates: { canonical: '/sobre' },
    openGraph: { title: 'Sobre Mário Serafim | Direção de arte em Fortaleza', description: 'Minha trajetória, formação e maneira de trabalhar com direção de arte e identidade visual.', url: '/sobre' },
};

const chapters = [
    {
        title: 'O começo no marketing',
        body: 'Minha formação começou no marketing. Também trabalhei em gráfica rápida, onde ouvi muita gente tratar design como se fosse só apertar uns botões no Photoshop. Aos poucos, fui me interessando justamente pelo que ficava de fora dessa ideia de trabalho: entender o que precisava ser comunicado e fazer escolhas a partir daí.',
    },
    {
        title: 'Agências, educação e esporte',
        body: 'Passei por agências, educação e esporte. Nas agências, vi a demanda por conteúdo crescer e o tempo para explorar ideias encolher. Circular entre áreas diferentes me fez prestar mais atenção em quem recebe o trabalho e no contexto em que ele vai aparecer.',
    },
    {
        title: 'Da rocha à interface',
        body: 'Trabalhar com rochas naturais me pôs diante de uma matéria que já tem cor, textura e presença. Na direção de arte, precisei decidir quanto espaço deixar para ela. Estudar UX, UI e desenvolvimento web me ajudou a levar perguntas como essa para a tela, onde a apresentação também precisa funcionar como interface.',
    },
];

const projectSelections = {
    amazonita: {
        text: 'Usei uma paleta neutra para dar espaço ao verde-azulado da rocha. No motion, preferi transições sutis para que o movimento ajudasse a perceber a textura.',
        link: 'Ver projeto Amazonita',
    },
    rooftop: {
        text: 'Escolhi uma assinatura serifada para dialogar com as linhas precisas da arquitetura. Na apresentação editorial, dei espaço às imagens e usei a tipografia para organizar a leitura.',
        link: 'Ver projeto Rooftop Arquitetura',
        image: '/media/rooftop-02.webp',
    },
    simetria: {
        text: 'Usei curvas equilibradas no símbolo e uma paleta de tons foscos para expressar cuidado. O padrão modular me permitiu levar essa linguagem a peças bem diferentes.',
        link: 'Ver projeto Simetria Estética',
    },
};

type FeaturedSlug = keyof typeof projectSelections;
const featuredProjects = projects.filter((project): project is Project & { slug: FeaturedSlug } =>
    Object.hasOwn(projectSelections, project.slug),
);
const trajectoryImage = projects.find(project => project.slug === 'amazonita')?.gallery.find(
    image => image.src === '/media/amazonita-editorial-1.webp',
);
const workingHabits = [
    {
        title: 'Entender',
        body: 'Antes de abrir o Photoshop, quero entender com quem a marca conversa, o que precisa mudar e onde o trabalho vai ser usado. Essas respostas me ajudam a decidir por onde começar.',
    },
    {
        title: 'Experimentar',
        body: 'Testo caminhos diferentes na peça ou na tela em que a ideia vai viver. Colocar as opções lado a lado ajuda a perceber o que se sustenta quando entram o texto, a imagem e as limitações do formato.',
    },
    {
        title: 'Revisar',
        body: 'Às vezes, a ideia de que mais gosto é a que mais atrapalha a leitura. Volto ao que o projeto precisa resolver e mudo o desenho quando faz sentido.',
    },
];

const studies = [
    { title: 'Marketing', body: 'Graduação pela Wyden/Fanor' },
    { title: 'Direção de Arte', body: 'Pós-graduação pela Anhanguera' },
    { title: 'UX, UI e desenvolvimento web', body: 'Estudos em experiência do usuário, interfaces e programação' },
];

function AboutImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
    const { width, height } = dimensions[src as keyof typeof dimensions];
    return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} />;
}

export default function About({ locale = 'pt' }: { locale?: SiteLocale } = {}) {
    const { i18nText, i18nHref } = createTranslator(locale);
    const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://marioserafim.com.br').replace(/\/$/, '');
    const structuredData = { '@context': 'https://schema.org', '@type': 'Person', name: site.name, url: origin, jobTitle: 'Diretor de arte', sameAs: socialLinks.map(link => link.url) };
    const latestPost = publishedJournalPosts.find(post => locale === 'pt' || post.translations?.en);
    const latestPostCopy = latestPost && journalPostForLocale(latestPost, locale);

    return (
        <main id="conteudo" className="editorial-about">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(translateObject(structuredData, locale)).replace(/</g, '\\u003c') }} />

            <section className="about-hero section-wrap" aria-labelledby="about-title">
                <p className="about-kicker">{site.name} <span aria-hidden="true">/</span> {i18nText('Fortaleza, CE')}</p>
                <h1 id="about-title"><span>{i18nText('Não foi uma linha reta.')}</span> <em>{i18nText('Ainda bem.')}</em></h1>
                <p className="about-lead">{i18nText('Sou diretor de arte e designer. Comecei no marketing, passei por agências, educação e esporte e fui parar até no universo das rochas naturais. Gosto de como cada projeto me faz olhar de outro jeito para alguma coisa que eu achava que já conhecia.')}</p>
            </section>

            <section className="about-journey section-wrap" aria-labelledby="journey-title">
                <h2 id="journey-title">{i18nText('Fui aprendendo no caminho.')}</h2>
                <ol className="about-chapters" role="list">
                    {chapters.map(({ title, body }, index) => (
                        <li key={title}>
                            <span className="about-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            <div><h3>{i18nText(title)}</h3><p>{i18nText(body)}</p></div>
                        </li>
                    ))}
                </ol>
                {trajectoryImage && <figure className="about-journey-image">
                    <AboutImage src={trajectoryImage.src} alt={i18nText(trajectoryImage.alt)}
                        sizes="(max-width: 700px) 72vw, (max-width: 1100px) 28vw, 360px" />
                    <figcaption>{i18nText('Peça editorial da Amazonita para a Granistone.')}</figcaption>
                </figure>}
            </section>

            <section className="about-work section-wrap" aria-labelledby="work-title">
                <h2 id="work-title">{i18nText('O trabalho por trás')} <em>{i18nText('do trabalho.')}</em></h2>
                {featuredProjects.map(project => {
                    const selection = projectSelections[project.slug];
                    const media = 'image' in selection ? project.gallery.find(item => item.src === selection.image) : undefined;
                    const title = i18nText(project.name);
                    return (
                        <article className={`about-case about-case--${project.slug}`} key={project.slug}>
                            <div className="about-case-media editorial-image">
                                <AboutImage src={media?.src ?? project.cover} alt={i18nText(media?.alt ?? project.coverAlt)}
                                    sizes="(max-width: 700px) 94vw, (max-width: 1100px) 57vw, 780px" />
                            </div>
                            <div className="about-case-copy">
                                <p className="about-kicker">{i18nText(project.nature)}</p>
                                <h3>{title}</h3>
                                <p>{i18nText(selection.text)}</p>
                                <Link className="about-case-link editorial-visit" href={i18nHref(`/projetos/${project.slug}`)}>
                                    {i18nText(selection.link)} <span aria-hidden="true">↗</span>
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section id="processo" className="about-practice section-wrap" aria-labelledby="practice-title">
                <h2 id="practice-title">{i18nText('Como eu trabalho')}</h2>
                <ol className="about-practice-list" role="list">
                    {workingHabits.map(({ title, body }, index) => (
                        <li key={title}>
                            <span className="about-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            <h3>{i18nText(title)}</h3>
                            <p>{i18nText(body)}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="about-interests section-wrap" aria-labelledby="interests-title">
                <div className="about-studies">
                    <h2 id="interests-title">{i18nText('O que me interessa')}</h2>
                    <p>{i18nText('Gosto de acompanhar o que acontece com uma ideia quando ela sai da apresentação e alguém precisa usá-la. Foi por isso que fui estudar experiência do usuário e desenvolvimento web, além da minha formação em marketing e direção de arte.')}</p>
                    <dl>
                        {studies.map(({ title, body }) => (
                            <div key={title}><dt>{i18nText(title)}</dt><dd>{i18nText(body)}</dd></div>
                        ))}
                    </dl>
                </div>
                {latestPost && latestPostCopy && (
                    <div className="about-reading">
                        <p className="about-kicker">Pausa do café</p>
                        <h3>{i18nText('Também penso em voz alta.')}</h3>
                        <p>{i18nText('Escrevo sobre design, arte e a profissão. Volto com frequência a uma pergunta: o que muda no nosso jeito de criar quando muda a ferramenta?')}</p>
                        <article className="about-article">
                            {latestPost.cover && (
                                <div className="about-article-cover">
                                    <JournalImage src={journalCoverUrl(latestPost.cover.src)} alt={latestPostCopy.coverAlt ?? ''}
                                        fill sizes="(max-width: 700px) 84vw, 42vw" style={{ objectPosition: latestPost.cover.position }} />
                                </div>
                            )}
                            <Link className="about-article-link" href={i18nHref(`/blog/${latestPost.slug}`)}>
                                <h4>{latestPostCopy.title}</h4>
                                <span aria-hidden="true">↗</span>
                            </Link>
                            <p>{latestPostCopy.summary}</p>
                        </article>
                    </div>
                )}
            </section>

            <section className="about-close section-wrap" aria-labelledby="about-close-title">
                <h2 id="about-close-title">{i18nText('Cada projeto pede')} <em>{i18nText('outras perguntas.')}</em></h2>
                <div>
                    <p>{i18nText('Nos projetos, mostro como as respostas foram tomando forma, da primeira escolha visual ao uso de cada peça.')}</p>
                    <div className="about-close-actions">
                        <Link className="pill filled" href={i18nHref('/projetos')}>{i18nText('Conhecer meus projetos')} <span className="arrow" aria-hidden="true">↗</span></Link>
                        <a className="text-link about-link" href="#contato">{i18nText('Vamos conversar')} <span aria-hidden="true">↓</span></a>
                    </div>
                </div>
            </section>
        </main>
    );
}
