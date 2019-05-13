import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model(params) {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			deck1: this.store.findRecord('deck', params.deck_id1, {
				reload: true,
				include: 'user,deckgroup,cardclass,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.cardset,deckcards.card.cardset.year,deckcards.card.cardclass,deckcards.card.type,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user,deckstats,deckstats.user',
				fields: { users: 'name', cardsets: 'name_fr,year', deckcards: 'number,card', cards: 'cost,atk,health', collections: 'number,user', deckstats: 'win,loose,wincasual,loosecasual' }
			}),
			deck2: this.store.findRecord('deck', params.deck_id2, {
				reload: true,
				include: 'user,deckgroup,cardclass,deckcards,deckcards.card,deckcards.card.rarity,deckcards.card.cardset,deckcards.card.cardset.year,deckcards.card.cardclass,deckcards.card.type,deckcards.card.collections,deckcards.card.collections.user,wanteddecks.user,deckstats,deckstats.user',
				fields: { users: 'name', cardsets: 'name_fr,year', deckcards: 'number,card', cards: 'cost,atk,health', collections: 'number,user', deckstats: 'win,loose,wincasual,loosecasual' }
			}),
			user: user
		});
	}
});
