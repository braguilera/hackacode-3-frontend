import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Provider from './contexto/Provider';
import { I18nextProvider } from "react-i18next"
import i18next from 'i18next';

import inicio_es from "./translations/es/inicio.json"
import inicio_en from "./translations/en/inicio.json"

import marquee_es from "./translations/es/marquee.json"
import marquee_en from "./translations/en/marquee.json"

import sobreMi_es from "./translations/es/sobreMi.json"
import sobreMi_en from "./translations/en/sobreMi.json"

import proyectos_es from "./translations/es/proyectos.json"
import proyectos_en from "./translations/en/proyectos.json"

import habilidades_es from "./translations/es/habilidades.json"
import habilidades_en from "./translations/en/habilidades.json"

i18next.init({
    interpolation: { escapeValue: false },
    lng:"en",
    resources: {
        es: {
            inicio: inicio_es,
            marquee: marquee_es,
            sobreMi: sobreMi_es,
            proyectos: proyectos_es,
            habilidades: habilidades_es
        },
        en: {
            inicio: inicio_en,
            marquee: marquee_en,
            sobreMi: sobreMi_en,
            proyectos: proyectos_en,
            habilidades: habilidades_en
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Provider>
            <I18nextProvider i18n={i18next}>
                <App />
            </I18nextProvider>
        </Provider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
