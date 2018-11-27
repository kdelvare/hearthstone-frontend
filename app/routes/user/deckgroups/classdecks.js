import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	queryParams: {
		cardset: { refreshModel: true },
		class: { refreshModel: true }
	},

	model(params) {
		const user = this.modelFor('user');
		let deckFilters = {};
		if (params.cardset) { deckFilters.cardset = params.cardset }
		if (params.class) { deckFilters.cardclass = params.class }
		return RSVP.hash({
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			decks: this.store.query('deck', {
				filter: deckFilters,
				include: 'deckgroup,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user',
				fields: { deckcards: 'number,card', collections: 'number,user' }
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
