import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model() {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			cardsets: this.store.query('cardset', { filter: { collectible: true } }),
			rarities: this.store.query('rarity', { filter: { collectible: true } }),
			pitycounters: this.store.query('pitycounter', { filter: { user: user.id }, include: 'rarity,cardset', sort: 'rarity_id' }),
			packs: this.store.query('pack', { filter: { user: user.id }}),
			user: user
		});
	}
});
