import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model(params) {
		const user = this.modelFor('user');
		return RSVP.hash({
			deck: this.store.findRecord('deck', params.deck_id, {
				include: 'deckgroup,cardclass,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.cardset,deckcards.card.cardclass,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user',
				fields: { cardsets: 'name_fr', deckcards: 'number,card', cards: 'cost,atk,health', collections: 'number,user' }
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
