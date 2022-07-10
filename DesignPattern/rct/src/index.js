
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.js'
import AppClass from './appClass.js'

const root = ReactDOM.createRoot(document.getElementById('appRoot'))
root.render(
    //<App name=' React!!'/>
    <AppClass name='react class test'>
        <b>this is children</b>
    </AppClass>
)