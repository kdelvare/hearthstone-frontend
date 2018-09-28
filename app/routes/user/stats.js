import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { assign } from '@ember/polyfills';

export default Route.extend({
	model(params) {
		//const user = this.modelFor('user');
		return this.store.queryRecord('stat', {});
	}
});
