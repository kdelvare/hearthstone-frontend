import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	session: service(),
	currentUser: service(),

	actions: {
		authenticate() {
			console.log('login-authenticate');
			const { login, password } = this.getProperties('login', 'password');
			this.get('session').authenticate('authenticator:oauth2', login, password).then(() => {
				this.get('currentUser').load().then(() => {
					this.transitionToRoute('user.collection');
				})
			}).catch((reason) => {
				this.set('errorMessage', reason.error || reason);
			});
		}
	}
});
