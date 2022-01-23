import { parse } from '../parser';
import { large, textWithTags } from './seed-large';

describe('performance tests', () => {
  // Both should be around ~1MB
  const seedStructured = Array.from({ length: 800 }).fill(large).join('');
  const seedFlatText = Array.from({ length: 125 }).fill(textWithTags).join('');
  console.log('Data sizes:', {
    seedStructured: seedStructured.length,
    seedFlatText: seedFlatText.length
  });

  it('structured document with a lot of nested tags', async () => {
    const parsed = parse(seedStructured);

    // just accessing test to make sure the previous function is executed
    expect(parsed).toHaveLength(4000);
  });

  it('large text with few tags', async () => {
    const parsed = parse(seedFlatText);

    expect(parsed).toHaveLength(2750);
  });
});
