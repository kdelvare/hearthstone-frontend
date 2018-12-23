import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	name: DS.attr('string'),
	url: DS.attr('string'),

	cardclass: DS.belongsTo(),
	deckcards: DS.hasMany(),
	deckgroup: DS.belongsTo(),
	user: DS.belongsTo(),
	wanteddecks: DS.hasMany(),
	deckstats: DS.hasMany(),

	id_int: computed('id', function() {
		return parseInt(this.get('id'));
	}),

	dust: computed('deckcards.@each.dust', function() {
		const deckcards = this.get('deckcards');
		return deckcards.reduce((value, deckcard) => {
			return value += deckcard.get('dust');
		}, 0);
	}),

	size: computed('deckcards.@each.number', function() {
		const deckcards = this.get('deckcards');
		return deckcards.reduce((value, deckcard) => {
			return value += deckcard.get('number');
		}, 0);
	}),

	sortedDeckcards: computed('deckcards.@each.card', function() {
		return this.get('deckcards').sortBy('card.cost', 'card.name_fr');
	}),

	fullname: computed('name', 'cardclass.name_fr', 'deckgroup.name', 'user.name', function() {
		if (this.get('deckgroup.name')) {
			return `${this.get('cardclass.name_fr')} : ${this.get('name')} (${this.get('deckgroup.name')})`;
		} else {
			return `${this.get('cardclass.name_fr')} : ${this.get('name')} (${this.get('user.name')})`;
		}
	})
});
