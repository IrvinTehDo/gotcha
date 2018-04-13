// Handles the buy requests and sends it to the server
const handleBuy = (e) =>{
    e.preventDefault();
    
    $("#pokeMessage").animate({ width: 'hide'}, 350);
    
    sendAjax('POST', $("#buyForm").attr("action"), $("#buyForm").serialize(), function() {

    });
    
    return false;
}

// Construct the form and page
const StorePage = (props) => {
    return (
        <div>
        <form id="buyForm"
            onSubmit={handleBuy}
            name="pokeForm"
            action="/buyBall"
            method="POST"
            className="pokeForm"
            >
             <input type="hidden" name="_csrf" value={props.csrf} />
            <button type="submit" className="btn btn-info btn-lg btn-block">Buy 5 Pokeballs</button>
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