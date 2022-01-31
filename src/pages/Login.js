import React, { useState } from 'react';

import { Row, Col } from 'antd'

import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/loginAction';
import { logout } from '../redux/actions/logoutAction';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

import { Button } from '../components/styles/globalStyles';
import InputText from '../components/InputText';
import BoxCard from '../components/BoxCard';

import * as API from '../utils/apis'
import * as helper from '../utils/helper'

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

  const toLogin = async (e) => {
    // e.preventDefault();
    if (validate()) {
      let dataUser = {
        username: form.username,
        password: form.password
      }
      try {
        // console.log('dataUser',dataUser);
        const response = await API.login(dataUser);
        const data = await response?.data;
        // console.log("response", response);
        if (response.status === 200) {
          const role = data.data[0]['Role'];
          // if (role !== 'admin' && role !== 'employee') {
          //   dispatch(login({ data, history }))
          // } else {
          //   dispatch(logout({ history }))
          //   MySwal.fire({
          //     text: "ท่านไม่มีสิทธิ์เข้าถึง ระบบนี้สำหรับเจ้าหน้าที่",
          //     icon: 'warning',
          //     confirmButtonColor: '#96CC39',
          //     confirmButtonText: 'ตกลง'
          //   })
          // }
          if (data.auth) {
            dispatch(login({ data, history }))
          }
          setForm(initForm);
        }

      } catch (error) {
        const mgeError = error?.response?.data.errors[0]
        MySwal.fire({
          text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
          icon: 'warning',
          confirmButtonColor: '#96CC39',
          confirmButtonText: 'ตกลง'
        })
      }
    }

  }
  return (
    <div className='container'>
      <div style={{ width: '70%', paddingTop: '20%' }}>
        <BoxCard>
          <h1>Login</h1>
          <div className="d-flex justify-content-center flex-column">
            <div className='mb-3'>
              <InputText title="" type="text" idName="username" value={form.username} star={false} classFormGroup="w-100"
                placeholder="email" handleChange={(value) => setForm({ ...form, username: value })}
                handleInvalid={() => removeInvalid("username")} invalid={invalid.username}
              />
            </div>
            <div className='mb-3'>
              <InputText title="" type="password" idName="password" value={form.password} star={false} classFormGroup="w-100"
                placeholder="password" handleChange={(value) => setForm({ ...form, password: value })}
                handleInvalid={() => removeInvalid("password")} invalid={invalid.password}
              />
            </div>
          </div>
          <Button className={'mr-2 mt-4'} bg={'#96CC39'} color={'#fff'} onClick={() => { toLogin() }}>Login</Button>
          <Button className={'mr-2 mt-4'} bg={'#1AA'} color={'#fff'} onClick={() => { toLogin() }}>Register</Button>
        </BoxCard>
      </div>
    </div>
  );
}

export default Login;
