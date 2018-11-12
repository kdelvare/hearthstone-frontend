import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { assign } from '@ember/polyfills';

export default Route.extend({
	queryParams: {
		fullStats: { refreshModel: true },
		standard: { refreshModel: true }
	},

	model(params) {
		const user = this.modelFor('user');
		return RSVP.hash({
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			rarities: this.store.query('rarity', { filter: { collectible: true } }),
			stat: this.store.queryRecord('stat', assign(params, { user: user.id })),
			user: user
		});
	}
});
