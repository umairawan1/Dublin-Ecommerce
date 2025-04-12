import axios from "axios";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
axios.defaults.withCredentials = true;

const initialState = {
    cartItems: [],
    isLoading: false
}

export const addTocart = createAsyncThunk('cart/addTocart', async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/api/shop/cart/add',
            {
                userId,
                productId,
                quantity,
            },
            {
                withCredentials: true
            });
        return response.data;
    } catch (error) {
        console.error("Add to cart error:", error);
        return rejectWithValue(error.response?.data || "Error adding to cart");
    }
});


// export const fetchCartItems = createAsyncThunk(
//     'cart/fetchCartItems',
//     async ({ userId }, { rejectWithValue }) => {
//         console.log(userId,"userID /get/:userId");

//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/shop/cart/get/${userId}`
//         );
//         return response.data;
//       } catch (error) {
//         return rejectWithValue(error.response.data);
//       }
//     }
//   );

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async ({ userId }, { rejectWithValue }) => {
        try {
            if (!userId) {
                console.error("No userId provided");
                return rejectWithValue("No userId provided");
            }

            const response = await axios.get(
                `http://localhost:5000/api/shop/cart/get/${userId}`,
                {
                    withCredentials: true
                }
            );

            return response.data;
        } catch (error) {
            console.error("Fetch cart items error:", error);
            return rejectWithValue(error.response?.data || "Error fetching cart items");
        }
    }
);

export const deleteCartItem = createAsyncThunk(
    'cart/deleteCartItem', 
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            // Get the token from localStorage or wherever you store it
            const token = localStorage.getItem('token'); // or however you store your token
            
            const response = await axios.delete(
                `http://localhost:5000/api/shop/cart/${userId}/${productId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Add the authorization header
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Delete error:', error);
            return rejectWithValue(error.response?.data || 'Error deleting item');
        }
    }
);

export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axios.put('http://localhost:5000/api/shop/cart/update-cart',
            {
                userId,
                productId,
                quantity,
            },
            {
                withCredentials: true
            });
        return response.data;
    } catch (error) {
        console.error("Update cart quantity error:", error);
        return rejectWithValue(error.response?.data || "Error updating cart quantity");
    }
});

const shoppingCartSlice = createSlice({
    name: 'shoppingCart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTocart.pending, (state) => {
            state.isLoading = true
        }).addCase(addTocart.fulfilled, (state, action) => {
            state.isLoading = false, 
                state.cartItems = action.payload.data
        }).addCase(addTocart.rejected, (state) => {
            state.isLoading = false,
                state.cartItems = []
        }).addCase(fetchCartItems.pending, (state) => {
            state.isLoading = true
        }).addCase(fetchCartItems.fulfilled, (state, action) => {
            state.isLoading = false,
                state.cartItems = action.payload.data
        }).addCase(fetchCartItems.rejected, (state) => {
            state.isLoading = false,
                state.cartItems = []
        }).addCase(updateCartQuantity.pending, (state) => {
            state.isLoading = true
        }).addCase(updateCartQuantity.fulfilled, (state, action) => {
            state.isLoading = false,
                state.cartItems = action.payload.data
        }).addCase(updateCartQuantity.rejected, (state) => {
            state.isLoading = false,
                state.cartItems = []
        }).addCase(deleteCartItem.pending, (state) => {
            state.isLoading = true
        }).addCase(deleteCartItem.fulfilled, (state, action) => {
            state.isLoading = false,
                state.cartItems = action.payload.data
        }).addCase(deleteCartItem.rejected, (state) => {
            state.isLoading = false,
                state.cartItems = []
        })
    }
});

export default shoppingCartSlice.reducer;
