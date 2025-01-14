import React, { Children, useState } from 'react';
import { IoMdClose } from "react-icons/io";

function Errorbox({ errors }) {
    const [close, setClose] = useState(false);
  return (
    <div className={`${close || errors.length <= 0 ? "hidden": ""} relative text-xs border border-red-500 bg-red-100 text-red-400 p-3 rounded-md`}>
        <button className='absolute right-2 top-3' onClick={() => setClose(true)}><IoMdClose /></button>
        <div>
            {
                errors?.map((error, index) => <p key={index}>{error}</p>)
            }
        </div>
    </div>
  )
}

export default Errorbox