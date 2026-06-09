import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const useAuthStore = create((set)=>({
  user:null,
  token:null,
  isLoggedIn:false,
  isLoading:false,
  setUser:(user)=>set({user,isLoggedIn:!!user}),
  setToken:(token)=>set({token}),
  setIsLoading:(isLoading)=>set({isLoading}),
  logout:async()=>{await AsyncStorage.removeItem('@auth_token');set({user:null,token:null,isLoggedIn:false});},
  restoreToken:async()=>{try{
    const token=await AsyncStorage.getItem('@auth_token');
    const userStr=await AsyncStorage.getItem('@user_data');
    if(token && userStr){
      set({token, user: JSON.parse(userStr), isLoggedIn:true});
    }
  }catch(e){}}
}));

