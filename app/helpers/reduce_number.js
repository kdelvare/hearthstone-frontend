import ReduceHelper from 'ember-composable-helpers/helpers/reduce';
import { defineProperty } from '@ember/object';
import { get } from '@ember/object';
import { observer } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';

export default ReduceHelper.extend({
	callbackDidChange: observer('callback', 'initialValue', function() {
		let callback = get(this, 'callback');
		let initialValue = get(this, 'initialValue');

		if (isEmpty(callback)) {
			defineProperty(this, 'content', []);
			return;
		}

		let cp = computed('array.{[],@each.number}', () => {
			let array = get(this, 'array');
			return array.reduce(callback, initialValue);
		});

		defineProperty(this, 'content', cp);
	})
});
