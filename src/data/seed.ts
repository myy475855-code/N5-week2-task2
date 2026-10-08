import { internshipRepository } from './index';

export async function seed() {
  const base = {
    description: 'Work with a friendly team on real production problems and ship features.',
    status: 'open' as const,
  };
  await internshipRepository.create({
    ...base, title: 'Backend Engineering Intern', company: 'Acme Labs', location: 'Lahore, PK',
    category: 'engineering', stipend: 800, skills: ['node', 'typescript', 'sql'],
    contact: { name: 'Sara Khan', email: 'careers@acmelabs.example' },
  });
  await internshipRepository.create({
    ...base, title: 'Product Design Intern', company: 'Pixel & Co', location: 'Remote',
    category: 'design', stipend: 600, skills: ['figma'],
  });
  await internshipRepository.create({
    ...base, title: 'Data Analyst Intern', company: 'Insight Works', location: 'Karachi, PK',
    category: 'data',
  });
}
