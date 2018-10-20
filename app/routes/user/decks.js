import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		const user = this.modelFor('user');
		return RSVP.hash({
			deckgroups: this.store.findAll('deckgroup', {
				include: 'decks,decks.cardclass,decks.deckcards,decks.deckcards.card,decks.deckcards.card.cardset,decks.deckcards.card.cardclass,decks.deckcards.card.rarity,decks.deckcards.card.collections,decks.deckcards.card.collections.user,decks.wanteddecks.user',
				fields: { decks: 'name', deckcards: 'number', collections: 'number' }
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
