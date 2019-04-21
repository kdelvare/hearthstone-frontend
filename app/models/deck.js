import DS from 'ember-data';
import { computed } from '@ember/object';
import { encode } from 'deckstrings';

export default DS.Model.extend({
	name: DS.attr('string'),
	url: DS.attr('string'),
	deckstring: DS.attr('string'),

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
	}),

	exportString: computed('cardclass', 'deckcards.@each.{number,card}', function() {
		const heroes = [0, 0, 274, 31, 637, 671, 813, 930, 1066, 893, 7];
		const cardclass = this.get('cardclass');
		const hero = heroes[cardclass.get('id')];

		const deckcards = this.get('deckcards');
		const cards = [];
		deckcards.forEach(deckcard => {
			cards.push([parseInt(deckcard.card.get('id')), deckcard.number]);
		});

		const deckStructure = {
			format: 2, // 1 pour Libre
			heroes: [hero],
			cards: cards
		}
		return encode(deckStructure);
	}),
});
