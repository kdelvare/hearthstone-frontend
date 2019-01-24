import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	queryParams: {
		cardset: { refreshModel: true },
		class: { refreshModel: true }
	},

	currentUser: service(),

	model(params) {
		const user = this.get('currentUser.user');
		let deckFilters = {};
		if (params.cardset) { deckFilters.cardset = params.cardset }
		if (params.class) { deckFilters.cardclass = params.class }
		return RSVP.hash({
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			decks: this.store.query('deck', {
				filter: deckFilters,
				include: 'deckgroup,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user',
				fields: { deckcards: 'number,card', collections: 'number,user' },
				sort: 'deckgroup.id'
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
