import React, { useEffect, useState } from 'react'
import { Appbar } from '../Appbar'
import Balance from '../Balance'
import { Users } from '../Users'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0)
  useEffect(() => {
    const token = localStorage.getItem("token") || null;
    if(!token) {
      navigate("/signup");
    }
  }, [])

  useEffect(() => {
    const getBalance = async() => {
      const res = await axios.get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      })
      setValue(parseFloat(res.data.balance.toFixed(2)));
    }
    getBalance();
  }, [])
  return (
    <div className='w-full h-screen'>
      <Appbar />
      <Balance value={value} />
      <Users />
    </div>
  )
}

export default Dashboard