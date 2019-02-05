import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';

export default Route.extend({
	queryParams: {
		fullStats: { refreshModel: true },
		standard: { refreshModel: true }
	},

	currentUser: service(),

	model(params) {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			years: this.store.query('year', { filter: params.standard ? { standard: params.standard } : {}, include: 'cardsets' }),
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			rarities: this.store.query('rarity', { filter: { collectible: true } }),
			stat: this.store.queryRecord('stat', assign(params, { user: user.id })),
			pitycounters: this.store.query('pitycounter', { filter: { user: user.id }, include: 'rarity,cardset', sort: 'rarity_id'	}),
			user: user
		});
	}
});
