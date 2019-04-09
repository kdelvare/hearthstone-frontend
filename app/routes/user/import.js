import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model() {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			decks: this.store.findAll('deck'),
			user: user,
			deckgroups: this.store.findAll('deckgroup'),
			cardsets: this.store.query('cardset', { filter: { collectible: true } })
		});
	}
});
