'use strict';

// Sends a request to the server that we want to catch 
// a new pokemon and then get the most recent one on the list back.
var handlePoke = function handlePoke(e) {
    e.preventDefault();

    $("#pokeMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#pokeForm").attr("action"), $("#pokeForm").serialize(), function () {
        sendAjax('GET', '/getRecentCatch', null, function (data) {
            console.dir(data);
            ReactDOM.render(React.createElement(CatchFrame, { 'catch': data.catch }), document.querySelector("#capturedPokemon"));
        });
        // Get Catch Page Info, in this case it's just how many pokeballs we have left.
        getCatchPageInfo();
    });

    return false;
};

// Button to request a capture
var PokeForm = function PokeForm(props) {
    return React.createElement(
        'form',
        { id: 'pokeForm',
            onSubmit: handlePoke,
            name: 'pokeForm',
            action: '/catch',
            method: 'POST',
            className: 'pokeForm'
        },
        React.createElement(
            'fieldset',
            null,
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement(
                'button',
                { type: 'submit', className: 'btn btn-info btn-lg btn-block' },
                'Catch Pokemon'
            )
        )
    );
};

// Holds and creates roll count
var RollCount = function RollCount(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h2',
            null,
            'Pokeballs: ',
            props.rolls
        )
    );
};

var FreeRollTimer = function FreeRollTimer(props) {
    console.dir(props);
    var curTime = new Date().getTime();
    var countFrom = Date.parse(props.lastFreePokeaballUsed) + 3600000;
    var length = countFrom - curTime;

    var dateText = "";

    if (length > 0) {
        var h = Math.floor(length % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var m = Math.floor(length % (1000 * 60 * 60) / (1000 * 60));
        dateText = 'Free Pokeball in: ' + h + ' Hours ' + m + ' Min';
    } else {
        dateText = "Free Pokeball is Available";
    }

    return React.createElement(
        'div',
        null,
        React.createElement(
            'h2',
            null,
            dateText
        )
    );
};

//Displays our most recently captured pokemon
var CatchFrame = function CatchFrame(props) {
    if (props.catch) {
        return React.createElement(
            'div',
            { key: props.catch._id, className: 'poke' },
            React.createElement('img', { src: props.catch.img, alt: 'Pokeball', className: 'pokeBall' }),
            React.createElement(
                'h3',
                { className: 'pokeName' },
                ' Name: ',
                props.catch.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'pokeAge' },
                ' Level: ',
                props.catch.level,
                ' '
            )
        );
    } else {
        return React.createElement(
            'div',
            { className: 'pokeList' },
            React.createElement(
                'h3',
                { className: 'emptyPoke' },
                'No Pokemon captured recently'
            )
        );
    }
};

//Requests amount of pokeballs we have left
var getCatchPageInfo = function getCatchPageInfo() {
    sendAjax('GET', '/getCatchPageInfo', null, function (data) {
        ReactDOM.render(React.createElement(
            'section',
            null,
            React.createElement(RollCount, { rolls: data.rolls }),
            React.createElement(FreeRollTimer, { lastFreePokeaballUsed: data.lastFreePokeaballUsed })
        ), document.querySelector("#rollCount"));
    });
};

//Render our page
var renderPokeForm = function renderPokeForm(csrf) {
    ReactDOM.render(React.createElement(PokeForm, { csrf: csrf }), document.querySelector("#makePoke"));

    ReactDOM.render(React.createElement(CatchFrame, null), document.querySelector("#capturedPokemon"));

    getCatchPageInfo();
};
'use strict';

var handleChangePass = function handleChangePass(e) {
  e.preventDefault();

  $('#pokeMessage').animate({ width: 'hide' }, 350);

  if ($('#oldPass').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError('All fields are required');
    return false;
  }

  if ($('#pass').val() !== $('#pass2').val()) {
    handleError('Passwords do no match');
    return false;
  }

  sendAjax('POST', $('#changePasswordForm').attr('action'), $('#changePasswordForm').serialize(), redirect);

  return false;
};

var ChangePassWindow = function ChangePassWindow(props) {
  return React.createElement(
    'form',
    { id: 'changePasswordForm', name: 'changePasswordForm', onSubmit: handleChangePass, action: '/changePassword', method: 'POST', className: 'mainForm' },
    React.createElement(
      'label',
      { 'for': 'oldPass' },
      'Password: '
    ),
    React.createElement('input', { id: 'oldPass', type: 'password', name: 'oldPass', placeholder: 'old password' }),
    React.createElement(
      'label',
      { 'for': 'pass' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'new password' }),
    React.createElement(
      'label',
      { 'for': 'pass2' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype new password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement(
      'button',
      { type: 'submit', className: 'btn btn-primary btn-lg' },
      'Change Password'
    )
  );
};

var renderChangePassWindow = function renderChangePassWindow(csrf) {
  ReactDOM.render(React.createElement(ChangePassWindow, { csrf: csrf }), document.querySelector("#changePassBox"));
};
'use strict';

// Handles the buy requests and sends it to the server
var handleBuy = function handleBuy(amount) {
    $("#pokeMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $('#' + amount + 'buyForm').attr("action"), $('#' + amount + 'buyForm').serialize(), function () {});

    return false;
};

// Construct the form and page
var StorePage = function StorePage(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'form',
            { id: '5buyForm',
                onSubmit: function onSubmit(e) {
                    e.preventDefault();handleBuy(5);
                },
                name: '5buyForm',
                action: '/buyBall',
                method: 'POST',
                className: 'pokeForm'
            },
            React.createElement(
                'fieldset',
                null,
                React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
                React.createElement('input', { type: 'hidden', name: 'amount', value: 5 }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-info btn-lg btn-block' },
                    'Buy 5 Pokeballs $4.99'
                )
            )
        ),
        React.createElement(
            'form',
            { id: '10buyForm',
                onSubmit: function onSubmit(e) {
                    e.preventDefault();handleBuy(10);
                },
                name: '10buyForm',
                action: '/buyBall',
                method: 'POST',
                className: 'pokeForm'
            },
            React.createElement(
                'fieldset',
                null,
                React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
                React.createElement('input', { type: 'hidden', name: 'amount', value: 10 }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-info btn-lg btn-block' },
                    'Buy 10 Pokeballs $8.99'
                )
            )
        ),
        React.createElement(
            'form',
            { id: '15buyForm',
                onSubmit: function onSubmit(e) {
                    e.preventDefault();handleBuy(15);
                },
                name: '15buyForm',
                action: '/buyBall',
                method: 'POST',
                className: 'pokeForm'
            },
            React.createElement(
                'fieldset',
                null,
                React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
                React.createElement('input', { type: 'hidden', name: 'amount', value: 15 }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-info btn-lg btn-block' },
                    'Buy 15 Pokeballs $16.99'
                )
            )
        ),
        React.createElement(
            'form',
            { id: '20buyForm',
                onSubmit: function onSubmit(e) {
                    e.preventDefault();handleBuy(20);
                },
                name: '20buyForm',
                action: '/buyBall',
                method: 'POST',
                className: 'pokeForm'
            },
            React.createElement(
                'fieldset',
                null,
                React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
                React.createElement('input', { type: 'hidden', name: 'amount', value: 20 }),
                React.createElement(
                    'button',
                    { type: 'submit', className: 'btn btn-info btn-lg btn-block' },
                    'Buy 20 Pokeballs $19.99'
                )
            )
        )
    );
};

// Renders the page
var renderStore = function renderStore(csrf) {
    ReactDOM.render(React.createElement(StorePage, { csrf: csrf }), document.querySelector("#store"));
};
"use strict";

// Constructs and display our list of pokemons for the account
var PokeList = function PokeList(props) {
    if (props.pokes.length === 0) {
        return React.createElement(
            "div",
            { className: "pokeList" },
            React.createElement(
                "h3",
                { className: "emptyPoke" },
                "No Pokemons yet"
            )
        );
    }

    var useCandy = function useCandy(pokeId) {
        sendAjax('POST', $("#" + pokeId + "useCandyForm").attr("action"), $("#" + pokeId + "useCandyForm").serialize(), function () {
            renderPokeList(props.csrf);
            renderCandyAmount();
        });

        return false;
    };

    var transferPokemon = function transferPokemon(pokeId) {
        sendAjax('POST', $("#" + pokeId + "transferPokemonForm").attr("action"), $("#" + pokeId + "transferPokemonForm").serialize(), function () {
            renderPokeList(props.csrf);
            renderCandyAmount();
        });

        return false;
    };

    var pokeNodes = props.pokes.map(function (poke) {
        return React.createElement(
            "div",
            { key: poke._id, className: "poke" },
            React.createElement("img", { src: poke.img, alt: "Pokeball", className: "pokeBall" }),
            React.createElement(
                "h3",
                { className: "pokeName" },
                " Name: ",
                poke.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "pokeAge" },
                " Level: ",
                poke.level,
                " "
            ),
            React.createElement(
                "div",
                { id: "pokeForms" },
                React.createElement(
                    "form",
                    { id: poke._id + "useCandyForm",
                        onSubmit: function onSubmit(e) {
                            e.preventDefault();useCandy(poke._id);
                        },
                        name: "useCandyForm",
                        action: "/useCandy",
                        method: "POST",
                        className: "useCandyForm"
                    },
                    React.createElement(
                        "fieldset",
                        null,
                        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                        React.createElement("input", { type: "hidden", name: "pokeId", value: poke._id }),
                        React.createElement(
                            "button",
                            { type: "submit", className: "btn btn-info btn-sm btn-block" },
                            "Use Rare Candy"
                        )
                    )
                ),
                React.createElement(
                    "form",
                    { id: poke._id + "transferPokemonForm",
                        onSubmit: function onSubmit(e) {
                            e.preventDefault();transferPokemon(poke._id);
                        },
                        name: "transferPokemonForm",
                        action: "/transferPokemon",
                        method: "POST",
                        className: "transferPokemonForm"
                    },
                    React.createElement(
                        "fieldset",
                        null,
                        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                        React.createElement("input", { type: "hidden", name: "pokeId", value: poke._id }),
                        React.createElement(
                            "button",
                            { type: "submit", className: "btn btn-info btn-sm btn-block" },
                            "Transfer Pokemon"
                        )
                    )
                )
            )
        );
    });

    return React.createElement(
        "div",
        { className: "pokeList" },
        pokeNodes
    );
};

// Requests pokemons from the server
var loadPokesFromServer = function loadPokesFromServer(csrf) {
    sendAjax('GET', '/getPokes', null, function (data) {
        ReactDOM.render(React.createElement(PokeList, { pokes: data.pokes, csrf: csrf }), document.querySelector("#pokes"));
    });
};

// Renders our list and attempts to fill it up
var renderPokeList = function renderPokeList(csrf) {
    ReactDOM.render(React.createElement(PokeList, { pokes: [], csrf: csrf }), document.querySelector("#pokes"));

    loadPokesFromServer(csrf);
};

var CandyAmount = function CandyAmount(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            null,
            "Rare Candy Amount: ",
            props.candy
        )
    );
};

var renderCandyAmount = function renderCandyAmount() {
    try {
        sendAjax('GET', '/getCandyAmount', null, function (data) {
            console.dir(data);
            ReactDOM.render(React.createElement(CandyAmount, { candy: data.candy }), document.querySelector("#candy"));
        });
    } catch (e) {
        console.log(e);
    }
};

// Page setup. Depending on what tag(s) we have, display and render that page.
var setup = function setup(csrf, rolls) {
    if (document.querySelector("#pokes")) {
        renderPokeList(csrf);
    }
    if (document.querySelector("#candy")) {
        renderCandyAmount();
    }
    if (document.querySelector("#makePoke")) {
        renderPokeForm(csrf, rolls);
    }
    if (document.querySelector("#store")) {
        renderStore(csrf);
    }
    if (document.querySelector("#changePassBox")) {
        renderChangePassWindow(csrf);
    }
};

// Grab our csrf token
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

// When page is ready, grab token
$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#pokeMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#pokeMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
