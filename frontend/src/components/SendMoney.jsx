import axios from 'axios';
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';

function SendMoney() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [isprocessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const handletransfer = async() => {
        if(amount <= 0) return;

        try{
            setIsProcessing(true);
            const res = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setError(res.data.message);
            setTimeout(() => setError(""), 5000);
            setIsProcessing(false);

        }catch(err) {
            setError(err.response.data.message);
            setTimeout(() => setError(""), 5000);
            setIsProcessing(false);
        }
    }
  return (
    <div class="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div
                class="border h-min text-card-foreground max-w-md p-4 x w-96 bg-white shadow-lg rounded-lg"
            >
                <div class="flex flex-col space-y-1.5 p-6">
                <h2 class="text-3xl font-bold text-center">Send Money</h2>
                </div>
                {
                    error && <div className='text-sm text-center text-red-400'>
                        {error}
                    </div>
                }
                <div class="p-4">
                <div class="flex items-center space-x-4 justify-center bg-gray-100 py-2 rounded-full shadow-sm">
                    <div class="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span class="text-2xl text-white">{name.split("")[0].toUpperCase()}</span>
                    </div>
                    <h3 class="text-2xl font-semibold">{ name }</h3>
                </div>
                <div class="space-y-4 my-3">
                    <div class="space-y-2">
                    <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="amount"
                    >
                        Amount (in Rs)
                    </label>
                    <input
                        type="number"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="amount"
                        min={0}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                    </div>
                    <button 
                    disabled={amount <= 0 || isprocessing}
                    onClick={handletransfer}
                    className={`justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white`}>
                        Initiate Transfer
                    </button>
                </div>
                </div>
        </div>
      </div>
    </div>
  )
}

export default SendMoney;