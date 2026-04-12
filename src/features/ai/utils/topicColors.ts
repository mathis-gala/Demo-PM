export type TopicColor = {
  name: string;
  chip: string;
  border: string;
  softBg: string;
};

const LVL1_PALETTE: TopicColor[] = [
  {
    name: 'Indigo',
    chip: 'bg-indigo-600 text-white ring-indigo-200',
    border: 'border-indigo-200',
    softBg: 'bg-indigo-50',
  },
  {
    name: 'Emerald',
    chip: 'bg-emerald-600 text-white ring-emerald-200',
    border: 'border-emerald-200',
    softBg: 'bg-emerald-50',
  },
  {
    name: 'Sky',
    chip: 'bg-sky-600 text-white ring-sky-200',
    border: 'border-sky-200',
    softBg: 'bg-sky-50',
  },
  {
    name: 'Violet',
    chip: 'bg-violet-600 text-white ring-violet-200',
    border: 'border-violet-200',
    softBg: 'bg-violet-50',
  },
  {
    name: 'Amber',
    chip: 'bg-amber-500 text-white ring-amber-200',
    border: 'border-amber-200',
    softBg: 'bg-amber-50',
  },
  {
    name: 'Fuchsia',
    chip: 'bg-fuchsia-600 text-white ring-fuchsia-200',
    border: 'border-fuchsia-200',
    softBg: 'bg-fuchsia-50',
  },
  {
    name: 'Rose',
    chip: 'bg-rose-600 text-white ring-rose-200',
    border: 'border-rose-200',
    softBg: 'bg-rose-50',
  },
  {
    name: 'Teal',
    chip: 'bg-teal-600 text-white ring-teal-200',
    border: 'border-teal-200',
    softBg: 'bg-teal-50',
  },
];

const LVL2_PALETTE: TopicColor[] = [
  {
    name: 'Blue',
    chip: 'bg-blue-600 text-white ring-blue-200',
    border: 'border-blue-200',
    softBg: 'bg-blue-50',
  },
  {
    name: 'Lime',
    chip: 'bg-lime-600 text-white ring-lime-200',
    border: 'border-lime-200',
    softBg: 'bg-lime-50',
  },
  {
    name: 'Cyan',
    chip: 'bg-cyan-600 text-white ring-cyan-200',
    border: 'border-cyan-200',
    softBg: 'bg-cyan-50',
  },
  {
    name: 'Purple',
    chip: 'bg-purple-600 text-white ring-purple-200',
    border: 'border-purple-200',
    softBg: 'bg-purple-50',
  },
  {
    name: 'Orange',
    chip: 'bg-orange-600 text-white ring-orange-200',
    border: 'border-orange-200',
    softBg: 'bg-orange-50',
  },
  {
    name: 'Pink',
    chip: 'bg-pink-600 text-white ring-pink-200',
    border: 'border-pink-200',
    softBg: 'bg-pink-50',
  },
  {
    name: 'Red',
    chip: 'bg-red-600 text-white ring-red-200',
    border: 'border-red-200',
    softBg: 'bg-red-50',
  },
  {
    name: 'Green',
    chip: 'bg-green-600 text-white ring-green-200',
    border: 'border-green-200',
    softBg: 'bg-green-50',
  },
];

function hashStringToInt(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickFromPalette(palette: TopicColor[], key: string) {
  const idx = hashStringToInt(key) % palette.length;
  return palette[idx];
}

export function colorForTopicLvl1(topicLvl1: string): TopicColor {
  return pickFromPalette(LVL1_PALETTE, topicLvl1.trim().toLowerCase());
}

export function colorForTopicLvl2(topicLvl1: string, topicLvl2: string): TopicColor {
  const lvl1 = colorForTopicLvl1(topicLvl1);
  const key = `${topicLvl1.trim().toLowerCase()}|${topicLvl2.trim().toLowerCase()}`;

  let c = pickFromPalette(LVL2_PALETTE, key);
  if (c.name === lvl1.name) {
    c = LVL2_PALETTE[(hashStringToInt(key) + 1) % LVL2_PALETTE.length];
  }
  return c;
}

export function allTopicColors() {
  return [...LVL1_PALETTE, ...LVL2_PALETTE];
}
