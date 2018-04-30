// Constructs and display our list of pokemons for the account
const PokeList = (props) => {
    if(props.pokes.length === 0) {
        return (
            <div className="pokeList">
                <h3 className="emptyPoke">No Pokemons yet</h3>
            </div>
        );
    }
    
    const useCandy = (pokeId) => {
        sendAjax('POST', $(`#${pokeId}useCandyForm`).attr("action"), $(`#${pokeId}useCandyForm`).serialize(), () => {
            renderPokeList(props.csrf);
            renderCandyAmount();
        });
        
        return false;
    };
    
    const transferPokemon = (pokeId) => {
        sendAjax('POST', $(`#${pokeId}transferPokemonForm`).attr("action"), $(`#${pokeId}transferPokemonForm`).serialize(), () => {
            renderPokeList(props.csrf);
            renderCandyAmount();
        });
        
        return false;
    };
    
    const pokeNodes = props.pokes.map( (poke) => {
        return (
            <div key={poke._id} className="poke">
                <img src={poke.img} alt="Pokeball" className="pokeBall" />
                <h3 className="pokeName"> Name: {poke.name} </h3>
                <h3 className="pokeAge"> Level: {poke.level} </h3>
                <div id="pokeForms">
                <form id={poke._id+"useCandyForm"}
                    onSubmit={(e) => {e.preventDefault(); useCandy(poke._id);} }
                    name="useCandyForm"
                    action="/useCandy"
                    method="POST"
                    className="useCandyForm"
                >
                <fieldset>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="pokeId" value={poke._id} />   
                <button type="submit" className="btn btn-info btn-sm btn-block">Use Rare Candy</button>
                </fieldset>
                </form>
                <form id={poke._id+"transferPokemonForm"}
                    onSubmit={(e) => {e.preventDefault(); transferPokemon(poke._id);} }
                    name="transferPokemonForm"
                    action="/transferPokemon"
                    method="POST"
                    className="transferPokemonForm"
                >
                <fieldset>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="pokeId" value={poke._id} />   
                <button type="submit" className="btn btn-info btn-sm btn-block">Transfer Pokemon</button>
                </fieldset>
                </form>
                    </div>
            </div>
        ); 
    });
    
    return (
    <div className="pokeList">
            {pokeNodes}
        </div>
    );
};

// Requests pokemons from the server
const loadPokesFromServer = (csrf) => {
    sendAjax('GET', '/getPokes', null, (data) => {
        ReactDOM.render(
            <PokeList pokes={data.pokes} csrf={csrf} />, document.querySelector("#pokes")
        );
    });
};

// Renders our list and attempts to fill it up
const renderPokeList = (csrf) => {
    ReactDOM.render(
        <PokeList pokes={[]} csrf={csrf}/>, document.querySelector("#pokes")
    );
    
    loadPokesFromServer(csrf);
}

const CandyAmount = (props) => {
        return (
        <div>
            <h2>Rare Candy Amount: {props.candy}</h2>
        </div>
    );
};

const renderCandyAmount = () => {
    try {
        sendAjax('GET', '/getCandyAmount', null, (data) => {
        console.dir(data);
        ReactDOM.render(
            <CandyAmount candy={data.candy}/>, document.querySelector("#candy")
        );
    });
    }
 catch (e) {
    console.log(e);
}
}

// Page setup. Depending on what tag(s) we have, display and render that page.
const setup = function(csrf, rolls) {
    if(document.querySelector("#pokes")) {
        renderPokeList(csrf);
    }
    if(document.querySelector("#candy")) {
        renderCandyAmount();
    }
    if(document.querySelector("#makePoke")){
        renderPokeForm(csrf, rolls);
    }
    if(document.querySelector("#store")){
        renderStore(csrf);
    }
    if(document.querySelector("#changePassBox")){
        renderChangePassWindow(csrf);
    }
};

// Grab our csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// When page is ready, grab token
$(document).ready(function() {
    getToken();
});