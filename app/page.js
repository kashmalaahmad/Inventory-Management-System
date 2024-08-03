'use client'
import { useState, useEffect } from 'react'
import { firestore } from "@/firebase";
import { Box, Modal, Stack, TextField, Typography, Button, Container, AppBar, Toolbar, IconButton, InputAdornment } from '@mui/material'
import { collection, deleteDoc, getDocs, query, setDoc, doc, getDoc } from 'firebase/firestore'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({name: doc.id, ...doc.data()})
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    if (!item.trim()) return;
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
    setItemName('')
    handleClose()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#2c3e50' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Button color="inherit" onClick={handleOpen} startIcon={<AddIcon />}>
            Add New Item
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />
        <Box>
          {filteredInventory.length === 0 ? (
            <Typography align="center">No items found</Typography>
          ) : (
            filteredInventory.map((item) => (
              <Box 
                key={item.name} 
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#f0f0f0',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <Typography>{item.name}: {item.quantity}</Typography>
                <Box>
                  <IconButton onClick={() => addItem(item.name)} color="primary">
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => removeItem(item.name)} color="error">
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Container>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Add New Item
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Item name"
              fullWidth
            />
            <Button onClick={() => addItem(itemName)} variant="contained">
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}