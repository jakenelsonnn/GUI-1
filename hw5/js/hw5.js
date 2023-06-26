$(document).ready(function () {

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

    // copy the pieces from the data structure (these are our current pieces)
    var tilePieces = tilesData.pieces;

    // Function to generate a random number between min (inclusive) and max (exclusive)
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Function to initially populate the Tile Holder with random Scrabble Tiles
    function populateTileHolder() {
        var tileHolder = $('#holder');
        var tileFolder = 'graphics_data/Scrabble_Tiles/';
        var tileExtension = '.jpg';

        for (var i = 0; i < 7; i++) {
            var randomIndex = getRandomNumber(0, tilePieces.length);
            var tile = tilePieces[randomIndex];
            var tileImageSrc = tileFolder + 'Scrabble_Tile_' + tile.letter + tileExtension;
            var tileImageAlt = 'Scrabble Tile ' + tile.letter;

            tileHolder.append('<img src="' + tileImageSrc + '" alt="' + tileImageAlt + '" class="tile">');

            tilePieces[randomIndex].amount--;

            // Remove the tile from the array if the amount becomes 0
            if (tilePieces[randomIndex].amount === 0) {
                tilePieces.splice(randomIndex, 1);
            }
        }

        // Make the tiles draggable
        tileHolder.find('.tile').draggable({
            containment: 'body',
            revert: function (droppable) {
                // Check if the tile was dropped into a droppable area
                if (droppable === false) {
                    // Revert the tile to its original position
                    return true;
                }
            },
            cursor: 'move'
        });

        // Make the sub-areas droppable
        $('.sub-area').droppable({
            accept: '.tile',
            drop: function (event, ui) {
                var droppedTile = ui.draggable;
                var draggable = ui.draggable;
                var droppable = $(this);

                // Check if the sub-area already has a tile
                if (droppable.children('.tile').length === 0) {
                    // Remove item from previous area if any
                    var previousArea = draggable.parent('.sub-area');
                    if (previousArea.length > 0 && previousArea[0] !== droppable[0]) {
                        previousArea.append(draggable);
                    }

                    // Append item to the current area
                    droppable.append(draggable);

                    // Adjust item position inside the area
                    draggable.css({
                        top: 0,
                        left: 0
                    });

                    // Disable dragging for the tile once it is placed in a sub-area
                    draggable.draggable('disable');
                }
            }
        });
    }

    // populate the Tile Holder
    populateTileHolder();
});