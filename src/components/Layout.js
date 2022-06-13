import { AppBar, Toolbar, Typography } from '@mui/material'
import React, { useEffect,useState } from 'react'
import { Outlet,useNavigate } from 'react-router-dom'
import {makeStyles} from '@mui/styles'
import { Container } from '@mui/system';
import useStateContext from '../hooks/useStateContext'
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { createAPIEndpoint, ENDPOINTS } from '../api';


const useStyles = makeStyles((theme) => ({
    typo: {
      flexGrow: 1,
      textAlign: "right"
    },
  }));

export default function Layout() {
  const {resetContext,context}=useStateContext();
  const navigate = useNavigate();
  const logout =()=>{
    resetContext();
    navigate("/");
  }
  const classes = useStyles();
  const [currentName,setCurrentName]=useState('');

  useEffect(()=>{
    createAPIEndpoint(ENDPOINTS.participant).fetchById(context.participantId)
    .then(res=>{
      setCurrentName(res.data.name)
    })
    .catch(err=>console.log(err))
  }, []);




  return (
    <>
        <AppBar position='sticky'>
            <Toolbar sx={{width:'640px',m:'auto'}}>
              
            <IconButton onClick={logout} color="error" className={classes.typo} ><LogoutIcon /></IconButton >
                   <h5>{currentName}</h5>
                    <Typography 
                    variant='h5'
                    className={classes.typo} 
             
                    >
                    &#10024; إِسْتِفْهام 
                    </Typography>
                   
            </Toolbar>
        </AppBar>
        <Container><Outlet /></Container>
        
    </>
  )
}
