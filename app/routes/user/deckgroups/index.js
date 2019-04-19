import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	queryParams: {
		cardset: { refreshModel: true }
	},

	currentUser: service(),

	model(params) {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			deckgroups: this.store.query('deckgroup', {
				filter: params.cardset ? { cardset: params.cardset } : {},
				sort: 'name',
				include: 'decks,decks.cardclass,decks.deckcards,decks.deckcards.card,decks.deckcards.card.rarity,decks.deckcards.card.collections,decks.deckcards.card.collections.user,decks.wanteddecks.user',
				fields: { decks: 'name,url,cardclass,deckcards,wanteddecks', deckcards: 'number,card', collections: 'number,user' }
			}),
			decks: this.store.query('deck', {
				filter: { user: user.id },
				include: 'cardclass,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user,deckstats,deckstats.user',
				fields: { deckcards: 'number,card', collections: 'number,user', deckstats: 'win,loose,wincasual,loosecasual,user' }
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
