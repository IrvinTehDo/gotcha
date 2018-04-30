// Handles the buy requests and sends it to the server
const handleBuy = (amount) =>{
    $("#pokeMessage").animate({ width: 'hide'}, 350);
    
    sendAjax('POST', $(`#${amount}buyForm`).attr("action"), $(`#${amount}buyForm`).serialize(), function() {

    });
    
    return false;
}

// Construct the form and page
const StorePage = (props) => {
    return (
        <div>
        <form id="5buyForm"
            onSubmit={ (e) => {e.preventDefault(); handleBuy(5);} }
            name="5buyForm"
            action="/buyBall"
            method="POST"
            className="pokeForm"
            >
            <fieldset>
             <input type="hidden" name="_csrf" value={props.csrf} />
            <input type="hidden" name="amount" value={5} />
            <button type="submit" className="btn btn-info btn-lg btn-block">Buy 5 Pokeballs $4.99</button>
            </fieldset>
        </form>
        <form id="10buyForm"
            onSubmit={ (e) => {e.preventDefault(); handleBuy(10);} }
            name="10buyForm"
            action="/buyBall"
            method="POST"
            className="pokeForm"
            >
            <fieldset>
             <input type="hidden" name="_csrf" value={props.csrf} />
            <input type="hidden" name="amount" value={10} />
            <button type="submit" className="btn btn-info btn-lg btn-block">Buy 10 Pokeballs $8.99</button>
            </fieldset>
        </form>
        <form id="15buyForm"
            onSubmit={ (e) => {e.preventDefault(); handleBuy(15);} }
            name="15buyForm"
            action="/buyBall"
            method="POST"
            className="pokeForm"
            >
            <fieldset>
             <input type="hidden" name="_csrf" value={props.csrf} />
            <input type="hidden" name="amount" value={15} />
            <button type="submit" className="btn btn-info btn-lg btn-block">Buy 15 Pokeballs $16.99</button>
            </fieldset>
        </form>
        <form id="20buyForm"
            onSubmit={ (e) => {e.preventDefault(); handleBuy(20);} }
            name="20buyForm"
            action="/buyBall"
            method="POST"
            className="pokeForm"
            >
            <fieldset>
             <input type="hidden" name="_csrf" value={props.csrf} />
            <input type="hidden" name="amount" value={20} />
            <button type="submit" className="btn btn-info btn-lg btn-block">Buy 20 Pokeballs $19.99</button>
            </fieldset>
        </form>
        </div>
    );
};

// Renders the page
const renderStore = (csrf) => {
    ReactDOM.render(
        <StorePage csrf={csrf} />, document.querySelector("#store")
    );
};