import React, { useState, useEffect } from "react";
import * as API from "../utils/apis";

import { Button } from 'antd'

function Index() {
    useEffect(() => {
        getBooks()
    }, [])

    const [jsonText, setJsonText] = useState('')
    const [apiStatus, setApiStatus] = useState(false)
    const [lastBookId, setLastBookId] = useState('')

    const stringify = (data) =>{
        return JSON.stringify(data)
    }
    const getBooks = async () => {
        try {
            const response = await API.getBooks();
            const data = await response?.data;
            if (response.status === 200) {
                setJsonText(JSON.stringify(data, null, 2))
                let dataArray = []
                for(var item in data.data) {
                    dataArray.push(data.data[item]);
                }
                let lastId =  data.data[dataArray.length-1].id
                setLastBookId(lastId)
                setApiStatus(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getBookById = async (id = 1) => {
        try {
            const response = await API.getBookById(id);
            const data = await response?.data;
            if (response.status === 200) {
                setJsonText(JSON.stringify(data, null, 2))
                setApiStatus(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteById = async (id) => {
        try {
            const response = await API.deleteBookById(id);
            if (response.status === 200) {
                getBooks()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addBook = async (book) => {
        try {
            const response = await API.addBook(book);
            const data = await response?.data;
            if (response.status === 200) {
                getBooks()
            }
        } catch (error) {
            console.log(error)
        }
    }
    const book = {
        name: 'new Book',
        author: 'someone',
    }

    return (
        <div>
            <h1>Test API</h1>
            <Button type="primary m-3" onClick={() => { getBooks() }}>Get All</Button>
            <Button type="primary m-3" onClick={() => { getBookById(1) }}>Get By ID 1</Button>
            <Button type="primary m-3" onClick={() => { getBookById(2) }}>Get By ID 2</Button>
            <Button type="button" className="btn-warning" onClick={() => { addBook(book) }}>Add New</Button>
            <Button type="danger m-3" onClick={() => { deleteById(lastBookId) }}>Delete Last</Button>
            <p className="bold">Status API: <span className={apiStatus ? 'text-green-6' : 'text-red-6'}> {apiStatus ? "Working" : "Not Working"} </span> </p>
            <pre>{jsonText}</pre>

            <p className="bold">Last ID: {lastBookId} </p>
        </div>
    )
}

export default Index
