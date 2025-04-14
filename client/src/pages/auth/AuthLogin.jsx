import CommanForm from '@/components/common/CommanForm'
import { loginFormControls } from '@/config'
import { useToast } from '@/hooks/use-toast'
import { loginUser } from '@/store/auth-slice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const initialState = {
    email: '',
    password: ''
}
export default function AuthLogin() {
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast()

    function onSubmit(event) {
        event.preventDefault()
        dispatch(loginUser(formData))
            .then(data => {
                if (data?.payload?.success) {
                    toast({
                        title: data?.payload?.message,
                    })                   
                    if (data?.payload?.user?.role === 'admin') {
                        navigate('/admin/dashboard')
                    } else {
                        navigate('/shop/home')
                    }
                } else {
                    toast({
                        title: data?.payload?.message || 'Login failed',
                        variant: 'destructive'
                    })
                }
            })
            .catch(error => {
                toast({
                    title: error.message || 'Login failed',
                    variant: 'destructive'
                })
            })
    }

    return (
        <>
            <div className='mx-auto w-full max-w-md space-y-6'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold tracking-tight text-foreground'>Sign in to your account</h1>

                    <p className='mt-2'>Don't have an account please
                        <Link className='font-medium ml-2  text-primary hover:underline' to='/auth/register'>Register Here</Link>
                    </p>

                </div>
                <CommanForm
                    formControls={loginFormControls}
                    buttonText={'Sign In'}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={onSubmit}
                />
            </div>
        </>
    )
}
