"use client"
import React from "react";
import Home from "./home/page";
import { LoadingProvider } from "./loadingContext";




function Pages() {
   
  
    return (
         <LoadingProvider>
   
            <Home />
            </LoadingProvider>
       
    );
}

export default Pages;
