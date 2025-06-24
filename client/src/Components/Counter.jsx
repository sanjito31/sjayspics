import { useState } from "react";
import '../index.css';

function Counter() {
    
    const [count, setCount] = useState(0);

    const incrementCounter = () => {
        setCount(count + 1);
    }

    const decrementCounter = () => {
        setCount(count - 1);
    }

    const resetCounter = () => {
        setCount(0);
    }

    return(
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl">Counter</h1>
            <p className="font-bold text-4xl">{count}</p>
            <div className="flex space-x-4 mt-4">
                <button 
                    name="increment" 
                    onClick={incrementCounter} 
                    className=" bg-blue-500 px-8 rounded-lg text-white">
                +</button>
                <button 
                    name="reset" 
                    onClick={resetCounter}
                    className=" bg-blue-500 px-2 rounded-lg text-white text-sm">
                0</button>
                <button 
                    name="decrement" 
                    onClick={decrementCounter}
                    className=" bg-blue-500 px-8 rounded-lg text-white">
                -</button>
            </div>
        </div>
    )

}
export default Counter