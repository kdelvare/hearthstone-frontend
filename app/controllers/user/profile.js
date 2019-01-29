import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	session: service(),

	actions: {
		saveName() {
			this.get('model').save();
		},

		invalidateSession() {
			this.get('session').invalidate();
		}
	}
});
