import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
	latest: computed('model', function() {
		return this.get('model').lastObject.id;
	})
});
