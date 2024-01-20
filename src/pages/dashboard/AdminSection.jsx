import React from 'react'
import BootomNavBar from '../../components/hostComponents/BootomNavBar';
import RoomDetails from '../../components/hostComponents/rooms/RoomDetails';

import Nav from './Nav';

export default function AdminSection() {
  return (
    <div>
      <Nav/>
      <BootomNavBar />
      <RoomDetails />
    </div>
  );
}
