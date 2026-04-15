export type PageGroup = 'Design';
export type NavVariant = 'none' | 'public' | 'auth' | 'client' | 'admin';

export interface PageNote {
  date: string;
  state?: string;
  text: string;
}

export interface TestScenario {
  name: string;
  steps: string[];
}

export interface PageEntry {
  id: string;
  title: string;
  group: PageGroup;
  route: string;
  stateCount: number;
  nav: NavVariant;
  notes?: PageNote[];
  qaScore?: number;
  qaCycles?: number;
  testScenarios?: TestScenario[];
}

export const pageRegistry: PageEntry[] = [
  {
    id: 'design-system',
    title: 'Design System',
    group: 'Design',
    route: '/proto/states/design-system',
    stateCount: 1,
    nav: 'none',
    qaCycles: 1,
    qaScore: 10,
    notes: [{ date: '2026-04-14', text: 'Complete design system: brand guide (logo, colors, typography, spacing) + component showcase (navigation, inputs, buttons, cards, lists, empty states, alerts).' }],
    testScenarios: [
      { name: 'View design system', steps: ['open /proto/states/design-system', 'verify all brand sections visible', 'verify all component sections visible', 'verify interactive buttons work'] },
    ],
  },
];

export const pageGroups = [...new Set(pageRegistry.map((p) => p.group))];

export function getPage(id: string): PageEntry | undefined {
  return pageRegistry.find((p) => p.id === id);
}
