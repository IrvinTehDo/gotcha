// Constructs and display our list of pokemons for the account
const PokeList = (props) => {
    if(props.pokes.length === 0) {
        return (
            <div className="pokeList">
                <h3 className="emptyPoke">No Pokemons yet</h3>
            </div>
        );
    }
    
    const pokeNodes = props.pokes.map( (poke) => {
        return (
            <div key={poke._id} className="poke">
                <img src={poke.img} alt="Pokeball" className="pokeBall" />
                <h3 className="pokeName"> Name: {poke.name} </h3>
                <h3 className="pokeAge"> Level: {poke.level} </h3>
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
const loadPokesFromServer = () => {
    sendAjax('GET', '/getPokes', null, (data) => {
        ReactDOM.render(
            <PokeList pokes={data.pokes} />, document.querySelector("#pokes")
        );
    });
}

// Renders our list and attempts to fill it up
const renderPokeList = (csrf) => {
    ReactDOM.render(
        <PokeList pokes={[]} />, document.querySelector("#pokes")
    );
    
    loadPokesFromServer();
}

// Page setup. Depending on what tag(s) we have, display and render that page.
const setup = function(csrf, rolls) {
    if(document.querySelector("#pokes")) {
        renderPokeList(csrf);
    }
    if(document.querySelector("#makePoke")){
        renderPokeForm(csrf, rolls);
    }
    if(document.querySelector("#store")){
        renderStore(csrf);
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