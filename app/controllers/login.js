import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	session: service(),

	actions: {
		authenticate() {
			const { login, password } = this.getProperties('login', 'password');
			this.get('session').authenticate('authenticator:oauth2', login, password).catch((reason) => {
				this.set('errorMessage', reason.error || reason);
			});
		}
	}
});
