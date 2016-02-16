import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import expectComponent from 'croodle/tests/helpers/201-created/raw/expect-component';
import Ember from 'ember';

moduleForComponent('create-options', 'Integration | Component | create options', {
  integration: true,
  beforeEach() {
    this.inject.service('store');
  }
});

test('renders component', function(assert) {
  this.set('options', []);
  this.set('isDateTime', false);
  this.set('isFindADate', true);
  this.set('isMakeAPoll', false);
  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  assert.ok(
    expectComponent(this.container, 'create-options-dates', 1).ok
  );
  assert.notOk(
    expectComponent(this.container, 'create-options-text', 0).ok
  );

  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);

  assert.notOk(
    expectComponent(this.container, 'create-options-dates', 1).ok
  );
  assert.ok(
    expectComponent(this.container, 'create-options-text', 0).ok
  );
});

test('shows validation errors if options are not unique', function(assert) {
  assert.expect(2);

  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);

  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: this.get('isFindADate'),
      isDateTime: this.get('isDateTime'),
      isMakeAPoll: this.get('isMakeAPoll')
    });
  });
  this.set('options', poll.get('options'));

  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  Ember.run(() => {
    this.$('input').val('foo').trigger('change');
  });

  Ember.run(() => {
    this.$('button[type="submit"]').click();
  });

  assert.equal(
    this.$('div.alert').length, 1
  );

  Ember.run(() => {
    this.$('input').eq(0).val('bar').trigger('change');
  });

  assert.equal(
    this.$('div.alert').length, 0
  );
});

test('shows validation errors if option is empty', function(assert) {
  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);

  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: this.get('isFindADate'),
      isDateTime: this.get('isDateTime'),
      isMakeAPoll: this.get('isMakeAPoll')
    });
  });
  this.set('options', poll.get('options'));

  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  assert.equal(
    this.$('.form-group.has-error').length, 0
  );

  Ember.run(() => {
    this.$('input').trigger('focusout');
  });

  assert.equal(
    this.$('.form-group.has-error').length, 2
  );

  Ember.run(() => {
    this.$('input').eq(0).val('foo').trigger('change');
  });

  assert.equal(
    this.$('.form-group.has-error').length, 1
  );

  Ember.run(() => {
    this.$('input').eq(1).val('bar').trigger('change');
  });

  assert.equal(
    this.$('.form-group.has-error').length, 0
  );
});