import React from "react";
import {createAPIEndpoint,ENDPOINTS} from '../api/index'
import useStateContext from '../hooks/useStateContext'
import { useNavigate } from 'react-router-dom';

import {
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Center from "./Center";
import useForm from "../hooks/useForm";

const getFreshModel = ()=>({
    name:'',
    email:''
});

export default function Login() {
   const {context,setContext} = useStateContext();
   const navigate = useNavigate();
    const {
        values,
        setValues,
        errors,
        setErrors,
        handelInputChange
    } = useForm(getFreshModel);

    const login = e =>{
      e.preventDefault();
      if(validate())
      createAPIEndpoint(ENDPOINTS.participant)
      .post(values)
      .then(res => {
        setContext({participantId:res.data.participantId});
        navigate('/quiz');
        }
      )
      .catch(err=>console.log(err));
    }

    const validate = ()=>{
      let temp = {};
      temp.email = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}').test(values.email)? "" : "البريد الإلكتروني غير صحيح";
      temp.name = values.name !="" ? "":"عرفنا باسمك قبل نبدأ";
      setErrors(temp);
      return Object.values(temp).every(x=>x=="");
    }

  return (
    <Center>
      {context.participantId}
      <Card
        sx={{
          width: "400px",
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              my: 3,
              fontFamily: "Tajawal",
            }}
          >
            تسجيل الدخول 
          </Typography>
          <Box
            sx={{
              "& .MuiTextField-root": {
                m: 1,
                width: "90%",
              },
            }}
          >
            <form noValidate autoComplete="on" onSubmit={login}>
              <TextField
                label="&#128140; بريدك الإلكتروني"
                name="email"
                value={values.email}
                onChange={handelInputChange}
                variant="outlined"
                
                {...(errors.email && {
                  error:true,
                  helperText:errors.email
                })}
                inputProps={{
                  style: {
                    fontFamily: "Tajawal",
                    textAlign: "center",
                  },
                }}
                InputLabelProps={{ style: { fontFamily: "Tajawal" } }}
              />
              <TextField
                label="&#10024; اسـمك"
                name="name"
                value={values.name}
                onChange={handelInputChange}
                variant="outlined"
                {...(errors.name && {
                  error:true,
                  helperText:errors.name
                })}
                inputProps={{
                  style: { 
                    fontFamily: "Tajawal", 
                    textAlign: "center",
                  },
                }}
                InputLabelProps={{ style: { fontFamily: "Tajawal" } }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  width: "90%",
                  fontFamily: "Tajawal",
                }}
              >
                يالله نبدأ
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Center>
  );
}
