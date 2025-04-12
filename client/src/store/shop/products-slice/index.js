import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null
}

export const fetchAllFilterdProducts = createAsyncThunk('/products/fetchAllProducts',
    async ({ filterParams, sortParams }) => {


        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams
        })
        console.log(query, "this query");
        const queryString = query.toString() ? `?${query}` : "";
        const result = await axios.get(`http://localhost:5000/api/shop/products/get${queryString}`);
        return result?.data;
    });

export const fetchproductDetails = createAsyncThunk('/products/fetchproductDetails',
    async (id) => {


        const result = await axios.get(`http://localhost:5000/api/shop/products/get/${id}`);

        return result?.data;
    });


const shoppingProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
        setProductDetails : (state) =>{
            state.productDetails = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFilterdProducts.pending, (state, action) => {
                state.isLoading = true
            }).addCase(fetchAllFilterdProducts.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.productList = action.payload.data;
            }).addCase(fetchAllFilterdProducts.rejected, (state, action) => {
                state.isLoading = false,
                    state.productList = []
            })
            .addCase(fetchproductDetails.pending, (state, action) => {
                state.isLoading = true
            }).addCase(fetchproductDetails.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.productDetails = action.payload.data;
            }).addCase(fetchproductDetails.rejected, (state, action) => {
                state.isLoading = false,
                    state.productDetails = null;
            })
    }
})
export const {setProductDetails} = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer
