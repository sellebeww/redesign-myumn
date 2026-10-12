import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLogin } from '../src/lib/login';
import { openGroupsFor, toggleSidebarGroup } from '../src/lib/sidebar';

test('any student mailbox can enter with a valid password', () => {
  assert.equal(validateLogin('siapa.saja@student.umn.ac.id', 'Abcdefg1'), null);
  assert.equal(validateLogin('  TEST@STUDENT.UMN.AC.ID ', 'Abcdefg123'), null);
});
test('rejects invalid addresses and domain lookalikes', () => {
  for (const email of ['', '@student.umn.ac.id', 'user@gmail.com', 'user@student.umn.ac.id.evil.com', 'user@@student.umn.ac.id', 'two words@student.umn.ac.id']) assert.ok(validateLogin(email, 'Abcdefg1'));
});
test('password requires eight characters, uppercase, lowercase and a digit', () => {
  for (const password of ['', 'Abcdef1', 'abcdefgh1', 'ABCDEFGH1', 'Abcdefgh']) assert.ok(validateLogin('user@student.umn.ac.id', password));
});
test('opens top level groups and resets descendants when switching', () => {
  let groups = toggleSidebarGroup({}, 'self-service');
  groups = toggleSidebarGroup(groups, 'self-service/personal-info');
  assert.ok(groups['self-service/personal-info']);
  groups = toggleSidebarGroup(groups, 'enrollment');
  assert.deepEqual(groups, {enrollment: true});
  groups = toggleSidebarGroup(groups, 'self-service');
  assert.deepEqual(groups, {'self-service': true});
});
test('closing a category also resets every descendant', () => {
  assert.deepEqual(toggleSidebarGroup({'self-service':true,'self-service/personal-info':true}, 'self-service'), {});
});
test('open groups cover every ancestor of the active page', () => {
  assert.deepEqual(openGroupsFor('self-service/personal-info/names', false), {'self-service': true, 'self-service/personal-info': true});
  assert.deepEqual(openGroupsFor('enrollment', true), {enrollment: true});
  assert.deepEqual(openGroupsFor('dashboard', false), {});
});
