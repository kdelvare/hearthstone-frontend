import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
	currentUser: service(),

	beforeModel() {
		console.log('application-beforeModel');
		return this._loadCurrentUser();
	},

	sessionAuthenticated() {
		console.log('application-sessionAuthenticated', this.get('session').session);
		this._super(...arguments);
		this._loadCurrentUser();
	},

	_loadCurrentUser() {
		console.log('application-_loadCurrentUser');
		return this.get('currentUser').load().catch(() => this.get('session').invalidate());
	}
});
