import yaml from 'js-yaml';

// Keep unquoted CMS dates as strings, independent of the host timezone.
export const parseYaml = source => yaml.safeLoad(source, {schema: yaml.JSON_SCHEMA});

export function publicationTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/.exec(String(value ?? '').trim());
  if (!match) throw new Error('publish_at deve conter data e hora ISO');
  const [, year, month, day, hour, minute, second = '00', fraction = '', offset = '-03:00'] = match;
  const calendar = new Date(Date.UTC(+year, +month - 1, +day));
  if (calendar.getUTCFullYear() !== +year || calendar.getUTCMonth() !== +month - 1 || calendar.getUTCDate() !== +day || +hour > 23 || +minute > 59 || +second > 59) {
    throw new Error('publish_at contém data ou hora inválida');
  }
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${fraction}${offset}`;
  if (!Number.isFinite(Date.parse(iso))) throw new Error('publish_at contém offset inválido');
  return iso;
}

export function postMetadata(markdown) {
  const frontmatter = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!frontmatter) throw new Error('Frontmatter YAML ausente');
  return parseYaml(frontmatter[1]);
}
