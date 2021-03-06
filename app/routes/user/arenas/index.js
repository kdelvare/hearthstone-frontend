import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model() {
		const user = this.get('currentUser.user');
		return RSVP.hash({
			arenas: this.store.query('arena', {
				filter: { user: user.id },
				include: 'cardclass,arenamatches,arenamatches.cardclass,arenarewards,arenarewards.cardset,arenarewards.card'
			}),
			cardclasses: this.store.query('cardclass', { filter: { collectible: true } }),
			user: user
		});
	}
});
