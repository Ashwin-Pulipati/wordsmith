import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('c1', 'c2')).toBe('c1 c2');
  });

  it('should handle conditional class names', () => {
    expect(cn('c1', true && 'c2', false && 'c3')).toBe('c1 c2');
  });

  it('should handle tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});
