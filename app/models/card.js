import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
	hs_card_id: DS.attr('string'),
	name: DS.attr('string'),
	name_fr: DS.attr('string'),
	cardtext: DS.attr('string'),
	cardtext_fr: DS.attr('string'),
	cost: DS.attr('number'),
	health: DS.attr('number'),
	atk: DS.attr('number'),

	cardset: DS.belongsTo(),
	cardclass: DS.belongsTo(),
	rarity: DS.belongsTo(),
	collections: DS.hasMany(),
	wantedcards: DS.hasMany(),

	image: computed('hs_card_id', function() {
		const LOCALE = 'frFR';
		const RESOLUTION = '256x';
		const CARD_ID = this.get('hs_card_id');
		const EXT = 'png';
		return `https://art.hearthstonejson.com/v1/render/latest/${LOCALE}/${RESOLUTION}/${CARD_ID}.${EXT}`;
	}),

	dust: computed('rarity', function() {
		return this.get('rarity.dust');
	})
});
