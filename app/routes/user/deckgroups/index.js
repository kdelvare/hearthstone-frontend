import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	queryParams: {
		cardset: { refreshModel: true }
	},

	model(params) {
		const user = this.modelFor('user');
		return RSVP.hash({
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			deckgroups: this.store.query('deckgroup', {
				filter: params.cardset ? { cardset: params.cardset } : {},
				include: 'decks,decks.cardclass,decks.deckcards,decks.deckcards.card,decks.deckcards.card.cardset,decks.deckcards.card.cardclass,decks.deckcards.card.rarity,decks.deckcards.card.collections,decks.deckcards.card.collections.user,decks.wanteddecks.user',
				fields: { decks: 'name', deckcards: 'number', collections: 'number' }
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
