import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model(params) {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			deckgroup: this.store.findRecord('deckgroup', params.deckgroup_id, {
				include: 'cardset,decks,decks.cardclass,decks.deckcards,decks.deckcards.card,decks.deckcards.card.rarity,decks.deckcards.card.collections,decks.deckcards.card.collections.user,decks.wanteddecks.user',
				fields: { cardsets: 'name_fr', decks: 'name,url,cardclass,deckcards,wanteddecks', deckcards: 'number,card', collections: 'number,user' }
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
