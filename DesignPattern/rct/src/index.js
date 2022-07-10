
import React from 'react'
import ReactDOM from 'react-dom/client'
import {AppFunc, AppClass} from './app.js'

const root = ReactDOM.createRoot(document.getElementById('appRoot'))
root.render(
    <AppFunc name=' React!!'/>
    //<AppClass name='react class test'/>
)