(function () {
    'use strict';

    describe('Hunger Crunch Tournament Backend', function() {
        describe('Data aggregator', function() {
            it('should be able to total all coins', function() {

            });

            it('should be able to total all minions', function() {

            });

            it('should be able to total all collectibles', function() {

            });

            it('should be able to total all meals provided', function() {

            });

            it('should be able to total all coins within a given group', function() {

            });

            it('should be able to total all minions within a given group', function() {

            });

            it('should be able to total all collectibles within a given group', function() {

            });

            it('should be able to total all meals provided within a given group', function() {

            });
        });

        describe('Group creator', function() {
            it('should be able to fetch all data in the Groups class', function() {
                var groups = new GroupCollection();

                populateCollection(groups).done(function() {
                    expect(groups).to.have.length.above(0);
                });
            });

            it('should be able to randomly generate a five-character group ID', function() {
                var strGroupID;
                var groupView = new CreateGroupView();

                for (var i = 0; i <= 1000; i += 1) {
                    strGroupID = groupView.generateRandomGroupdID();

                    expect(strGroupID.length).to.equal(4);
                }
            });

            it('should be able to randomly generate a group ID consisting only of lowercase alpha characters', function() {
                var strGroupID;
                var cCurrentCharacter;
                var numCurrentCharacterCode;
                var groupView = new CreateGroupView();

                for (var i = 0; i <= 1000; i += 1) {
                    strGroupID = groupView.generateRandomGroupdID();

                    for (var j = 0; j <= 4; j += 1) {
                        cCurrentCharacter = strGroupID[j];
                        numCurrentCharacterCode = cCurrentCharacter.charCodeAt();

                        expect(numCurrentCharacterCode).to.be.within(120, 122);
                    }
                }
            });

            it('should be able to verify that a group ID doesn\'t already exist in the Groups class', function() {

            });
        });
    });
})();
