import { House, LogOut, Menu, ShoppingBag, ShoppingCart, UserRoundCheck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewHeaderMenuItems } from '@/config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from '@/store/auth-slice'
import UserCartWrapper from './UserCartWrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { Label } from '../ui/label'

function MenuItems() {

  const navigate = useNavigate();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem('filters')

    const currentFilter = getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== 'products' 
    && getCurrentMenuItem.id !== 'search'
      ?
      {
        category: [getCurrentMenuItem.id]
      }
      :
      null;
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate(getCurrentMenuItem.path)
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:flex-row lg:items-center gap-6">
      {
        shoppingViewHeaderMenuItems.map(menuItems => (
          <Label
            onClick={() => handleNavigate(menuItems)}
            className="text-sm font-medium  hover:border-b hover:border-black"
          >
            {menuItems.label}
          </Label>
        ))
      }
    </nav>

  )
}

function HeaderRightContent() {
  const { user } = useSelector(state => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser())
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id))
  }, [dispatch])

  console.log("Cart Items:", cartItems); // already done
  console.log("CartItems.Itrms :", cartItems.items);
  return (
    <div className='flex lg:items-center lg:flex-row flex-col gap-4'>
      <Sheet className='text-white' open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)} variant='outline'
          size='icon'
          className="relative"
        >
          <ShoppingCart className='w-6 h-6' />
          <span className='sr-only'>User Cart</span>
        </Button>
        {/* <UserCartWrapper
          cartItems=
          {cartItems && cartItems.items && cartItems.items.length > 0
            ?
            cartItems.items
            :
            []} /> */}
        <UserCartWrapper
        setOpenCartSheet={setOpenCartSheet}
         cartItems={cartItems.items || []} />
      </Sheet>

      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className='text-white bg-black font-extrabold'>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' className='w-56 ' >
          <DropdownMenuLabel >
            Logged in as {
              user.username.toUpperCase()
            }
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/shop/account')} className='cursor-pointer'>
            <UserRoundCheck className='mr-2 h-4 w-4' />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer' onClick={() => handleLogout()}>
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  )
}

export default function ShoppingHeader() {

  const { isAuthenticated, user } = useSelector(state => state.auth)

  return (
    <>
      <header className='sticky top-0 z-40 w-full border-b bg-background'>
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link to='/shop/home' className='flex items-center gap-2'>
            <ShoppingBag className='h-6 w-6' />
            <span className='font-bold'>DUBLIN E-commerce</span>
          </Link>
          <Sheet >
            <SheetTrigger asChild>
              <Button variant='outline' size='icon' className='lg:hidden'>
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-full max-w-xs bg-gray-100'>
              <MenuItems />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>

          <div className='hidden lg:block'>
            <MenuItems />
          </div>

          <div className='hidden lg:block'>
            <HeaderRightContent />
          </div>

        </div>
      </header>
    </>
  )
}
