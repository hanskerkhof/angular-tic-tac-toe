const getIframeDocument = (id) => {
    return cy
        .get('iframe[data-cy="' + id + '"]')
        // Cypress yields jQuery element, which has the real
        // DOM element under property "0".
        // From the real DOM iframe element we can get
        // the "document" element, it is stored in "contentDocument" property
        // Cypress "its" command can access deep properties using dot notation
        // https://on.cypress.io/its
        .its('0.contentDocument').should('exist')
}

const getIframeBody = (id) => {
    // get the document
    return getIframeDocument(id)
        // automatically retries until body is loaded
        .its('body').should('not.be.undefined')
        // wraps "body" DOM element to allow
        // chaining more Cypress commands, like ".find(...)"
        .then(cy.wrap)
}

const play2PlayerScenario = (scenario) => {
    console.log(scenario);
    const gamesId = ['game-one', 'game-two'];
    scenario.forEach((tile, idx) => {
        getIframeBody(gamesId[idx % 2])
            .find('[data-test=player-name-' + idx % 2 + ']')
            .should('contain', 'TURN');
        getIframeBody(gamesId[idx % 2])
            .find('[data-test=' + tile + ']')
            .should('not.have.text', 'O')
            .click()
    });
    getIframeBody('game-one').find('#moves').should('contain', scenario.length);
    getIframeBody('game-two').find('#moves').should('contain', scenario.length);
}

before(() => {
    cy.visit('/index-three.html');
});

beforeEach(() => {
    cy.viewport(1600, 600);
    // setup game
    ['game-one', 'game-two'].forEach((gameId, idx) => {
        if (idx===0) {
            getIframeBody(gameId).find('[data-test=btn-new-game]').should('have.text', 'New Game').click()
        }
        getIframeBody(gameId).find('#playerName').clear().type('player ' + gameId);
        getIframeBody(gameId).find('[data-test=btn-join-game]').should('have.text', 'Join game').click()
    })
})

it('Game win player one', () => {
    play2PlayerScenario(['0-0', '0-1', '1-0', '1-1', '2-0']);
    getIframeBody('game-one').find('#winner').should('have.text', 'player game-one wins!');
});

it('Game win player two', () => {
    play2PlayerScenario(['0-1', '0-0', '2-1', '1-1', '2-0', '2-2']);
    getIframeBody('game-two').find('#winner').should('have.text', 'player game-two wins!');
});

it('Game draw', () => {
    play2PlayerScenario(['0-0', '1-1', '0-1', '0-2', '2-0', '1-0', '1-2', '2-2', '2-1']);
    getIframeBody('game-one').find('#draw').should('have.text', 'It\'s a draw');
});
