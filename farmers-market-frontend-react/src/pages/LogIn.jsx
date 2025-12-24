import React from 'react'
import Grid from '../components/layout/Grid'
import Image from '../components/utility/Image'
import Form from '../components/forms/Form'
import FormField from '../components/forms/FormField'
import Divider from '../components/utility/Divider'
import FormButton from '../components/forms/Button'
import Checkbox from '../components/forms/Checkbox'
import UIButton from '../components/ui/Button'

function LogInPage({ className, name, type, placeholder, label, required, value, error }) {

  return (
    <>
      <Grid classes='grid-cols-2 gap-4  overflow-hidden'>
        {/* First column */}
        <div className="w-full p-12">
          <div class="mb-8">
            <h1 class="text-3xl font-semibold text-gray-900 mb-2">Welcome back</h1>
            <p class="text-gray-600">Enter your Untitled account details.</p>
          </div>

          <UIButton text="Log In with Google" onClick="" className="mb-4 w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 mx-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </UIButton>

          <Divider  text="OR"/>
        
          <Form>
            <FormField className="mb-4" name="email" type="email" placeholder="Enter your email" label="Email" required value="" error="" onChange="" />
            <FormField className="mb-4" name="password" type="password" placeholder="Enter your password" label="Password" required value="" error="" onChange="" />
            <div class="flex items-center justify-between text-sm mb-4">
              <Checkbox text="Remember me" name="remember" checked={false} onChange=""/>
              <a href="#" class="text-gray-600 hover:text-gray-900">Forgot password?</a>
            </div>
            <FormButton text="Log In" />
          </Form>
        </div>

        {/* Image Serving as second column */}
        <Image src="adele-payman-2oYMwuFgnTg-unsplash.jpg" alt='Login background' imgClass='block w-full h-full object-cover' />
        {/* <Image src="https://images.unsplash.com/photo-1569239591652-6cc3025b07fa?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt='Login background' imgClass='block w-full h-full object-cover' /> */}
      </Grid>
    </>
  )

}

export default LogInPage