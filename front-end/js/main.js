require('whatwg-fetch')

const
    R = require('ramda'),
    tap = x => { console.log(x); return x },
    React = require('react'),
    ReactDOM = require('react-dom'),
    {createStore} = require('redux'),
    {Provider} = require('react-redux'),
    initialState = {
        text: 'type, hit enter',
        list: []
    },
    keyGenerator = (function () {
        var key = 0
        return () => {
            key++
            return key
        }
    }()),
    reducer = (state = initialState, action) => {
        switch(action.type) {
            case 'ADD_TEXT':
                return {
                    ...state,
                    text: action.text
                }
            case 'ADD_TO_LIST':
                return {
                    text: '',
                    list: [
                        {
                            key: keyGenerator(),
                            text: state.text,
                        },
                        ...state.list
                    ]
                }
            default:
                return state
        }
    },
    store = createStore(reducer),
    TypeyThing = () =>
        <input
            type="text"
            value={store.getState().text}
            onChange={({target:{value: text}}) => store.dispatch({type: 'ADD_TEXT', text})}
            onKeyPress={e => {if(e.key === 'Enter') store.dispatch({type: 'ADD_TO_LIST'})}}/>,
    ListOfThings = () =>
        <ul>
            {store.getState().list.map(thing => <li>{thing.text}</li>)}
        </ul>,
    render = () =>
        ReactDOM.render(
            <Provider store={store}>
                <div>
                    <TypeyThing/>
                    <ListOfThings/>
                </div>
            </Provider>,
            document.getElementById('root'))

store.subscribe(render)
render()
