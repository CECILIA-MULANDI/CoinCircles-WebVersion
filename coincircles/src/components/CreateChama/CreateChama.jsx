import React, { useState } from 'react'
import Form  from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { ethers } from 'ethers';
import { CreateChamas } from '../CallContractFunctions/ContractFunctions';
export default function CreateChama() {

  console.log(ethers.version);

    const [name,setName]=useState('');
    const [purpose,setPurpose]=useState('');
    const [maxPeople,setMaxPeople]=useState(0);
    const [minDeposit,setMinimumDeposit]=useState(0);
    const [chamaVisibility,setChamaVisibility]=useState('Public');
    const [successMessage,setSuccessMessage]=useState('')
      // Map the string value to the corresponding enum value
    const visibilityValue = chamaVisibility === 'Public' ? 0 : 1;
    // const [isFull,setIsFull]=useState('');
    const handleSubmit=async(e)=>{
      e.preventDefault();
      try {
        await CreateChamas(name, purpose, parseInt(maxPeople), parseInt(minDeposit), visibilityValue,setSuccessMessage);
       
      } catch (error) {
        console.error(error);
      }
    }

  return (
    <>
    {successMessage && <p>{successMessage}</p>}
     <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
          <Form.Label   >Chama Name</Form.Label>
          <Form.Control type="text" placeholder="Enter a name for your chama" value={name} onChange={(e)=>setName(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3">
          <Form.Label>Purpose of Chama</Form.Label>
          <Form.Control type="text" placeholder="Why are you creating a chama" value={purpose} onChange={(e)=>setPurpose(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3">
          <Form.Label>Maximum Number of Member</Form.Label>
          <Form.Control type="number" placeholder="Maximum Number of members" value={maxPeople} onChange={(e)=>setMaxPeople(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3">
          <Form.Label>Minimum deposit</Form.Label>
          <Form.Control type="number" placeholder="Enter Minimum Deposit for your chama" value={minDeposit} onChange={(e)=>setMinimumDeposit(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3">
          <Form.Label>Chama Visibility</Form.Label>
          <Form.Select  value={chamaVisibility} onChange={(e)=>setChamaVisibility(e.target.value)}>
      <option>Open this select menu</option>
      <option value="Public">Public</option>
      <option value="Private">Private</option>
     
    </Form.Select>
        
      </Form.Group>
      <Button type='submit'>Submit</Button>
    </Form>
    </>
   
  )
}
