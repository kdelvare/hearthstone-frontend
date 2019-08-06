import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	session: service(),
	currentUser: service(),


	actions: {
		authenticate() {
			const { login, password } = this.getProperties('login', 'password');
			this.get('session').authenticate('authenticator:oauth2', login, password).then(() => {
				this.get('currentUser').load().then(() => {
					this.transitionToRoute('user.userdecks');
				})
			}).catch((reason) => {
				this.set('errorMessage', reason.error || reason);
			});
		}
		/*save() {
			const levelCards = [823, 742, 467, 64, 205, // Druid
				437, 1241, 141, 699, 296, // Hunter
				662, 1084, 587, 395, 1004, // Mage
				847, 476, 854, 1068, 943, // Paladin
				1361, 1099, 841, 1363, 8, // Priest
				421, 667, 573, 196, 630, // Rogue
				1171, 1008, 830, 178, 189, // Shaman
				982, 1092, 974, 163, 1019, // Warlock
				940, 28, 636, 1023, 304 // Warrior
			];

			const newUser = this.get('store').createRecord('user', this.get('newUser'));
			newUser.save().then(newUser => {
				const initCollection = this.get('initCollection');
				if (initCollection !== 'empty') {
					this.get('store').query('card', { filter: { collectible: true, cardset: 2 } }).then(basicCards => {
						basicCards.forEach(basicCard => {
							// 'basic' = all basic cards, 'start' = all basic cards except levelCards
							if (initCollection === 'basic' || !levelCards.includes(parseInt(basicCard.id))) {
								const collection = this.get('store').createRecord('collection', {
									card: basicCard,
									user: newUser,
									number: 2
								});
								collection.save();
							}
						});
					});
				}
				this.set('newUser', {});
			});
		}*/
	}
});
