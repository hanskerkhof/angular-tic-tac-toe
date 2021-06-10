const getIframeDocument = (id) => {
    return cy.get('iframe[data-cy="' + id + '"]')
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
    scenario.forEach((tile: string, idx: number) => {
        getIframeBody(gamesId[idx % 2])
            .find('[data-test=player-name-' + idx % 2 + ']')
            .should('contain', 'TURN');
        getIframeBody(gamesId[idx % 2])
            .find('[data-test=' + tile + ']')
            .click();
        getIframeBody(gamesId[idx % 2])
            .find('[data-test=' + tile + ']')
            .should('have.css', 'background')
            .and('include', 'data:image/svg+xml;base64');
        cy.wait(300);
    });
    getIframeBody('game-one').find('#moves').should('contain', scenario.length);
    getIframeBody('game-two').find('#moves').should('contain', scenario.length);
    getIframeBody('game-three').find('#moves').should('contain', scenario.length);
}

before(() => {
    // cy.readFile('cypress/fixtures/tic-tac-toe copy.data.txt', 'latin1').then((txt) => {
    //     // console.log(txt);
    //     const lines = txt.split('\n');
    //     // console.log(lines);
    //     lines.forEach((line: string) => {
    //         const scenarios: any = [];
    //         const moves: any = [];
    //         if (line) {
    //             console.log('line', line);
    //             const s = line.split(',');
    //             // console.log(s);
    //             let x = 0;
    //             let y = 0;
    //             let start: any = null;
    //             const scenario: any = [];
    //             s.forEach((tile, idx) => {
    //                 // console.log('tile', tile);
    //                 if(tile !== 'b' && tile !== 'negative' && tile !== 'positive'){
    //                     if(!start){ start = tile; }
    //                     if(idx >= 4 ) { x = 1; y = 0;}
    //                     if(idx >= 7 ) { x = 2; y = 0;}
    //                     // console.log('start', start);
    //                     moves.push(`${x}-${y++}`);
    //                 }
    //             })
    //             console.log('start', start);
    //             scenario.push({ start: start, moves: moves});
    //             console.log('scenario', scenario);
    //             scenarios.push(scenario);
    //         }
    //     });
    //     // logo will be encoded as base64
    //     // and should look something like this:
    //     // aIJKnwxydrB10NVWqhlmmC+ZiWs7otHotSAAAOw==...
    // });

    if (Cypress.env('env')==='remote') {
        Cypress.config({
            defaultCommandTimeout: 10000,
        });
        cy.visit('/index-remote.html');
    } else {
        cy.visit('/');
    }
});

beforeEach(() => {
    cy.viewport(1600, 900);
    // setup game
    ['game-one', 'game-two'].forEach((gameId, idx) => {

        if (idx===0) {
            getIframeBody(gameId)
                .find('[data-test=btn-new-game]')
                .should('contain', 'New Game')
                .click();

            getIframeBody(gameId)
                .find('.game-messages')
                .should('contain', 'WAITING FOR PLAYERS TO JOIN');
        }

        getIframeBody(gameId)
            .find('#playerName')
            .clear()
            .type('' + gameId);

        getIframeBody(gameId)
            .find('[data-test=btn-join-game]')
            .should('contain', 'Join game')
            .click()
    })

    getIframeBody('game-three')
        .find('.game-messages')
        .should('contain', 'SPECTATING THE GAME');
})

it('Should win player one', () => {
    play2PlayerScenario(['0-0', '0-1', '1-0', '1-1', '2-0']);
    getIframeBody('game-one').find('#winner').should('contain', 'game-one wins!');
    getIframeBody('game-one').find('#winner')
        .find('img')
        .should('have.attr', 'src')
        .should('include', 'nought');
    getIframeBody('game-two')
        .find('#winner')
        .find('img')
        .should('have.attr', 'src')
        .should('include', 'nought');
    cy.wait(600);
});

it('Should win player two', () => {
    play2PlayerScenario(['0-1', '0-0', '2-1', '1-1', '2-0', '2-2']);
    getIframeBody('game-two').find('#winner').should('contain', 'game-two wins!');
    getIframeBody('game-one').find('#winner')
        .find('img')
        .should('have.attr', 'src')
        .should('include', 'cross');
    getIframeBody('game-two').find('#winner')
        .find('img')
        .should('have.attr', 'src')
        .should('include', 'cross');
    cy.wait(600);
});

it('Should end in draw', () => {
    play2PlayerScenario(['0-0', '1-1', '0-1', '0-2', '2-0', '1-0', '1-2', '2-2', '2-1']);
    getIframeBody('game-one')
        .find('#draw')
        .should('contain', 'It\'s a draw!');
    cy.wait(600);
});

it('Should handle an unfinished game', () => {
    play2PlayerScenario(['0-0', '1-1', '0-1', '1-0']);
    // getIframeBody('game-one')
    //     .find('#draw')
    // .should('contain', 'It\'s a draw!');
    cy.wait(600);
});

it('Should handle an not joined game', () => {
    cy.viewport(1600, 900);
    getIframeBody('game-one')
        .find('[data-test=btn-new-game]')
        .should('contain', 'New Game')
        .click();

    getIframeBody('game-one')
        .find('.game-messages')
        .should('contain', 'WAITING FOR PLAYERS TO JOIN');

    getIframeBody('game-one')
        .find('#playerName')
        .clear()
        .type('' + 'game-one');

    getIframeBody('game-one')
        .find('[data-test=btn-join-game]')
        .should('contain', 'Join game')
        .click();
    cy.wait(600);
});
