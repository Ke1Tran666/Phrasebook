import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ADMIN_EMAIL, isAdminAccount } from '@/services/admin-auth';

describe('Admin authentication guard', () => {
  it('identifies the exact admin gmail account', () => {
    assert.equal(
      isAdminAccount({
        sub: 'admin-1',
        email: 'ke1tran666@gmail.com',
        name: 'Admin',
      }),
      true,
    );
  });

  it('handles case-insensitivity and whitespace in email', () => {
    assert.equal(
      isAdminAccount({
        sub: 'admin-2',
        email: '  KE1TRAN666@GMAIL.COM  ',
        name: 'Admin',
      }),
      true,
    );
  });

  it('rejects other email accounts', () => {
    assert.equal(
      isAdminAccount({
        sub: 'user-1',
        email: 'other.user@gmail.com',
        name: 'Other',
      }),
      false,
    );
    assert.equal(
      isAdminAccount({
        sub: 'user-2',
        email: 'ke1tran@gmail.com',
        name: 'Imposter',
      }),
      false,
    );
  });

  it('rejects null or undefined accounts', () => {
    assert.equal(isAdminAccount(null), false);
    assert.equal(isAdminAccount(undefined), false);
    assert.equal(
      isAdminAccount({
        sub: 'no-email',
        email: '',
        name: 'No Email',
      }),
      false,
    );
  });

  it('matches the configured ADMIN_EMAIL constant', () => {
    assert.equal(ADMIN_EMAIL, 'ke1tran666@gmail.com');
  });
});
