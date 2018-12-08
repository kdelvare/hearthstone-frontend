import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	number: DS.attr('number'),

	deck: DS.belongsTo(),
	card: DS.belongsTo(),

	dust: computed('card', 'number', function() {
		const card = this.get('card');
		const number = this.get('number');
		return number * card.get('creationDust');
	}),

	fulldeck: computed('deck', function() {
		return this.get('deck.fullname');
	})
});
