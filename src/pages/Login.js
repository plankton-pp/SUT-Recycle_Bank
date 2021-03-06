import React, { useState } from 'react';

import { Row, Col, Image, Carousel, Spin, } from 'antd'

import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/loginAction';
import { logout } from '../redux/actions/logoutAction';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

import { Button } from '../components/styles/globalStyles';
import InputText from '../components/InputText';
import BoxCard from '../components/BoxCard';

import SUTLogo from '../components/SUTLogo';

import * as API from '../utils/apis'
import * as helper from '../utils/helper'
import Gellery from '../components/Gellery';

const MySwal = withReactContent(swal)

function Login() {

  const dispatch = useDispatch();
  const history = useHistory();


  const initInvalidMsg = {
    username: "",
    password: "",
  }
  const [invalid, setInvalid] = useState(initInvalidMsg);

  const initForm = {
    username: '',
    password: '',
  }
  const [form, setForm] = useState(initForm);

  const [isLoad, setIsLoad] = useState(false)

  const addInvalid = (element, message) => {
    invalid[element] = message;
    setInvalid({ ...invalid });
  }

  const removeInvalid = (element) => {
    invalid[element] = "";
    setInvalid({ ...invalid });
  }

  const validate = () => {
    let validated = true;

    if (form.username === '') {
      addInvalid('username', "กรุณาระบุบัญชีผู้ใช้งาน");
      validated = false;
    }
    // if (!helper.checkEmailFormat(form.username.trim())) {
    //   addInvalid('username', "กรุณาระบุอีเมลให้ถูกต้อง");
    //   validated = false;
    // }
    if (form.password === '') {
      addInvalid('password', "กรุณากรอกรหัสผ่าน");
      validated = false;
    }
    return validated;
  }

  const invalidLogin = () => {
    MySwal.fire({
      text: "ไม่พบข้อมูลผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
      icon: 'warning',
      confirmButtonColor: '#96CC39',
      confirmButtonText: 'ตกลง'
    }).then(() => {
      setIsLoad(false)
    })
  }


  const toLogin = async () => {
    setIsLoad(true)
    // e.preventDefault();
    if (validate()) {
      let dataUser = {
        username: form.username,
        password: form.password
      }
      try {
        const response = await API.login(dataUser);
        const data = await response?.data;
        if (response.status === 200) {
          if (data.auth) {
            setIsLoad(false)
            dispatch(login({ data, history }))
          } else {
            invalidLogin()
          }
          setForm(initForm);
        } else {
          invalidLogin()
        }

      } catch (error) {
        invalidLogin()
      }
    } else {
      setIsLoad(false)
    }

  }
  return (
    <div className='container' style={{ paddingTop: '3%' }}>
      <Spin tip="Loading..." spinning={isLoad}>
        <BoxCard>
          <Row>
            <Col span={12}>
              <div className='p-5 m-5'>
                <SUTLogo style={{ fontSize: '42px' }} />
                <h1 className='logo mt-3'>เข้าสู่ระบบ</h1>
                <div className='mb-3'>
                  <InputText title="บัญชีผู้ใช้" type="text" idName="username" value={form.username} star={false} classFormGroup="w-100"
                    placeholder="username or email" handleChange={(value) => setForm({ ...form, username: value })}
                    handleInvalid={() => removeInvalid("username")} invalid={invalid.username}
                  />
                </div>
                <div className='mb-4'>
                  <InputText title="รหัสผ่าน" type="password" idName="password" value={form.password} star={false} classFormGroup="w-100"
                    placeholder="password" handleChange={(value) => setForm({ ...form, password: value })}
                    handleInvalid={() => removeInvalid("password")} invalid={invalid.password}
                  />
                </div>
                <div className='mb-4'>
                  <Row gutter={[20, 0]}>
                    <Col>
                      <Button bg={'#96CC39'} color={'#fff'} onClick={() => { toLogin() }}>เข้าสู่ระบบ</Button>
                    </Col>
                    <Col>
                      <Link to={`/forgetpass`} style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '16px' }}>
                        <Button className={''} bg={'#1AA'} color={'#fff'} onClick={() => { }}>ลืมรหัสผ่าน</Button>
                      </Link>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row gutter={[10, 0]}>
                    <Col>
                      <span>
                        ยังไม่มีบัญชีผู้ใช้งาน ?
                      </span>
                    </Col>
                    <Col>
                      <Link to={`/register`} style={{ fontWeight: 'bolder', fontSize: '16px' }}>
                        สมัครสมาชิก
                      </Link>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <Gellery style={{ widht: '80%', borderRadius: '10px' }}></Gellery>
            </Col>
          </Row>
        </BoxCard>
      </Spin>
    </div>
  );
}

export default Login;
