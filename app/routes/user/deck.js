import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model(params) {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			deck: this.store.findRecord('deck', params.deck_id, {
				reload: true,
				include: 'user,deckgroup,cardclass,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.cardset,deckcards.card.cardset.year,deckcards.card.cardclass,deckcards.card.type,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user,deckstats,deckstats.user',
				fields: { users: 'name', cardsets: 'name_fr,year', deckcards: 'number,card', cards: 'cost,atk,health', collections: 'number,user', deckstats: 'win,loose,wincasual,loosecasual' }
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			rarities: this.store.query('rarity', { filter: { collectible: true } }),
			user: user,
			users: this.store.findAll('user'),
			deckgroups: this.store.findAll('deckgroup'),
		});
	}
});
