import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';

export default Route.extend({
	queryParams: {
		class: { refreshModel: true },
		cost: { refreshModel: true },
		rarity: { refreshModel: true },
		cardset: { refreshModel: true },
		standard: { refreshModel: true },
		own: { refreshModel: true },
		page: { refreshModel: true }
	},

	currentUser: service(),

	model(params) {
		const user = this.get('currentUser.user');
		let cardFilters = { collectible: true };
		if (params.class) { cardFilters.cardclass = params.class }
		if (params.cost) {
			if (params.cost === '10') {
				cardFilters.tenplus = true
			} else {
				cardFilters.cost = params.cost
			}
		}
		if (params.rarity) { cardFilters.rarity = params.rarity }
		if (params.cardset) { cardFilters.cardset = params.cardset }
		if (params.standard) { cardFilters.standard = true }
		if (params.own) { cardFilters.own = [ params.own, user.id ] }
		let pityFilters = { user: user.id };
		if (params.cardset) { pityFilters.cardset = params.cardset }
		let paginator = {
			number: params.page || 1,
			size: 28
		};
		return RSVP.hash({
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			rarities: this.store.query('rarity', { filter: { collectible: true } }),
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			cards: this.store.query('card', assign(params, {
				filter: cardFilters,
				include: 'rarity,collections,collections.user',
				fields: { collections: 'user,number,completion,golden' },
				sort: 'cost,name_fr',
				page: paginator
			})),
			pitycounters: this.store.query('pitycounter', {
				filter: pityFilters,
				include: 'rarity',
				sort: 'rarity_id'
			}),
			user: user
		});
	},

	resetController(controller, isExiting) {
		if (isExiting) {
			controller.setProperties({
				class: "",
				cost: null,
				rarity: null,
				cardset: null,
				standard: true,
				own: null,
				page: 1
			});
		}
	}
});
