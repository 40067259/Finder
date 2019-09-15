import { createStore } from "redux";
// import { ifError } from "assert";
let reducer = (state, action) => {
  if (action.type === "search") {
    return { ...state, searchQuery: action.typedSearch };
  }
  if (action.type === "all-items") {
    let newList = action.allItems;
    newList = newList.reverse();
    return { ...state, allItems: newList };
  }
  if (action.type === "username") {
    return {
      ...state,
      username: action.username,
      sessionId: action.sid,
      firstName: action.firstName,
      lastName: action.lastName
    };
  }
  if (action.type === "cart") {
    return { ...state, cartList: action.cartList };
  }
  if (action.type === "addCartItems") {
    return { ...state, addToCartItems: action.addToCartItems };
  }
  if (action.type === "logout") {
    return { ...state, firstName: undefined };
  }
 
  if(action.type === "set-messages") {
    return {...state, messages: action.messages}
  }
  if (action.type === "seller-clicked") {
    return { ...state, sellerClicked: action.sellerClicked };
  }
  if (action.type === "removeToCart") {
    let newCartNumber = action.removeItems - 1;
    console.log(newCartNumber);
    return { ...state, addToCartItems: newCartNumber };
  }
  if (action.type === "checkout") {
    return { ...state, addToCartItems: action.addToCartItems };
  }
  return state;
};

const store = createStore(
  reducer,
  {
    sid :"",
    username: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
