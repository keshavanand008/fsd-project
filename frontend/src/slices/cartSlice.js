import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api.js";

// GET CART
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const { data } = await api.get("/cart");     
  return data.items;                           
});

// ADD TO CART
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }) => {
    const { data } = await api.post("/cart", { productId, quantity }); 
    return data.items;
  }
);

// UPDATE QUANTITY
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const { data } = await api.patch(`/cart/item/${itemId}`, { quantity }); // ✅ FIXED
      return data.items;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

//  REMOVE ITEM
export const removeItem = createAsyncThunk(
  "cart/remove",
  async (itemId) => {
    const { data } = await api.delete(`/cart/item/${itemId}`); 
    return data.items;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (s) => { s.status = "loading"; })
      .addCase(fetchCart.fulfilled, (s, a) => {
        s.status = "idle";
        s.items = a.payload;
      })

      .addCase(addToCart.fulfilled, (s, a) => { s.items = a.payload; })

      .addCase(updateQuantity.fulfilled, (s, a) => {
        s.items = a.payload;     // now works with backend
        s.error = null;
      })
      .addCase(updateQuantity.rejected, (s, a) => {
        s.error = a.payload;     //  show stock errors
      })

      .addCase(removeItem.fulfilled, (s, a) => { s.items = a.payload; });
  }
});

export default cartSlice.reducer;
