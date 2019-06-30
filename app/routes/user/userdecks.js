import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model() {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			decks: this.store.query('deck', {
				filter: { user: user.id },
				include: 'cardclass,deckstats,deckstats.user',
				fields: { deckstats: 'win,loose,wincasual,loosecasual,user' }
			}),
			user: user
		});
	}
});
