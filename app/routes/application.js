import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
	queryParams: {
		class: { refreshModel: true },
		cost: { refreshModel: true },
		cardset: { refreshModel: true }
	},

	model(params) {
		return RSVP.hash({
			cardclasses: this.store.query('cardclass', { collectible: true }),
			cardsets: this.store.query('cardset', { collectible: true }),
			cards: this.store.query('card', params)
		});
	}
});
