'use strict';

var handlePoke = function handlePoke(e) {
    e.preventDefault();

    $("#pokeMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#pokeForm").attr("action"), $("#pokeForm").serialize(), function () {
        sendAjax('GET', '/getRecentCatch', null, function (data) {
            console.dir(data);
            ReactDOM.render(React.createElement(CatchFrame, { 'catch': data.catch }), document.querySelector("#capturedPokemon"));
        });
    });

    return false;
};

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
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'catchPokeSubmit', type: 'submit', value: 'Catch Pokemon' })
    );
};

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
                'No Pokemons yet'
            )
        );
    }
};

var renderPokeForm = function renderPokeForm(csrf) {
    ReactDOM.render(React.createElement(PokeForm, { csrf: csrf }), document.querySelector("#makePoke"));

    ReactDOM.render(React.createElement(CatchFrame, null), document.querySelector("#capturedPokemon"));
};
"use strict";

var PokeList = function PokeList(props) {
    console.dir(props);
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
            )
        );
    });

    return React.createElement(
        "div",
        { className: "pokeList" },
        pokeNodes
    );
};

var loadPokesFromServer = function loadPokesFromServer() {
    sendAjax('GET', '/getPokes', null, function (data) {
        ReactDOM.render(React.createElement(PokeList, { pokes: data.pokes }), document.querySelector("#pokes"));
    });
};

var renderPokeList = function renderPokeList(csrf) {
    ReactDOM.render(React.createElement(PokeList, { pokes: [] }), document.querySelector("#pokes"));

    loadPokesFromServer();
};

var setup = function setup(csrf) {
    if (document.querySelector("#pokes")) {
        renderPokeList(csrf);
    }
    if (document.querySelector("#makePoke")) {
        renderPokeForm(csrf);
    }
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

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
