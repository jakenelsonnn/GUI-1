// keep score among games
var score = 0;

// keep track of current tiles
var tilePieces;

// Tiles: Points and Amounts
var tilesData = {
    "pieces": [
        { "letter": "A", "value": 1, "amount": 9 },
        { "letter": "B", "value": 3, "amount": 2 },
        { "letter": "C", "value": 3, "amount": 2 },
        { "letter": "D", "value": 2, "amount": 4 },
        { "letter": "E", "value": 1, "amount": 12 },
        { "letter": "F", "value": 4, "amount": 2 },
        { "letter": "G", "value": 2, "amount": 3 },
        { "letter": "H", "value": 4, "amount": 2 },
        { "letter": "I", "value": 1, "amount": 9 },
        { "letter": "J", "value": 8, "amount": 1 },
        { "letter": "K", "value": 5, "amount": 1 },
        { "letter": "L", "value": 1, "amount": 4 },
        { "letter": "M", "value": 3, "amount": 2 },
        { "letter": "N", "value": 1, "amount": 5 },
        { "letter": "O", "value": 1, "amount": 8 },
        { "letter": "P", "value": 3, "amount": 2 },
        { "letter": "Q", "value": 10, "amount": 1 },
        { "letter": "R", "value": 1, "amount": 6 },
        { "letter": "S", "value": 1, "amount": 4 },
        { "letter": "T", "value": 1, "amount": 6 },
        { "letter": "U", "value": 1, "amount": 4 },
        { "letter": "V", "value": 4, "amount": 2 },
        { "letter": "W", "value": 4, "amount": 2 },
        { "letter": "X", "value": 8, "amount": 1 },
        { "letter": "Y", "value": 4, "amount": 2 },
        { "letter": "Z", "value": 10, "amount": 1 }
    ],
    "creator": "Ramon Meza"
};

$(document).ready(function () {

    // copy the pieces from the data structure (these are our current pieces)
    tilePieces = tilesData.pieces;

    // init score
    score = 0;

    // Function to generate a random number between min (inclusive) and max (exclusive)
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function populateTileHolder() {
        var tileHolder = $('#holder');
        var tileFolder = 'graphics_data/Scrabble_Tiles/';
        var tileExtension = '.jpg';

        var currentTileCount = tileHolder.find('.tile').length;
        var tilesToAdd = 7 - currentTileCount;

        if (tilesToAdd > 0) {
            for (var i = 0; i < tilesToAdd; i++) {
                if (tilePieces.length === 0) {
                    alert('No more tiles available.');
                    break;
                }

                var randomIndex = getRandomNumber(0, tilePieces.length);
                var tile = tilePieces[randomIndex];
                var tileImageSrc = tileFolder + 'Scrabble_Tile_' + tile.letter + tileExtension;
                var tileImageAlt = 'Scrabble Tile ' + tile.letter;

                tileHolder.append('<img src="' + tileImageSrc + '" alt="' + tileImageAlt + '" class="tile" data-value="' + tile.value + '">');

                tilePieces[randomIndex].amount--;

                if (tilePieces[randomIndex].amount === 0) {
                    tilePieces.splice(randomIndex, 1);
                }
            }
        }

        // update the tiles table
        updateTileNumbers();

        tileHolder.find('.tile').draggable({
            containment: 'body',
            revert: function (droppable) {
                if (droppable === false) {
                    return true;
                }
            },
            cursor: 'move'
        });
    }

    // update the score on screen
    function incrementScore(value) {
        score += value;
        $('#score-value').text(score);
    }

    // set the score
    function setScore(value) {
        score = value;
        $('#score-value').text(score);
    }

    // restart the game: refresh the page
    function resetGame() {
        location.reload();
    }

    // Update the table based on the current tiles available
    function updateTileNumbers() {
        var numberRow = $("table#tile-table tr").eq(2);

        numberRow.find("td").each(function (index) {
            var letter = $("table#tile-table tr").eq(0).find("td").eq(index).text();
            var tile = tilePieces.find(function (tile) {
                return tile.letter === letter;
            });

            if (tile) {
                $(this).text(tile.amount);
            } else {
                $(this).text("0"); // Display 0 instead of an empty string
            }
        });
    }

    function resetTiles() {
        // copy the tiles from the original data structure
        tilePieces = JSON.parse(JSON.stringify(tilesData.pieces));
        // reset the table on the page
        updateTileNumbers();
    }


    $('.sub-area').droppable({
        accept: '.tile',
        drop: function (event, ui) {
            var droppedTile = ui.draggable;
            var draggable = ui.draggable;
            var droppable = $(this);

            if (droppable.children('.tile').length === 0) {
                var previousArea = draggable.parent('.sub-area');
                if (previousArea.length > 0 && previousArea[0] !== droppable[0]) {
                    previousArea.append(draggable);
                }

                droppable.append(draggable);

                draggable.css({
                    top: 0,
                    left: 0
                });

                draggable.draggable('disable');
            }
        }
    });

    // Check button event: Validate the entry
    $('#check-btn').click(function () {
        var subAreas = $('.sub-area');
        var tiles = subAreas.children('.tile');
        var tileCount = tiles.length;

        var validPlacement = true;
        var prevSubAreaIndex = -1;
        var currentSubAreaIndex = -1;

        // Check if tiles are placed consecutively in sub-areas
        tiles.each(function () {
            var subAreaIndex = $(this).parent().index();

            if (prevSubAreaIndex === -1) {
                // First tile, set the current sub-area index
                currentSubAreaIndex = subAreaIndex;
            } else if (subAreaIndex !== prevSubAreaIndex + 1) {
                // Tiles are not placed consecutively
                validPlacement = false;
                return false; // Exit the loop
            }

            prevSubAreaIndex = subAreaIndex;
        });

        if (tileCount === 0 || !validPlacement) {
            alert('Invalid tile placement.');
            return;
        }

        var totalValue = 0;

        tiles.each(function () {
            var tileValue = parseInt($(this).data('value'));
            totalValue += tileValue;
        });

        incrementScore(totalValue);
        alert('Consecutive tiles placed. Score: ' + score);
        subAreas.empty();
        populateTileHolder();
    });

    // Reset button event: Reset the game
    $('#reset-btn').click(function () {
        resetGame();
    });

    // init first draw of tiles
    populateTileHolder();
});