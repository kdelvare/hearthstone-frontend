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
		let deckgroupFilters = {};
		let deckFilters = { user: user.id };
		if (params.class) { deckgroupFilters.cardclass = params.class; deckFilters.cardclass = params.class; }
		if (params.cardset) { deckgroupFilters.cardset = params.cardset }
		return RSVP.hash({
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			deckgroups: this.store.query('deckgroup', {
				filter: deckgroupFilters,
				sort: 'name',
				include: 'decks,decks.cardclass,decks.deckcards,decks.deckcards.card,decks.deckcards.card.rarity,decks.deckcards.card.collections,decks.deckcards.card.collections.user,decks.wanteddecks.user',
				fields: { decks: 'name,url,cardclass,deckcards,wanteddecks', deckcards: 'number,card', collections: 'number,user' }
			}),
			decks: this.store.query('deck', {
				filter: deckFilters,
				include: 'cardclass,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user,deckstats,deckstats.user',
				fields: { deckcards: 'number,card', collections: 'number,user', deckstats: 'win,loose,wincasual,loosecasual,user' }
			}),
			user: user
		});
	}
});
