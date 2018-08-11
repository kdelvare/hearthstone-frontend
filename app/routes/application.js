import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	queryParams: {
		class: { refreshModel: true },
		cost: { refreshModel: true }
	},

	model(params) {
		return RSVP.hash({
			cardclasses: this.store.query('cardclass', { collectible: true }),
			cards: this.store.query('card', params)
		});
	}
});
