import NavBar from "../components/NavBar"
import Card from "../components/Card"
import NotificationProvider from 'use-toast-notification'

export default function Home() {
  return (
    <NotificationProvider config={{position: 'top-right',isCloseable: true,showTitle: true,showIcon: true,duration: 35,	}}>

    <div className="container mx-auto px-4 py-2"> 
        <div className="gradient">
        <NavBar/>
        <Card></Card>
     </div>
      </div>

     </NotificationProvider> 
      
  )
}