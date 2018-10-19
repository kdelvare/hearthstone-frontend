import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		save() {
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

			this.get('newUser').save().then(newUser => {
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
				this.set('newUser', this.get('store').createRecord('user'));
			});
		}
	}
});
