import React, { useEffect } from 'react';
import BoxCard from '../components/BoxCard';
import { Button } from '../components/styles/globalStyles'
import * as API from '../utils/apis'

function index() {
    const userAuthenticated = async () => {
        try {
            const response = await API.userAuthenticated();
            const data = await response?.data;
        } catch (error) {

        }
    }

    return (
        <div className='container'>
            <BoxCard>
                <h1 className='' style={{ fontWeight: 'bolder' }}>Home</h1>

                <Button className={'mr-2 mt-4'} bg={'#ACDD'} color={'#fff'} onClick={() => { userAuthenticated() }}>Authorize</Button>
            </BoxCard>
        </div>
    )
}

export default index
