import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material'

import React from 'react'
import SearchIcon from '@mui/icons-material/Search'

function CustomizedInputBase() {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tìm kiếm người dùng"
        inputProps={{ 'aria-label': 'tìm kiếm người dùng' }}
      />
    </Paper>
  )
}

function ChatsNavigator() {
  return (
    <Box
      sx={{
        width: '240px',
        padding: '8px',
        // margin: '8px',
        backgroundColor: 'white',
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
        // minHeight: '500px',
        maxHeight: '550px',
        height: 'fit-content',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
      }}
    >
      <CustomizedInputBase />
      <Divider variant="middle" sx={{ m: '12px 0' }} />
      <Box sx={{ fontSize: '12px', color: 'grey', textAlign: 'center' }}>
        Mọi người
      </Box>
      <Stack
        direction="column"
        spacing={1}
        sx={{ overflowY: 'scroll', overflowX: 'hidden' }}
      >
        <Box>
          {[...new Array(12)].map(() => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mb: '4px',
                p: '4px 0',
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ ml: '8px' }}>Remy Sharp</Box>
            </Box>
          ))}
        </Box>
        <Divider variant="middle" />
      </Stack>
    </Box>
  )
}

export default ChatsNavigator
