import DS from 'ember-data';
import { computed } from '@ember/object';
import { all } from 'rsvp';

export default DS.Model.extend({
	name: DS.attr('string'),
	url: DS.attr('string'),

	cardclass: DS.belongsTo(),
	deckcards: DS.hasMany(),

	id_int: computed('id', function() {
		return parseInt(this.get('id'));
	}),

	dust: computed('deckcards.@each.dust', function() {
		const deckcards = this.get('deckcards');
		return deckcards.reduce((value, deckcard) => {
			return value += deckcard.get('dust');
		}, 0);
	}),

	sortedDeckcards: computed('deckcards.@each.card', function() {
		return this.get('deckcards').sortBy('card.cost', 'card.name_fr');
	})
});
