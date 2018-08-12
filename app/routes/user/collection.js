import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { assign } from '@ember/polyfills';

export default Route.extend({
	queryParams: {
		class: { refreshModel: true },
		cost: { refreshModel: true },
		cardset: { refreshModel: true }
	},

	model(params) {
		const user = this.modelFor('user');
		return RSVP.hash({
			cardclasses: this.store.query('cardclass', { collectible: true }),
			cardsets: this.store.query('cardset', { collectible: true }),
			cards: this.store.query('card', assign(params, { user: user.id })),
			user: user
		});
	}
});
