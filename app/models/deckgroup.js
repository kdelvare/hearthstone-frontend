import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	url: DS.attr('string'),

	decks: DS.hasMany(),

	sortedDecks: computed('decks.@each.cardclass', function() {
		return this.get('decks').sortBy('cardclass.id_int');
	})
})
