import { createContext, useState } from "react";
import PropTypes from 'prop-types';
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");


    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index)
    }

    const onSent = async (prompt) => {

        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
        setPrevPrompts(prev => [...prev, input]); //Saving what I searched.
        const response = await run(input)
        let responseArray = response.split("**")
        let newResponse = "";
        for (let index = 0; index < responseArray.length; index++) {
            if (index === 0 || index % 2 == 1) {
                newResponse += responseArray[index];
            } else {
                newResponse += "<b>" + responseArray[index] + "</b>"
            }

        }
        let newResponse2 = newResponse.split("*").join("</br>");
        // setResultData(newResponse2);
        let newResponseArray = newResponse2.split(" ");
        // Typing effect 
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ")
        }

        setLoading(false);
        setInput("")
    }

    // onSent("What is react js");

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,

        setShowResult,
        setLoading,
        setResultData
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ContextProvider;

// Source Code:
// import { createContext } from "react";
// export const Context = createContext();

// const ContextProvider = (props) => {
//      const contextValue = {
//      }

//      return (
//          <Context.Provider value={contextValue}>
//              {props.children}
//          </Context.Provider>
//      )
// }
