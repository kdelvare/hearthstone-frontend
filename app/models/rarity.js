import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string'),

	image: computed('id', function() {
		return `/assets/rarity_${this.get('id')}.png`;
	})
});
