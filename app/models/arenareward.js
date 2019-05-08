import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	gold: DS.attr('number'),
	dust: DS.attr('number'),
	golden: DS.attr('boolean'),

	arena: DS.belongsTo(),
	cardset: DS.belongsTo(),
	card: DS.belongsTo(),

	text: computed('gold', 'dust', 'cardset', 'card', 'golden', function() {
		const gold = this.get('gold');
		if (gold) return gold + " or";
		const dust = this.get('dust');
		if (dust) return dust + " poussière";
		const cardset = this.get('cardset');
		if (cardset) return "1 paquet " + cardset.get('name_fr');
		return "?"
	})
});
