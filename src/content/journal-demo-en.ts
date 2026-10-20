import type {JournalBlock} from './journal';

// Tradução da prévia local. Não é um artigo publicado.
export const journalDemoEnglish: JournalBlock[] = [
  {type: 'paragraph', text: 'This is a sample article for the journal. It lets us assess the reading experience; it is not a published article or an account of a new project.'},
  {type: 'paragraph', text: 'A page can have good ideas and still be hard to follow. Sometimes the problem is not the sentence, but the path your eyes must take to find it. Text size, column width, spacing and headings all affect that journey.'},
  {type: 'heading', level: 2, text: 'Before the first sentence'},
  {type: 'paragraph', text: 'Readers often look for clues before deciding whether to stay. The title suggests a question; the introduction shows why it matters; the headings reveal where the discussion is going. None of this needs to hand over a ready-made answer, but it should help people find their way.'},
  {type: 'paragraph', segments: [
    {text: 'The '},
    {text: 'W3C guidance on headings', href: 'https://www.w3.org/WAI/tutorials/page-structure/headings/'},
    {text: ' reminds us that headings also organise content for people using assistive technology. Visual hierarchy and semantic structure need to tell the same story.'},
  ]},
  {type: 'heading', level: 3, text: 'Three useful questions'},
  {type: 'list', items: [
    'Does the title clearly say what the text is about?',
    'Does each section develop a recognisable idea?',
    'Does the next paragraph invite you onward without hiding the subject?',
  ]},
  {type: 'quote', text: 'A comfortable page does not force you to read. It removes obstacles.', attribution: 'Sample text'},
  {type: 'heading', level: 2, text: 'Rhythm communicates too'},
  {type: 'paragraph', text: 'A very wide column makes the eyes travel a long way across each line. One that is too narrow breaks up the thought. The best balance depends on the typeface, size, device and content. It is something to test, not a magic number.'},
  {type: 'paragraph', segments: [
    {text: 'The '},
    {text: 'web.dev typography guide', href: 'https://web.dev/learn/design/typography/'},
    {text: ' covers factors worth assessing, including text size, line length and spacing. Here, the central column gives the writing presence without making it tiring to read.'},
  ]},
  {type: 'image', src: '/media/rooftop-01.webp', width: 1920, height: 1080, alt: 'Cover of the editorial presentation for the Rooftop Arquitetura conceptual study', caption: 'An example of visual hierarchy in the Rooftop Arquitetura conceptual study. Image from the portfolio archive.'},
  {type: 'paragraph', text: 'The image above illustrates an editorial choice: make the entrance clear before showing the details. You do not need it to understand the text, which is why the page should also work when an article contains only words.'},
  {type: 'heading', level: 2, text: 'Reading is finding a path'},
  {type: 'paragraph', text: 'Dividers, captions and references have different jobs. A divider signals a change of subject. A caption explains what an image adds. A reference lets readers check where information comes from. When each element has a purpose, the page feels simpler.'},
  {type: 'paragraph', segments: [
    {text: 'The '},
    {text: 'Rooftop project', href: '/projetos/rooftop'},
    {text: ' shows how one visual system can organise content at different scales. The intention here is similar: offer a recognisable sequence so readers can decide where to go deeper.'},
  ]},
  {type: 'paragraph', text: 'This example ends without a definitive conclusion. When reviewing a real article, perhaps the most useful question is simple: after reading, can someone distinguish the main idea, the author’s observations and the sources behind the facts?'},
];
