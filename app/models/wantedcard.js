import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	number: DS.attr('number'),

	user: DS.belongsTo(),
	card: DS.belongsTo(),
	wanteddeck: DS.belongsTo(),

	fulldeck: computed('wanteddeck', function() {
		const wanteddeck = this.get('wanteddeck');
		return wanteddeck.get('id') ? wanteddeck.get('deck.fullname') : "(hors decks)";
	})
});
