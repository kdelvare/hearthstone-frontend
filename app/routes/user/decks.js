import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	model() {
		const user = this.modelFor('user');
		return RSVP.hash({
			deckgroups: this.store.findAll('deckgroup'),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
