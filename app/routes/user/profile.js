import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
	currentUser: service(),

	model(params) {
		return this.get('currentUser.user');
	}
});
