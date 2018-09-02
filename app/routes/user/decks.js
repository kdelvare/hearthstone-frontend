import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		const user = this.modelFor('user');
		return RSVP.hash({
			decks: this.store.findAll('deck'),
			user: user
		});
	}
});
