import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	name_fr: DS.attr('string'),
	collectible: DS.attr('boolean'),
	standard: DS.attr('boolean'),

	year: DS.belongsTo(),

	image: computed('id', function() {
		return `/assets/cardset_${this.get('id')}.png`;
	}),

	class: computed('id', 'year', function() {
		if (this.get('id') === '1129') { // Rastakhan
			return 'current';
		} else if (this.get('year.id') === '3') { // Year of the Raven
			return 'year';
		} else if (this.get('id') === '3') { // Classic
			return 'Classique';
		} else if (this.get('id') === '2') { // Basic
			return 'Basique';
		} else {
			return '';
		}
	})
});
