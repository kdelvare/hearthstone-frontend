import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string'),
	collectible: DS.attr('boolean'),
	standard: DS.attr('boolean'),

	image: computed('id', function() {
		return `/assets/cardset_${this.get('id')}.png`;
	}),

	class: computed('id', function() {
		const id = this.get('id');
		switch (id) {
			case '3': //Classique
				return 'Classique';
			case '1125': //Bois maudit
				return 'year';
			case '1127': //Armageboum
				return 'current';
			default:
				return '';
		}
	})
});
