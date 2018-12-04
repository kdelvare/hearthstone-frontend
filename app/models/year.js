import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string'),
	standard: DS.attr('boolean'),

	cardsets: DS.hasMany(),

	size: computed('cardsets', function() {
		return this.get('cardsets').length;
	})
});
