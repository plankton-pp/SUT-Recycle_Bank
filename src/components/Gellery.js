import React from 'react';
import {Image, Carousel } from 'antd'

import cover1 from '../assets/cover/cover1.jpg'
import cover2 from '../assets/cover/cover2.jpg'
import cover3 from '../assets/cover/cover3.jpg'
import cover4 from '../assets/cover/cover4.jpg'
import cover5 from '../assets/cover/cover5.jpg'

function Gellery({style}) {
    return (
        <Carousel autoplay>
            <div >
                <Image
                    style={style}
                    src={cover1}
                />
            </div>
            <div>
                <Image
                    style={style}
                    src={cover2}
                />
            </div>
            <div >
                <Image
                    style={style}
                    src={cover3}
                />
            </div>
            <div>
                <Image
                    style={style}
                    src={cover4}
                />
            </div>
            <div >
                <Image
                    style={style}
                    src={cover5}
                />
            </div>
        </Carousel>
    );
}

export default Gellery;
