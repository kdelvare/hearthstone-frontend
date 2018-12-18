import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model(params) {
		const user = this.modelFor('user');
		return RSVP.hash({
			deck: this.store.findRecord('deck', params.deck_id, {
				reload: true,
				include: 'user,deckgroup,cardclass,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.cardset,deckcards.card.cardset.year,deckcards.card.cardclass,deckcards.card.type,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user,deckstats,deckstats.user',
				fields: { users: 'name', cardsets: 'name_fr,year', deckcards: 'number,card', cards: 'cost,atk,health', collections: 'number,user', deckstats: 'win,loose' }
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			rarities: this.store.query('rarity', { filter: { collectible: true } }),
			user: user
		});
	}
});
