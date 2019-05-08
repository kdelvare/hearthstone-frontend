import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	date: DS.attr('date'),
	archetype: DS.attr('string'),
	score: DS.attr('number'),
	done: DS.attr('boolean'),
	win: DS.attr('number'),

	cardclass: DS.belongsTo(),
	user: DS.belongsTo(),
	arenamatches: DS.hasMany(),
	arenarewards: DS.hasMany(),

	gain: computed('arenarewards', function() {
		const arenarewards = this.get('arenarewards').toArray();
		// Remove pack that could have been bought
		arenarewards.pop(arenarewards.find(arenareward => arenareward.cardset.get('id')));
		const packs = arenarewards.filter((arenareward) => arenareward.cardset.get('id'));
		const cards = arenarewards.filter((arenareward) => arenareward.card.get('id'));
		const dust = arenarewards.reduce((dust, arenareward) => {
			return dust + arenareward.dust;
		}, 0);
		const gold = arenarewards.reduce((gold, arenareward) => {
			return gold + arenareward.gold;
		}, -50); // Remove arena fee and add pack cost

		let gains = [];
		if (packs.length) gains.push(packs.firstObject.text);
		if (cards.length) gains.push(cards.firstObject.text);
		if (dust) gains.push(dust + " poussière");
		gains.push(gold + " or");
		return gains.join(' + ');
	})
});
