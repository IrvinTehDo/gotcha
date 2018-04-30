// Constructs and display our list of pokemons for the account
const PokeList = (props) => {
    if(props.pokes.length === 0) {
        return (
            <div className="pokeList">
                <h3 className="emptyPoke">No Pokemons yet</h3>
            </div>
        );
    }
    
    const useCandy = (e) => {
        e.preventDefault();
        
        sendAjax('POST', $(`#useCandyForm`).attr("action"), $(`#useCandyForm`).serialize(), () => {
            renderPokeList(props.csrf);
        });
        
        return false;
    };
    
    
    const pokeNodes = props.pokes.map( (poke) => {
        return (
            <div key={poke._id} className="poke">
                <img src={poke.img} alt="Pokeball" className="pokeBall" />
                <h3 className="pokeName"> Name: {poke.name} </h3>
                <h3 className="pokeAge"> Level: {poke.level} </h3>
                <form id="useCandyForm"
                    onSubmit={useCandy}
                    name="useCandyForm"
                    action="/useCandy"
                    method="POST"
                    className="useCandyForm"
                >
                <fieldset>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="pokeId" value={poke._id} />   
                <button type="submit" className="btn btn-info btn-lg btn-block">Use Rare Candy</button>
                </fieldset>
                </form>
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