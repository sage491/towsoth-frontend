import { describe, expect, it } from 'vitest';
import {
  formatExpiryTime,
  generateJoiningLink,
  getStatusLabel,
  validateEmail,
  validatePassword,
  validatePhone,
} from '@/utils/joiningLinkUtils';

describe('joiningLinkUtils', () => {
  it('generates joining link with expected metadata', () => {
    const link = generateJoiningLink('student-1', 'institution-1', 'admin-1', 2);

    expect(link.studentId).toBe('student-1');
    expect(link.institutionId).toBe('institution-1');
    expect(link.generatedBy).toBe('admin-1');
    expect(link.token.length).toBe(64);
    expect(link.expiresAt.getTime()).toBeGreaterThan(link.createdAt.getTime());
  });

  it('validates password rules', () => {
    expect(validatePassword('weak').isValid).toBe(false);
    expect(validatePassword('StrongPass1').isValid).toBe(true);
  });

  it('validates email and phone format', () => {
    expect(validateEmail('not-an-email').isValid).toBe(false);
    expect(validateEmail('admin@example.com').isValid).toBe(true);

    expect(validatePhone('12345').isValid).toBe(false);
    expect(validatePhone('9876543210').isValid).toBe(true);
  });

  it('formats expiry text and status labels', () => {
    const futureDate = new Date(Date.now() + 60 * 60 * 1000);

    expect(formatExpiryTime(futureDate)).toContain('remaining');
    expect(getStatusLabel('joining-pending')).toBe('Joining Pending');
  });
});
