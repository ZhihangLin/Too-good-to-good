export const initialState = {
  bboxCounter: parseInt(localStorage.getItem('boxCounter')) || 0,
  basket: [],
  user: null
};

// Selector
export const getBasketTotal = (basket) => 
  basket?.reduce((amount, item) => item.price + amount, 0);

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };

      case 'UPDATE_BOX_COUNTER':
        localStorage.setItem('boxCounter', action.count);
        return {
          ...state,
          boxCounter: action.count,
        };
    
    case 'EMPTY_BASKET':
      return {
        ...state,
        basket: []
      }

      case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.searchResults,
      };

    case "REMOVE_FROM_WISHLISH":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);

      } else {
        console.warn(
          `Cant remove product (id: ${action.id}) as its not in basket!`
        )
      }

      return {
        ...state,
        basket: newBasket
      }
    
    case "SET_USER":
      return {
        ...state,
        user: action.user
      }

    default:
      return state;
  }
};

export default reducer;

