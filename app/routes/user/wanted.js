import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model() {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			wantedcards: this.store.query('wantedcard', {
				filter: { user: user.id },
				include: 'card,card.cardset,card.deckcards,card.deckcards.deck,card.deckcards.deck.cardclass,card.deckcards.deck.deckgroup,' +
					'wanteddeck,wanteddeck.deck,wanteddeck.deck.cardclass,wanteddeck.deck.deckgroup'
			}),
			user: user
		});
	}
});
