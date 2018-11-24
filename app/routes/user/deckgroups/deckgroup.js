import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model(params) {
		const user = this.modelFor('user');
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
