import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
	location: config.locationType,
	rootURL: config.rootURL
});

Router.map(function() {
	this.route('decks');
	this.route('deck', { path: '/decks/:id' });
	this.route('user', { path: '/users/:id' }, function() {
		this.route('collection');
		this.route('missing');
		this.route('wanted');
		this.route('decks', function() {
			this.route('deck', { path: '/:deck_id' });
		});
		this.route('stats');
	})
});

export default Router;
